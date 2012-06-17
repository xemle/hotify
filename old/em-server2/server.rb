require 'em-websocket'
require 'json'
require_relative "libspotify"
require_relative "server_m"

@host = "172.31.8.50"
@port = 8080


@playlist = []

@playlist.push({
  label: "10. The Black Keys - Nova Baby",
  artist: "The Black Keys",
  album:"El Camino",
  year:2011,
  genre: "Alternative",
  thumbnail: "http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/a/ad1321ee.tbn",
  title:"Nova Baby"
})

# #@playlist = '[{"label":"10. The Black Keys - Nova Baby","artist":"The Black Keys","album":"El Camino","year":2011,"genre":"Alternative","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/a/ad1321ee.tbn","title":"Nova Baby"},{"label":"05. A Tribe Called Quest - Crew","artist":"A Tribe Called Quest","album":"Beats, Rhymes & Life","year":1996,"genre":"Hip-Hop/Rap","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/5/5a5b82eb.tbn","title":"Crew"},{"label":"03. Bahamas - Montreal","artist":"Bahamas","album":"Barchords","year":2012,"genre":"Pop","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/5/5e2be68d.tbn","title":"Montreal"},{"label":"04. Balkan Brass Band - Varnensko horo","artist":"Balkan Brass Band","album":"Balkan Brass Band","year":2009,"genre":"Weltmusik","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/c/c0e6d961.tbn","title":"Varnensko horo"},{"label":"03. Electric Guest - This Head I Hold","artist":"Electric Guest","album":"American Daydream - EP","year":2012,"genre":"Alternative","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/7/709dacee.tbn","title":"This Head I Hold"},{"label":"02. Peaches - AA XXX","artist":"Peaches","album":"The Teaches of Peaches","year":2000,"genre":"Electronic","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/f/f2344293.tbn","title":"AA XXX"}]'



# def search(query)

# end


def method?(s)
  data = JSON.parse(s)
  return false unless data.is_a?(Hash)

  method = data["eventType"]
  @server.respond_to?(method)
end

EventMachine.run {
  
  puts "start ws-server #{@host} on port #{@port}"
  @channel = EM::Channel.new
  @server = ServerM.new


  EventMachine::WebSocket.start(:host => @host, :port => @port) do |ws|
    
    ws.onopen    { 
      sid = @channel.subscribe { |msg| 
        ws.send msg 
      }
      puts "connected: #{sid} ttttt"


      plst = @server.get_last_plst()
      puts plst.inspect
      ws.send( plst.to_json ) unless plst.nil?

      ws.onmessage { |msg| 
        recipient, data = @server.act(msg)

        case recipient
        when :back
          #puts "send@back: - "
          puts "back"
          ws.send( data.to_json )
        when :all
          #puts "send@all: #{data.inspect}"
          #puts "alle alle"
          #puts data.to_json
          @channel.push( data.to_json )
        end
      }

      
      ws.onclose {
        puts "diconnected: #{sid}"
        @channel.unsubscribe(sid)
      }
    }
    ws.onclose   { puts "WebSocket closed" }

        
  end
}



