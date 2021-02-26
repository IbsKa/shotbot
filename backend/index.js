const SocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var cors = require('cors')
var connectedUsers = [];

//init Express
var app = express();
app.use(express.json());
app.use(cors());

// use this to adjust the maximum number of beverages
// that can be ordered per berageType
const shotCapacity = process.env.VUE_APP_MAX_SHOTS || 30;
var remainingShots = {
    coldBrew: shotCapacity,
    normal: shotCapacity,
    spicy: shotCapacity
}
var openOrders = []

//init Express Router
const port = process.env.VUE_APP_BACKEND_PORT || 8080;

//return static page with websocket client
app.get('/', function(req, res) {
  res.json({status: "server is running!"})
});


// endpoint for ordering new shots
app.post('/orders', (req, res) => {
  console.log("new order req", req.body);
  openOrders.push(req.body);
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
  openOrders.forEach(o => {
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
var server = app.listen(port, function () {
    console.log('node.js static server listening on port: ' + port + ", with websockets listener")
})

// define websocket
const wss = new SocketServer({ server });

// init Websocket ws and handle incoming connect requests
wss.on('connection', function connection(ws) {
    console.log("connection ...");

    // 
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        connectedUsers.push(message);
    });

    ws.on('close', () => {
      console.log('client closed');
    })

    //var statusMessage = {orders: openOrders, job: openOrders.length === 0 ? null : openOrders[0].place, remainingShots}
    ws.send(JSON.stringify(statusMessage()));
});

statusMessage = () => {
  return {orders: openOrders, job: openOrders.length === 0 ? null : openOrders[0].place, remainingShots}
}

updateClients = () => {
    wss.clients.forEach(client => {
    client.send(JSON.stringify(statusMessage()))
  })
}