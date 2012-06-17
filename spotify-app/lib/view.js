sp.require('javascript/jQuery/jquery-1.7.1.min.js'); 

var sp = getSpotifyApi(1);

var app = sp.require('javascript/hotify');
var views = sp.require("sp://import/scripts/api/views");
var models = sp.require('sp://import/scripts/api/models');

app.init();



app.playlist.observe(models.EVENT.CHANGE, render);
models.player.observe(models.EVENT.CHANGE, render);

function render(event) {
  if (!event.data.loaded) return;
  
  var div = $("#songs");
  div.empty();

  if (models.player.track) {
    var track = models.player.track;
    var s = '<span class="small">Aktueller Titel:</span><div class="song active">'+track.name+'</div>';
    div.append(s);
  }
  
  for(var i = 0, l = app.playlist.length; i < l; i++) {
    var track = app.playlist.get(i);
    var s = '<div class="song">'+track.name+'</div>'
    div.append(s);
  }
}