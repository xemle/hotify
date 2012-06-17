var module = angular.module("hotify", []);

module.factory('wsService', function ($scope) {
	
});

module.factory('trackMocks', function ($http, $waitDialog, $log) {
    var mockUrl = 'tracks.json';
    function load(key) {
        return $http({
            method: 'GET',
            url: mockUrl
        }).then(function (response) {
            return response.data;
        });
    }
    
    return {
    	load: load
    };    
});

module.factory('songStore', function ($http, $waitDialog, $log) {
    var readUrl = 'http://172.31.8.13:8080/hotify-server/services/';
    var writeUrl = readUrl;

    function read(key) {
        $waitDialog.show();
        return $http({
            method: 'GET',
            url: readUrl + key
        }).then(function (response) {
            $waitDialog.hide();
            return response.data;
        });
    }

    function write(key, value) {
        $waitDialog.show();
        value = encodeURIComponent(JSON.stringify(value));
        $http({
            method:'JSONP',
            url:writeUrl + key + '=' + value + '&callback=JSON_CALLBACK'
        }).then(function () {
                $waitDialog.hide();
            });
    }

    return {
        read:read,
        write:write
    };
});

module.controller('hotifyController', function ($scope, $navigate, songStore, trackMocks, $log) {
    $scope.storageKey = 'hotify';
    $scope.activeTrack = {title: 'title', artist: 'artist', genre: 'genre'};
    $scope.tracks = [];
    $scope.inputTitle = '';
    $scope.inputArtist = '';
    $scope.ws = null;

    $scope.searchTrack = function () {
        $scope.tracks.push({
        	title: $scope.inputText, 
        	artist: $scope.inputText, 
        	thumbnail: '', 
        	genre: '', 
        	done: false});
        $navigate('back');
        $scope.inputText = '';
    };
    $scope.showSettings = function () {
        $navigate("#settings");
    };
    $scope.showSearch = function () {
        $navigate("#search");
    };
    $scope.back = function () {
        $navigate('back');
    };
    $scope.refreshActiveSong = function () {
        songStore.read('activesong').then(function (data) {
            if (!data) {
                data = [];
            }
            $scope.activeSong = data;
        });
    };
    $scope.refreshsongs = function () {
        songStore.read('playlistitems').then(function (data) {
            if (!data) {
                data = [];
            }
            $scope.songs = data;
        });
    };
    $scope.savesongs = function () {
        // delete all checked songs
        var newsongs = [], song;
        for (var i = 0; i < $scope.songs.length; i++) {
            song = $scope.songs[i];
            if (!song.done) {
                newsongs.push(song);
            }
        }
        $scope.songs = newsongs;
        songStore.write($scope.storageKey, $scope.songs);
    };
    
    $scope.sanitizeNames = function(track) {
    	track.name = track.name.replace(/&apos;/g, "'");
    	track.album.name = track.album.name.replace(/\&apos;/g, "'");
    	track.album.artist.name = track.album.artist.name.replace(/\&apos;/g, "'");
    	return track;
    };
    
    $scope.updatePlaylist = function(data) {
    	var clean = [];
    	for (var i = 0; i < Math.min(data.tracks.length, 20); i++) {
    		clean.push($scope.sanitizeNames(data.tracks[i].data));	
    	}
    	if (clean.length) {
        	$scope.activeTrack = clean[0];
        	$scope.tracks = clean.splice(1, clean.length - 1);
    	} else {
        	$scope.activeTrack = {};
        	$scope.tracks = [];
    	}
    };
    
    /**
     * Dispatch WebSocket Events
     */
    $scope.dispatchWsData = function(data) {
    	$log.log("eventType: " + data.eventType);
    	$log.log("eventType: " + JSON.stringify(data));
    	if (data.eventType == 'PlaylistUpdated') {
    		$scope.updatePlaylist(data);
    	}
    };
    
    $scope.sendWsEvent = function(evt) {
    	if (!$scope.ws) {
    		return;
    	}
    	$scope.ws.send(JSON.stringify(evt));
    };
    
    $scope.voteTrack = function(e) {
    	var evt = {requestType: 'VoteTrack', trackId: e.track.uri};
    	$scope.sendWsEvent(evt);
    };
    
    $scope.deleteTrack = function(e) {
    	var evt = {requestType: 'DeleteTrack', trackId: e.track.uri};
    	$scope.sendWsEvent(evt);
    };
    
    $scope.createWsChannel = function(host, port) {
    	var ws = new WebSocket("ws://" + host + ":" + port);
    	ws.onmessage = function(evt) {
        	if (evt.data) {
        		var data = JSON.parse(evt.data);
        		$scope.dispatchWsData(data);
        		$scope.$apply();
        	}
    	};
    	ws.onopen = function() {
    	    $scope.sendWsEvent({requestType:"PlayList"});
    		//alert("Websocket is open!");
    	};
    	$scope.ws = ws;
    };
    
    $scope.fixHeaderWidth = function() {
    	var minWidth = $('#main').width();
    	if (minWidth < 500) {
    		$('#box-active-song').css('min-width', minWidth - 20);	
    	} 
    };
//    $scope.refreshActiveSong();
//    $scope.refreshsongs();
    $scope.createWsChannel("172.31.8.50", "8080");
});