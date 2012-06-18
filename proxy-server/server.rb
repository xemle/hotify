require 'em-websocket'
require 'json'
#require_relative "libspotify"
require_relative "server_m"

@host = "localhost"
@port = 8080

class EM::Channel
  def uid; @uid end
end


def method?(s)
  data = JSON.parse(s)
  return false unless data.is_a?(Hash)

  method = data["eventType"] || data["requestType"]
  @server.respond_to?(method)
end

EventMachine.run {
  
  puts "start ws-server #{@host} on port #{@port}"
  @channel = EM::Channel.new
  @server = ServerM.new

  EventMachine::PeriodicTimer.new(5) do
    #@channel.push( @playlist.to_json )
  end

  EventMachine::WebSocket.start(:host => @host, :port => @port) do |ws|
    ws.onopen    { 
      sid = @channel.uid + 1 # cheat
      sid = @channel.subscribe { |msg, id| 
        ws.send(msg) if sid != id
      }
      puts "connected: #{sid}"
      #ws.send( {msg: "hello"}.to_json )

      ws.onmessage { |msg|
        puts "from #{sid}:" 
        recipient, data = @server.act(msg)

        case recipient
        when :back
          #ws.send( data.to_json )
        when :all
          @channel.push( [data.to_json, sid])
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



