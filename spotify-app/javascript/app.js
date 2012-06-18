var sp = getSpotifyApi(1);

sp.require("javascript/jQuery/jquery");
var view = sp.require("javascript/view");
var models = sp.require('sp://import/scripts/api/models');
//var events = sp.require("events");

var connection = sp.require("javascript/websocket");
var playlist = sp.require("javascript/playlist");

var server = "localhost";
var port = 8080;

connection.init(server, port);

$(connection).one("connected", function(){
  playlist.init(connection);
  view.init(connection, playlist);
});