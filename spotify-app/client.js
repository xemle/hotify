
// expots
exports.init = init;

// options
var server = "172.31.8.50:8080";

// predefine
var ws;
var callbacks = {};


function init(cbs) {
  connect(cb);
  callbacks = cbs;
}

function connect() {
  ws = new WebSocket("ws://" + server);
  ws.onmessage = onMsg;
  ws.onclose = function() { console.log("socket closed"); };
  ws.onopen = function() {
    console.log("connected");
    ws.send({room: "default"});
    if (callbacks.open) callbacks.open();
  };
}

function onMsg(event) {
  var date = JSON.parse(event.data);
  console.log("onMsg: ", event, data);
  if (callbacks.msg) callbacks.msg(data);
}






