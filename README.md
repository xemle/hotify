# Hotify

Hotify allows your guests to decide which songs are played next.

You set up a computer running [Spotify](http://http://www.spotify.com/uk/ "music sreaming application") and everbody can vist a mobile website to suggest and vote for songs that should be played next.

# Proxy Server #

The proxy server is requried for broadcasting message. It is a simple server using ruby

## Installation on Ubuntu ##

### Install Ruby and required gems ###

    $ sudo apt-get install ruby-dev
    $ sudo gem install em-websocket hallon

### Install Libspotify ###

Download libspotify.so from https://developer.spotify.com/technologies/libspotify to proxy-server/lib

If you download libspotify.so to some arbitrary location let LD know about it!

    $ export LD_LIBRARY_PATH=<directory of libspotify.so>

## Run Proxy Server ##

By default the proxy server will listen on port 8080 on all interfaces

    $ cd proxy-server
    $ ruby server.rb

# Hotify in Spotify #

Add hotify directory to spotify (directory above spotify-app) and search in spotify for spotify:app:hotify
