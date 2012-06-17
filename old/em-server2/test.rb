require 'em-websocket'
require 'json'
require_relative "libspotify"
require_relative "server_m"
require "pry"
require "ap"

@server = ServerM.new
#tracks = @server.search({"query"=> "Video"})
#tracks = @server.get_track_img("spotify:track:6iqBiGFvgWvSwPCZNsacZE");
#tracks = @server.get_track_img("spotify:track:6iqBiGFvgWvSwPCZNsacZE");
tracks = @server.get_cover("spotify:image:8cb87b3db1bc3b0068657cb4657b15fd658e863f");
ap tracks
