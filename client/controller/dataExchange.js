(function($){	
	$(document).ready(function(){
		// open a websocket connection
		getActualSongInformation = function() {
			/*
			$.get("./example/interpret.json", function(data) {
				console.log(data);
				var song = $.parseJSON(data);
				songModel.title(song["title"]);
				songModel.album(song["album"]);
				songModel.interpret(song["interpret"]);
				songModel.genre(song["genre"]);
			});
			*/
			$.get("http://172.31.8.13:8080/hotify-server/services/activesong/", function(song) {
				console.log(song);
				songModel.title(song["title"]);
				songModel.album(song["album"]);
				songModel.interpret(song["artist"]);
				songModel.genre(song["genre"]);
				songModel.thumbnail(song["thumbnail"]);
			});
		};
	});
	
})(jQuery);
