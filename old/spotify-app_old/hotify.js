var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
//var client = sp.require('client');

// expots
exports.init = init;

// options
var server = "172.31.8.50:8080";


// predefine
var ws, playlist;


function init() { 
  // playlist = new models.Playlist();
	
  // client.init({
  //   msg: 
  // });

  // // listen for player changes
  // player.observe(models.EVENT.CHANGE, onPlayerChange);
  connect();
}

exports.send = function(msg) {
  ws.send(msg);
}

function connect() {
  ws = new WebSocket("ws://" + server);
  ws.onmessage = onMsg;
  ws.onclose = function() { console.log("socket closed"); };
  ws.onopen = function() {
    console.log("connected");
    //ws.send();
  };
}

function onMsg(event) {
  console.log("onMsg: ", JSON.parse(event.data));
  //displayPlaylist();
}

function onPlayerChange(event) {
  // Only update the page if the track changed
  // if (e.data.curtrack == true) {
  //   console.log("changed: ", player.track);
  // }
}

exports.search = function search(query, cb) {
  var search = new models.Search(query);
  search.localResults = models.LOCALSEARCHRESULTS.APPEND;

  search.observe(models.EVENT.CHANGE, function() {
    search.tracks.forEach(function(track) {
      console.log(track.name);
      //playlist.add(track);
    });
    cb(search.tracks);
    //console.log(player, search.tracks[0], playlist, playlist.get(0), playlist.get(2));
    //player.play(search.tracks[0], playlist);

  });

  search.appendNext();
}

// function displayPlaylist(trackArray) {

// }




