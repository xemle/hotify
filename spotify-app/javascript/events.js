

var events = {
  "PlaylistUpdate": update,
  "test": void
}

exports.init = function() {

}

exports.trigger = function(msg) {
  console.log("got event:", msg.eventType, msg);
  
  if (events[msg.eventType]) {
    events[msg.eventType].call(msg);
  }
}

function update() {
  console.log("update");
}