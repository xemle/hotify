
var list = [];
var ws;

// exports.init = function(_ws) {
//   ws = _ws;
// }

exports.add = function(track) {
  list.push({
    track: track,
    votes: 0
  })
}

function sort() {
  var changed = false;
  function sortFn(a, b){
    if (a.votes == b.votes) return 0;
    if (a.votes > b.votes) {
      changed = true;
      return 1;
    } else {
      return -1;
    }
  }
  list.sort(sortFn);
  if (changed) {
    $(document).trigger("PlaylistChanged");
    // trigger Change
  }
  return list;
}


exports.vote = function(track) {
  var a = list.filter(function(t) { return t.id == track.id });
  sort();

}

exports.shift = function() {
  $(document).trigger("PlaylistChanged");
  return list.shift();
}
