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

  var div = $("#playlist");
  div.empty();

  if (models.player.track) {
    var track = models.player.track;
    var votes = playlist.votes[track.uri] || 0;
    
    var now = $("#current-song")
    now.find(".title").html(track.name);
    now.find(".artist").html(track.album.artist.name);
    //now.find(".album").html(track.album.name);
    now.prepend('<img class="cover" src="'+track.data.album.cover+'" />')
  }
  
  var list = playlist.list.data;

  for(var i = 1, l = list.length; i < l; i++) {
    var track = list.getTrack(i);
    var votes = playlist.votes[track.uri] || 0;

    var song = $('<div class="song"></div>');
    var vote = $('<div class="votes">'+votes+'</div>')
    var title = $('<div class="title">'+track.name +'<div>');
    
    var description = $('<div class="description"></div>');
    var artist = $('<span class="artist">'+track.artists[0].name+'</span>');
    var album = $('<p class="description">'+track.album.name+'</p>');
    
    song.append(vote);
    song.append(title);
    song.append(description)

    description.append(artist);
    description.append(album);

    div.append(song);
  }
  
  var track = playlist.list.data.getTrack(0);
  models.player.play(tack, playlist.list, 0)
}