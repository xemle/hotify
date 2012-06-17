var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var views = sp.require("sp://import/scripts/api/views");


//var playlist = sp.require("lib/playlist");
//var plstPlayer = sp.require("player");


var server = "172.31.8.50:8080";
var ws = null;

GlobPlaylist = new models.Playlist();

votes = {};
exports.votes = votes;

exports.init = init;
exports.playlist = function() {
	return GlobPlaylist;
};



function PlaylistUpdateEvent(tracks) {
	console.log("aiaiaia", tracks)
	this.eventType = "PlaylistUpdated";
	this.size = tracks.length;
	this.tracks = tracks;
	this.votes = votes;
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
		createPlaylist("Modern Talking", startPlayback);
	});
	models.player.observe(models.EVENT.CHANGE, function(event) {
		console.log("#### new song");
		onPlayerChange(event);
	});
	//playlist.observe(models.EVENT.CHANGE, onPlaylistChange);
	GlobPlaylist.observe(models.EVENT.CHANGE, function(event) {
		//console.log("here 2");
		onPlaylistChangeEvent(event);
	});
	/*
	$(document).on("PlaylistChange", function(event) {
		console.log("here");
	});*/
}

/*
* Websocket
*/
function connectWS(callback) {
  ws = new WebSocket("ws://" + server);
  ws.onmessage = onRequest;
  ws.onclose = function(data) { 
	  console.log("socket closed ");
	  console.log(data);
  };
  ws.onopen = function() {
    console.log("connected");
	callback();
  };
  ws.onerror = function(data) {
	console.log("error: " + data);
  };
}

function onRequest(event){
	console.log("onRq", event);
	var request = JSON.parse(event.data)
	console.log("Received a query: "+request.requestType);
	
	var track = (function(){return models.player.track;})();
	if(request.requestType == "PlayList"){
		var tracks = GlobPlaylist.tracks;
		sendMessage(new PlaylistUpdateEvent(tracks));
	} 
	if(request.requestType == "CurrentTrack"){
		sendMessage(new PlayerChangeEvent(track));
	}
	if(request.requestType == "QuickShow"){
		var res = [];
		for(var i in GlobPlaylist.tracks){
			res.push(GlobPlaylist.tracks[i].name);
		}
		sendMessage(new PlaylistShortEvent(res));
	}
	if(request.requestType == "AddTrack"){
		GlobPlaylist.add(request.trackId);
		sendMessage(new PlaylistUpdateEvent(playlist.tracks));
	}
	if(request.requestType == "VoteTrack"){
		console.log("Got it");
		voteForTrack(request.trackId);
		var tracks = GlobPlaylist.tracks;
		for(var index in tracks){
			console.log("Before: ",tracks[index].name, votes[tracks[index].uri]);
		}
		var t0 = tracks.shift();
		tracks.sort(sortPlaylist);
		tracks.unshift(t0);
		for(var index in tracks){
			console.log("After: ", tracks[index].name, votes[tracks[index].uri]);
		}
		var newPlaylist = new models.Playlist();
		for(var index=0; index<tracks.length; index++){
			console.log("Adding", tracks[index].name, tracks[index]);
			newPlaylist.add(tracks[index]);
		}
		/*models.player.context = newPlaylist;
		models.player.track = tracks[0];
		console.log("Switched Player Context");
		(function(playlist) {
			this.playlist = playlist;
		})(newPlaylist);		
		sendMessage(new PlaylistUpdateEvent(newPlaylist.tracks));
		*/
		for (var i=GlobPlaylist.length-1; i>0; i--) { 
			GlobPlaylist.remove(GlobPlaylist.get(i)) 
		}
		
		for (var i=1; i<newPlaylist.length; i++) {
			GlobPlaylist.add(newPlaylist.get(i).uri);
		}
		sendMessage(new PlaylistUpdateEvent(GlobPlaylist.tracks));
	}
}



function sendMessage(object) {
	//console.log("Object type " +object.eventType);
	var json = JSON.stringify(object);
	console.log("send message ", object);
	ws.send(json);
	//console.log("message send");
}

/*
* Spotify functions
*/

function onPlaylistChangeEvent(event) {
	console.log("*** playlist changed");
	sendMessage(new PlaylistUpdateEvent(GlobPlaylist.tracks));
}

function onPlayerChange(event){
	if(event.data.curtrack == true){
		sendMessage(new PlayerChangeEvent(models.player.track));
	}
	/*
	var currentTrackId = models.player.track.uri;
	var newTrackList = [];
	var includeTrack = false;
	
	for(var index in GlobPlaylist.tracks){
		var track = GlobPlaylist.tracks[index];
		if(track.uri == currentTrackId && includeTrack == false){
			includeTrack = true;
		}
		if(includeTrack){
			newTrackList.push(track);
		}
	}*/

	//var tmp = [];
	//tmp.push(GlobPlaylist.tracks);

	if (models.player.index > 0) {
		var first = GlobPlaylist.get(0);
		GlobPlaylist.remove(first);
	}
	

	sendMessage(new PlaylistUpdateEvent(GlobPlaylist.tracks));
}

function startPlayback(playlist, tracks){
	var playerView = new views.Player();
	playerView.track = null; // Don't play the track right away
	playerView.context = playlist;
	player.play(playlist.get(0).uri);
	sendMessage(new PlaylistUpdateEvent(tracks));
	$('#player').append(playerView.node);
}

function createPlaylist(query, callback){
	var search = new models.Search(query);
	search.pageSize = 5;
	search.localResults = models.LOCALSEARCHRESULTS.APPEND;

	search.observe(models.EVENT.CHANGE, function() {
		console.log("arrr");
		//var playlist = new models.Playlist();
		var tracks = [];
		search.tracks.forEach(function(track) {
			GlobPlaylist.add(track);
			tracks.push(track);
		});
		
		callback(GlobPlaylist, tracks);
		
	});
	search.appendNext();
}

/*
* Vote Functions
*/

function voteForTrack(trackid){
	
	var votes  = (function(){return this.votes;})();
	if(!(trackid in votes) ){
		votes[trackid] = 1;
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