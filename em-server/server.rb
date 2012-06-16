require 'em-websocket'

EventMachine::WebSocket.start(:host => "localhost", :port => 8080) do |ws|
  puts "start ws-server on port 8080"
  ws.onopen    { ws.send "Hello Client!"}
  ws.onmessage { |msg| ws.send "Pong: #{msg}" }
  ws.onclose   { puts "WebSocket closed" }
end