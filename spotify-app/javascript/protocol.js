
exports.PlaylistChange = function(tracks, votes) {
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