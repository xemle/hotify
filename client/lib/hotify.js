var module = angular.module("hotify", []);

module.factory('songStore', function ($http, $waitDialog) {
    var readUrl = 'https://secure.openkeyval.org/';
    var writeUrl = 'https://secure.openkeyval.org/store/?';

    function read(key) {
        $waitDialog.show();
        return $http({
            method:'JSONP',
            url:readUrl + key + '?callback=JSON_CALLBACK'
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
    }
});

module.controller('hotifyController', function ($scope, $navigate, songStore) {
    $scope.storageKey = 'JQueryMobileAngulartodoapp';
    $scope.songs = [];
    $scope.inputText = '';

    $scope.addsong = function () {
        $scope.songs.push({title: $scope.inputTitle, artist: $scope.inputArtist, done: false});
        $scope.inputTitle = '';
        $scope.inputArtist = '';
    };
    $scope.showSettings = function () {
        $navigate("#settings");
    };
    $scope.back = function () {
        $navigate('back');
    };
    $scope.refreshsongs = function () {
        songStore.read($scope.storageKey).then(function (data) {
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

    $scope.refreshsongs();
});