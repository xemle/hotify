(function($){
	
	// Here's my data model
	$(document).ready(function(){
		songModel = {
		    title: ko.observable("Amarica"),
		    interpret: ko.observable("Offspring"),
		    length: ko.observable("3.17"),
		    genre: ko.observable("Rock"),
		    album: ko.observable("All in one"),
		    votes: ko.observable("199")
		};
		
		songModel.details = ko.computed(function() {
	        return this.album() + " (" + this.genre() + ")";
		}, songModel);
		
		ko.applyBindings(songModel); 
	});
	
})(jQuery);


