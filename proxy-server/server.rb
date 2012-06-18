require 'em-websocket'
require 'json'
require_relative "libspotify"
require_relative "server_m"

@host = "0.0.0.0"
@port = 8080

def method?(s)
  data = JSON.parse(s)
  return false unless data.is_a?(Hash)

  method = data["eventType"] || data["requestType"]
  @server.respond_to?(method)
end

EventMachine.run {
  puts "start hotify-proxy-server #{@host} on port #{@port}"
  @channel = EM::Channel.new
  @server = ServerM.new

  EventMachine::WebSocket.start(:host => @host, :port => @port) do |ws|
    ws.onopen    { 
      sid = @channel.subscribe { |msg| 
        ws.send msg 
      }
      puts "connected: #{sid}"

      plst = @server.get_last_plst
      puts "ffuuururur"
      ws.send( plst.to_json ) unless plst.nil?

      ws.onmessage { |msg|
        puts "from #{sid}:" 
        recipient, data = @server.act(msg)

        case recipient
        when :back
          #puts "send@back: - "
          #puts "back"
          ws.send( data.to_json )
        when :all
          #puts "send@all: #{data.inspect}"
          #puts "alle alle"
          #puts data.to_json

          #puts "json"
          #puts data.to_json.
          
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



