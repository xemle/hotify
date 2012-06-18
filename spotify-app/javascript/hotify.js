var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var views = sp.require("sp://import/scripts/api/views");


//var playlist = sp.require("lib/playlist");
//var plstPlayer = sp.require("player");



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
	//console.log("Received:", votes, votesA, votesB);
	//console.log("Will sort with: ", votesB - votesA);
	return votesB - votesA; 
}