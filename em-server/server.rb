require 'em-websocket'
require 'json'

@playlist = []
clients = []

#@playlist = '[{"label":"10. The Black Keys - Nova Baby","artist":"The Black Keys","album":"El Camino","year":2011,"genre":"Alternative","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/a/ad1321ee.tbn","title":"Nova Baby"},{"label":"05. A Tribe Called Quest - Crew","artist":"A Tribe Called Quest","album":"Beats, Rhymes & Life","year":1996,"genre":"Hip-Hop/Rap","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/5/5a5b82eb.tbn","title":"Crew"},{"label":"03. Bahamas - Montreal","artist":"Bahamas","album":"Barchords","year":2012,"genre":"Pop","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/5/5e2be68d.tbn","title":"Montreal"},{"label":"04. Balkan Brass Band - Varnensko horo","artist":"Balkan Brass Band","album":"Balkan Brass Band","year":2009,"genre":"Weltmusik","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/c/c0e6d961.tbn","title":"Varnensko horo"},{"label":"03. Electric Guest - This Head I Hold","artist":"Electric Guest","album":"American Daydream - EP","year":2012,"genre":"Alternative","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/7/709dacee.tbn","title":"This Head I Hold"},{"label":"02. Peaches - AA XXX","artist":"Peaches","album":"The Teaches of Peaches","year":2000,"genre":"Electronic","thumbnail":"http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/f/f2344293.tbn","title":"AA XXX"}]'


@playlist.push({
  label: "10. The Black Keys - Nova Baby",
  artist: "The Black Keys",
  album:"El Camino",
  year:2011,
  genre: "Alternative",
  thumbnail: "http://172.31.8.13:8090/vfs/special://masterprofile/Thumbnails/Music/a/ad1321ee.tbn",
  title:"Nova Baby"
  })

def onOpen(ws)
  #clients.push(ws)
  #ws.send '
  
end

def sendPlaylist(clients)
  clients.each do |ws|
    ws.send('{"test":5}')
  end
end

EventMachine::WebSocket.start(:host => "172.31.8.50", :port => 8080) do |ws|
  puts "start ws-server on port 8080"
  @channel = EM::Channel.new
 
  ws.onopen    { 
    sid = @channel.subscribe { |msg| 
      puts "sub"
      ws.send msg.to_json 
    }
    
    #@channel.push "#{sid} connected!"

    ws.onmessage { |msg|
      #@channel.push "<#{sid}>: #{msg}"
    }

    ws.onclose {
      @channel.unsubscribe(sid)
    }
  }
  ws.onclose   { puts "WebSocket closed" }


  EventMachine::PeriodicTimer.new(5) do
    puts "push"
    @channel.push(@playlist)
  end
      
end

