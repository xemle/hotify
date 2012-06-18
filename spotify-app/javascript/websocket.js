
var connection;

exports.init = function(server, port) {
  connect(server, port)
}

function connect() {
  var url = "ws://" + server + ":" + port;
  connection = new WebSocket(url);
  connection.onopen = onopen;
  connection.onmessage = onmessage;
  connection.onclose = onclose;
  connection.onerror = onerror;
}

exports.send = function(data) {
  // console.log("send message ", object);
  if ( is_connected() ) {
    var json = JSON.stringify(data);
    var a = connection.send(json);
  } else {
    console.log("omfg!! no connection, no send()!", data);
  }
}


/**
*** Connection Events
**/

function onopen(event) {
  console.log("connected", event);
  $(exports).trigger("connected");
}

function onmessage(event) {
  console.log("onmessage", event);
  var data = JSON.parse(event.data);
  $(exports).trigger("receivedMsg", data);
}

function onclose(event) { 
  console.log("disconnected", event);
}

function onerror(event) {
  console.log("connection error", event);
}




// function onRequest(event){
//   console.log("onRq", event);
//   var request = JSON.parse(event.data)
//   console.log("Received a query: "+request.requestType);
  
//   var track = (function(){return models.player.track;})();
//   if(request.requestType == "PlayList"){
//     var tracks = GlobPlaylist.tracks;
//     sendMessage(new PlaylistUpdateEvent(tracks));
//   } 
//   if(request.requestType == "CurrentTrack"){
//     sendMessage(new PlayerChangeEvent(track));
//   }
//   if(request.requestType == "QuickShow"){
//     var res = [];
//     for(var i in GlobPlaylist.tracks){
//       res.push(GlobPlaylist.tracks[i].name);
//     }
//     sendMessage(new PlaylistShortEvent(res));
//   }
//   if(request.requestType == "AddTrack"){
//     GlobPlaylist.add(request.trackId);
//     sendMessage(new PlaylistUpdateEvent(playlist.tracks));
//   }
//   if(request.requestType == "VoteTrack"){
//     //console.log("Got it");
//     voteForTrack(request.trackId);
//     var tracks = GlobPlaylist.tracks;
//     for(var index in tracks){
//       //console.log("Before: ",tracks[index].name, votes[tracks[index].uri]);
//     }
//     var t0 = tracks.shift();
//     tracks.sort(sortPlaylist);
//     tracks.unshift(t0);
//     for(var index in tracks){
//       //console.log("After: ", tracks[index].name, votes[tracks[index].uri]);
//     }
//     var newPlaylist = new models.Playlist();
//     for(var index=0; index<tracks.length; index++){
//       //console.log("Adding", tracks[index].name, tracks[index]);
//       newPlaylist.add(tracks[index]);
//     }
//     /*models.player.context = newPlaylist;
//     models.player.track = tracks[0];
//     console.log("Switched Player Context");
//     (function(playlist) {
//       this.playlist = playlist;
//     })(newPlaylist);    
//     sendMessage(new PlaylistUpdateEvent(newPlaylist.tracks));
//     */
//     for (var i=GlobPlaylist.length-1; i>0; i--) { 
//       GlobPlaylist.remove(GlobPlaylist.get(i)) 
//     }
    
//     for (var i=1; i<newPlaylist.length; i++) {
//       GlobPlaylist.add(newPlaylist.get(i).uri);
//     }
//     sendMessage(new PlaylistUpdateEvent(GlobPlaylist.tracks));
//   }
// }



// ws.readyState:
// var states = {
//   0: "CONNECTING", //The connection is not yet open.
//   1: "OPEN",       //The connection is open and ready to communicate.
//   2: "CLOSING",    // The connection is in the process of closing.
//   2: "CLOSED"      // The connection is closed or couldn't be opened.
// }

function is_connected() {
  return connection.readyState == 1;
}

