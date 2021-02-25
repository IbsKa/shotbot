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
const shotCapacity = 30;
const remainingShots = {
    coldBrew: shotCapacity,
    normal: shotCapacity,
    spicy: shotCapacity
}
const openOrders = []

//init Express Router
var router = express.Router();
var port = process.env.VUE_APP_BACKEND_PORT || 8080;

//return static page with websocket client
app.get('/', function(req, res) {
  res.json({status: "server is running!"})
});


// new order endpoint
app.post('/new', (req, res) => {
  console.log(req.body);
  openOrders.push(req.body);
  Object.keys(req.body.shots).forEach(s => {
    remainingShots[s] -= req.body.shots[s]
  })
  updateClients();
  res.json(req.body);
});

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