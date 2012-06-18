var sp = getSpotifyApi(1);

var views = sp.require("sp://import/scripts/api/views");
var models = sp.require('sp://import/scripts/api/models');

var connection;
var playlist;

exports.init = function(_connection, _playlist) {
  connection = _connection;
  playlist = _playlist;
  //render();

  $(connection).one("connected", render);
  $(playlist).on("PlaylistChange", render)
}

function render(event) {
  console.log("render");

  var div = $("#songs");
  div.empty();

  if (models.player.track) {
    var track = models.player.track;
    var votes = playlist.votes[track.uri] || 0;
    var s = '<p class="small">Aktueller Titel:</p><div class="song active"><p class="title">'+track.name +'<p><p class="artist">'+track.album.artist.name+'</p><p class="description">'+track.album.name+'</p></div>';
    div.append(s);
  }
  
  var list = playlist.list.data;

  if (list.length) {
    div.append('<p class="small">Queue:</p>');
  }
  for(var i = 1, l = list.length; i < l; i++) {
    var track = list.getTrack(i);
    var votes = playlist.votes[track.uri] || 0;
    var s = '<div class="song"><p class="title">'+track.name +'<span class="votes">'+votes+'</span><p><p class="artist">'+track.album.artist.name+'</p><p class="description">'+track.album.name+'</p></div>';
    div.append(s);
  }
  
  var track = playlist.list.data.getTrack(0);
  models.player.play(tack, playlist.list, 0)
}