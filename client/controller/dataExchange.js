(function($){	
	$(document).ready(function(){
		// open a websocket connection
		getActualSongInformation = function() {
			$.get("./example/interpret.json", function(data) {
				console.log(data);
				var song = $.parseJSON(data);
				songModel.title(song["title"]);
				songModel.album(song["album"]);
				songModel.interpret(song["interpret"]);
				songModel.genre(song["genre"]);
			});
		};
	});
	
})(jQuery);
