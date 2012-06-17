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
    var s = '<p class="small">Aktueller Titel:</p><div class="song active"><p class="title">'+track.name +'<p><p class="artist">'+track.album.artist.name+'</p><p class="description">'+track.album.name+'</p></div>';
    div.append(s);
  }
  
  if (app.playlist().length) {
    div.append('<p class="small">Queue:</p>');
  }
  for(var i = 1, l = app.playlist().length; i < l; i++) {
    var track = app.playlist().get(i);
    var votes = app.votes[track.uri] || 0;
    var s = '<div class="song"><p class="title">'+track.name +'<span class="votes">'+votes+' votes</span><p><p class="artist">'+track.album.artist.name+'</p><p class="description">'+track.album.name+'</p></div>';
    div.append(s);
  }
  
  // var player = new views.Player();
  // player.context = app.playlist();
  // player.track = app.playlist().get(0);
  // $("body").append(player.node);
}

app.playlist().observe(models.EVENT.CHANGE, function(e){
  console.log("event1");
  //(function(){partyRender(e);})();
  partyRender(e);
});
models.player.observe(models.EVENT.CHANGE, function(e) {
  console.log("event2", partyRender);
  partyRender(e);
});



