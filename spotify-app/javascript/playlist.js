var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var views = sp.require("sp://import/scripts/api/views");
var protocol = sp.require("javascript/protocol");

var playlist = new models.Playlist();
var connection;
votes = {};
exports.votes = votes;
exports.list = playlist;

exports.init = function(_connection) {
  connection = _connection;

  createPlaylist("Modern Talking", startPlayback);
  
  models.player.observe(models.EVENT.CHANGE, onPlayerChange);
  playlist.observe(models.EVENT.CHANGE, onPlaylistChangeEvent);
}

function onPlaylistChangeEvent(event) {
  console.log("onPlaylistChangeEvent", event);
  
  $(exports).trigger("PlaylistChange");
  var tracks = playlist.tracks;
  connection.send( new protocol.PlaylistChange(tracks, votes) );
}


function onPlayerChange(event){
  console.log("onPlayerChange", event);
  
  // if(event.data.curtrack == true){
  //   //sendMessage(new PlayerChangeEvent(models.player.track));
  // }

  // if (models.player.index > 0) {
  //   var first = GlobPlaylist.get(0);
  //   GlobPlaylist.remove(first);
  // }

  //sendMessage(new PlaylistUpdateEvent(GlobPlaylist.tracks));
}

function startPlayback(){
  var playerView = new views.Player();
  playerView.track = null; // Don't play the track right away
  playerView.context = playlist;
  player.play(playlist.get(0).uri);
  //sendMessage(new PlaylistUpdateEvent(tracks));
  $('body').append(playerView.node);
}

// filles the playlist with random songs 
// for testing
function createPlaylist(query, callback){
  search(query, 5, function(tracks) {
    tracks.forEach(function(track) {
       playlist.add(track);
    });
    callback();
  });
}

function search(query, results, cb) {
  var search = new models.Search(query);
  search.pageSize = results;
  search.localResults = models.LOCALSEARCHRESULTS.APPEND;

  search.observe(models.EVENT.CHANGE, function() {
    cb(search.tracks);
  });
  search.appendNext();
}

function voteForTrack(trackid){
  if( trackid in votes ){
    votes[trackid] = votes[trackid]+1;
  } else {
    votes[trackid] = 1;
  }
}

function sortPlaylist(trackA, trackB){
  var votesA = votes[trackA.uri] || 0;
  var votesB = votes[trackB.uri] || 0;
  return votesB - votesA; 
}

