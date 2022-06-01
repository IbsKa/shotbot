import dotenv from 'dotenv'
dotenv.config()

import { Order, ORDERSTATE, Shots } from './model/order/order.js'
import { Robot, ROBOTSTATE } from './model/robot/robot.js'

import ws from 'ws'
import express from 'express'
import path from 'path'
import cors from 'cors'
import { syncBuiltinESMExports } from 'module'

const SocketServer = ws.Server;

const ShotBot = new Robot();


var connectedUsers = [];

//init Express
var app = express();
app.use(express.json());
app.use(cors());



// use this to adjust the maximum number of beverages
// that can be ordered per berageType
const shotCapacity = process.env.VUE_APP_MAX_SHOTS || 30;
var remainingShots = new Shots(shotCapacity, shotCapacity, shotCapacity);

var orderQueue = []

// configure timeouts (in seconds)
const TIMEOUT_MOVEMENT = 5 * 60;
const TIMEOUT_POURING = 30; // one drink!


//init Express Router
const port = process.env.VUE_APP_BACKEND_PORT || 8080;


//return static page with websocket client
app.get('/', function (req, res) {
  res.json({ status: "server is running!" })
});

// endpoint for making robot go home
app.post('/gohome', (req, res) => {
  console.log("request to send robot home received");
  ShotBot.GoHome()
  updateClients();
  res.statusCode = 200;
  res.send();
  updateClients()
})
// endpoint for releasing robot from "home-lock"
app.post('/releaserobot', (req, res) => {
  console.log("request to release robot");
  ShotBot.Release()
  updateClients();
  res.statusCode = 200;
  res.send();
})

// endpoint for bringing the lift all the way down
app.post('/refillcups', (req, res) => {
  if (ShotBot.Status !== ROBOTSTATE.Homing) {
    console.log('cannot lower tray while not in maintenance mode')
    res.statusCode = 403
    res.send()
    return
  }
  console.log("request to refill cups");
  ShotBot.RefillCups()
  updateClients();
  res.statusCode = 200;
  res.send();
})

// endpoint for ordering new shots
app.post('/orders', (req, res) => {
  console.log("new order req", req.body);
  orderQueue.push(new Order(req.body.location, parseInt(req.body.shots.normal), parseInt(req.body.shots.spicy), parseInt(req.body.shots.coldBrew)));
  console.log(orderQueue)
  Object.keys(req.body.shots).forEach(s => {
    remainingShots[s] -= parseInt(req.body.shots[s])
  })
  updateClients();
  res.json(req.body);
});

// endpoint for deleting all running orders
app.delete('/orders', (req, res) => {
  console.log("purge req", req.body);
  console.log("orders about to be deleted", openOrders)

  // add shots of current orders to remaining count
  openOrders.filter(o => o.Status !== ORDERSTATE.Completed).forEach(o => {
    Object.keys(o.shots).forEach(s => {
      remainingShots[s] += parseInt(o.shots[s])
    })
  });
  console.log("remaining shots", remainingShots)
  // delete all orders
  openOrders = [];

  updateClients();
  res.statusCode = 200;
  res.send();
})

// endpoint for altering the remaining shot count
app.post('/remaining', (req, res) => {
  console.log("remaining post req", req.body);
  remainingShots = {
    coldBrew: parseInt(req.body.coldBrew),
    normal: parseInt(req.body.normal),
    spicy: parseInt(req.body.spicy)
  }

  if (remainingShots.coldBrew === 0 && remainingShots.normal === 0 && remainingShots.spicy === 0) {
    openOrders = []
  }

  updateClients();
  res.statusCode = 200;
  res.send();
})

// start the server
let server = app.listen(port, function () {
  console.log('node.js static server listening on port: ' + port + ", with websockets listener")
})

// define websocket
const wss = new SocketServer({ server });

// init Websocket ws and handle incoming connect requests
wss.on('connection', function connection(ws) {
  console.log("client connected");

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    connectedUsers.push(message);
  });

  ws.on('close', () => {
    console.log('client closed');
  })

  ws.send(JSON.stringify(statusMessage()));
});

const statusMessage = () => {
  let curJob = orderQueue.length === 0 ? null : orderQueue[0].Location;
  if (ShotBot.Status === ROBOTSTATE.Homing)
    curJob = "HOME"
  return { orders: orderQueue, job: curJob, remainingShots }
}

const updateClients = () => {
  wss.clients.forEach(client => {
    client.send(JSON.stringify(statusMessage()))
  })
}

console.log('setting up robot')
await ShotBot.Init()

while (true) {
  // sleep at the beginning to loop-reruns can wait without further code
  await new Promise(r => setTimeout(r, 1_000));

  if (ShotBot.Status === ROBOTSTATE.Homing) {
    console.log('Robot is returning home - no further processing')
    continue
  }

  if (orderQueue.length === 0) {
    console.log('no orders -> sleeping')
    continue
  }

  // pre-sort by date then get the first entry not yet completed
  let curOrder = orderQueue.sort(Order.compare).filter(o => o.Status !== ORDERSTATE.Completed)[0];

  if (curOrder === undefined) {
    console.log('all orders completed -> sleeping')
    continue
  }

  // first step -> go there
  if (curOrder.Status === ORDERSTATE.Queued && ShotBot.IsIdle()) {
    ShotBot.GoTo(curOrder.Location);
    curOrder.Status = ORDERSTATE.InTransit;
    continue
  }

  // intermediate step: await arrival
  if (curOrder.Status === ORDERSTATE.InTransit && ShotBot.Status === ROBOTSTATE.Moving) {
    console.log('robot in transit')
    // check timeout
    if ((Date.now() - ShotBot.LastAction) > TIMEOUT_MOVEMENT * 1_000) {
      console.log('timeout during robot in motion')
      ShotBot.GoHome(); // try to abort and return home
    }
    continue
  }

  // we arrived at position -> continue with pouring
  if (curOrder.Status === ORDERSTATE.InTransit && ShotBot.Status === ROBOTSTATE.Completed) {
    console.log('robot arrived')
    curOrder.Status = ORDERSTATE.Pouring;
    // robot will be set by first pour
  }

  // currently pouring a drink
  if (curOrder.Status === ORDERSTATE.Pouring && ShotBot.Status === ROBOTSTATE.Pouring) {
    console.log('robot serving drinks')
    // check timeout
    if ((Date.now() - ShotBot.LastAction) > TIMEOUT_POURING * 1_000) {
      console.log('timeout during serving drinks')
      ShotBot.GoHome(); // try to abort and return home
    }
    continue
  }

  // pour a drink
  if (curOrder.Status === ORDERSTATE.Pouring && ShotBot.Status === ROBOTSTATE.Completed) {
    console.log('triggering new pour for order:', curOrder)
    let nextShot = Shots.GetNextShot(curOrder.Shots, ShotBot.CurrentRound)
    console.log(`next shot will be ${nextShot}`)
    if (nextShot === "") {
      console.log('all shots for this order served')
      curOrder.Status = ORDERSTATE.Completed;
      continue;
    }

    ShotBot.Pour(nextShot);
    continue;
  }

  // this is the end of the loop, if we run here, no actions matched above
  console.log('well, this should never happen - no condition matched')
}
