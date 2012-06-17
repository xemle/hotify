var sp = getSpotifyApi(1);

sp.require('javascript/jQuery/jquery-1.7.1.min'); 

var app = sp.require('javascript/hotify');
var views = sp.require("sp://import/scripts/api/views");
var models = sp.require('sp://import/scripts/api/models');

app.init();



function partyRender(event) {
  console.log("render");

  //if (!event.data.loaded) return;
  
  var div = $("#songs");
  div.empty();

  if (models.player.track) {
    var track = models.player.track;
    var votes = app.votes[track.uri] || 0;
    var s = '<span class="small">Aktueller Titel:</span><div class="song active">'+track.name+' ' + votes+'</div>';
    div.append(s);
  }
  
  for(var i = 0, l = app.playlist.length; i < l; i++) {
    var track = app.playlist.get(i);
    var votes = app.votes[track.uri] || 0;
    var s = '<div class="song">'+track.name+' ' + votes+'</div>'
    div.append(s);
  }
  
  var player = new views.Player();
  player.context = playlist;
  player.track = playlist.get(0);
  $("body").append(player.node);
}

app.playlist.observe(models.EVENT.CHANGE, function(e){
  console.log("event1");
  //(function(){partyRender(e);})();
  partyRender(e);
});
models.player.observe(models.EVENT.CHANGE, function(e) {
  console.log("event2", partyRender);
  partyRender(e);
});



