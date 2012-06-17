var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var views = sp.require("sp://import/scripts/api/views");
sp.require("js/jquery-1.7.1.min");
var server = "172.31.8.50:8080";
var ws = null;
playlist = null;
votes = new Object();

exports.init = init;

function PlaylistUpdateEvent(tracks) {
	this.eventType = "PlaylistUpdated";
	this.size = tracks.length;
	this.tracks = tracks;
}

function PlayerChangeEvent(track) {
	this.eventType = "PlayerChange";
	this.track = track;
}

function PlaylistShortEvent(track) {
	this.eventType = "PlaylistShort";
	this.tracks = track;
}

function WebsocketQuery(queryFor, trackid){
	this.type = queryFor;
	this.trackid = trackid;
}

function init() {
	console.log("init()");
	connectWS(function() {
		createPlaylist("Man o War", startPlayback);
	});
	models.player.observe(models.EVENT.CHANGE, onPlayerChange);
}

/*
* Websocket
*/
function connectWS(callback) {
  ws = new WebSocket("ws://" + server);
  ws.onmessage = onRequest;
  ws.onclose = function() { console.log("socket closed"); };
  ws.onopen = function() {
    console.log("connected");
	callback();
  };
  ws.onerror = function(data) {
	console.log("error: " + data);
  };
}

function onRequest(event){
	console.log(event)
	var request = JSON.parse(event.data)
	console.log("Received a query: "+request.requestType);
	var playlist = (function(){return this.playlist;})();
	var track = (function(){return models.player.track;})();
	if(request.requestType == "PlayList"){
		var tracks = playlist.tracks;
		sendMessage(new PlaylistUpdateEvent(tracks));
	} 
	if(request.requestType == "CurrentTrack"){
		sendMessage(new PlayerChangeEvent(track));
	}
	if(request.requestType == "QuickShow"){
		var res = [];
		for(var i in playlist.tracks){
			res.push(playlist.tracks[i].name)
		}
		sendMessage(new PlaylistShortEvent(res));
	}
	if(request.requestType == "VoteTrack"){
		console.log("Got it");
		voteForTrack(request.trackId);
		var tracks = playlist.tracks;
		for(var index in tracks){
			console.log("Before: ",tracks[index].name, votes[tracks[index].uri]);
		}
		tracks.sort(sortPlaylist);
		for(var index in tracks){
			console.log("After: ", tracks[index].name, votes[tracks[index].uri]);
		}
		var newPlaylist = new models.Playlist();
		for(var index=0; index<tracks.length; index++){
			console.log("Adding", tracks[index].name, tracks[index]);
			newPlaylist.add(tracks[index]);
		}
		models.player.context = newPlaylist;
		models.player.track = tracks[0];
		console.log("Switched Player Context");
		(function(playlist) {
			this.playlist = playlist;
		})(newPlaylist);		
		sendMessage(new PlaylistUpdateEvent(newPlaylist.tracks));
	}
}

function sendMessage(object) {
	console.log("Object type " +object.eventType);
	var json = JSON.stringify(object);
	//console.log("send message " + json);
	ws.send(json);
	console.log("message send");
}

/*
* Spotify functions
*/

function onPlayerChange(event){
	if(event.data.curtrack == true){
		sendMessage(new PlayerChangeEvent(models.player.track));
	}
	var currentTrackId = models.player.track.uri
	var newTrackList = []
	var includeTrack = false;
	var playlist = (function(){return this.playlist;})();
	for(var index in playlist.tracks){
		var track = playlist.tracks[index];
		if(track.uri == currentTrackId && includeTrack == false){
			includeTrack = true;
		}
		if(includeTrack){
			newTrackList.push(track)
		}
	}
	playlist.tracks = newTrackList;
	(function(playlist) {
		this.playlist = playlist;
	})(playlist);
	
	sendMessage(new PlaylistUpdateEvent(newTrackList));
}

function startPlayback(playlist, tracks){
	var playerView = new views.Player();
	playerView.track = null; // Don't play the track right away
	playerView.context = playlist;
	sendMessage(new PlaylistUpdateEvent(tracks));
	$('#player').append(playerView.node);
}

function createPlaylist(query, callback){
	var search = new models.Search(query);
	search.pageSize = 5;
	search.localResults = models.LOCALSEARCHRESULTS.APPEND;

	search.observe(models.EVENT.CHANGE, function() {

		var playlist = new models.Playlist();
		var tracks = [];
		search.tracks.forEach(function(track) {
			playlist.add(track)
			tracks.push(track);
		});
		
		(function(playlist) {
			this.playlist = playlist;
		})(playlist);
		
		callback(playlist, tracks)
		
	});
	search.appendNext();
}

/*
* Vote Functions
*/

function voteForTrack(trackid){
	var playlist = (function(){return this.playlist;})();
	var votes  = (function(){return this.votes;})();
	if(!(trackid in votes) ){
		votes[trackid] = 1
	} else {
		votes[trackid] = votes[trackid]+1;
	}
}

function sortPlaylist(trackA, trackB){
	var votes  = (function(){return this.votes;})();
	var votesA = votes[trackA.uri] || 0;
	var votesB = votes[trackB.uri] || 0;
	console.log("Received:", votes, votesA, votesB);
	console.log("Will sort with: ", votesB - votesA);
	return votesB - votesA; 
}