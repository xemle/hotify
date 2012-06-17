class ServerM
  
  def initialize
    @lib = Libspotify.new
    @img_cach = {} 
    
    @events = {
      "PlaylistUpdated" => [:all, :update],
      "Search" => [:back, :search]
    }

  end

  def act(msg)
    data = JSON.parse(msg)
    event = data["eventType"] || data["requestType"]
    
    method = @events.fetch(event, [:all, "none"])
    
    puts "event: #{event} - #{method.last} - @#{method.first}"
    return [:all, data] if method.last == "none"

    #puts data.inspect if (event == "PlaylistUpdated") 

    r, m = @events[event]
    d = send(m, data)
    #puts "jo"
    #puts d
    [r, d]
  end

  def search(data)
    result = {}
    result["eventType"] = "Search"

    if data["query"].nil?
      result["error"] = "no query passed"
      return result
    end

    if data["query"] == ""
      result["error"] = "query empty"
      return result
    end

    query = data["query"]
    result["query"] = query
    tracks = @lib.search(query)
    
    res = []
    tracks.each do |track|
      res.push({
        title: track.name,
        artist: track.artist.name,
        thumbnail: track.album.cover_link.to_url,
        album: track.album.name,
        id: track.to_link.to_str
      });
      #binding.pry
      #puts "#{track.name} - #{track.artist.name} - #{track.album.cover_link.to_url}"
    end
    result["data"] = res 

    result
  end

  def update(data)
    #puts "update"
    #puts data.keys

    #{"data":{"type":"track","starred":false,"availableForPlayback":true,"availability":0,"isLoaded":true,"isInvalid":false,"isLocal":false,"isAd":false,"isPlaceholder":false,"uri":"spotify:track:5KRRcT67VNIZUygEbMoIC1","album":{"type":"album","artist":{"type":"artist","name":"The Smashing Pumpkins","uri":"spotify:artist:40Yq4vzPs9VNUrIBG5Jr2i","portrait":"spotify:image:292be1cebce499a260c544e3f40b20b5951eb1f3"},"name":"Mellon Collie And The Infinite Sadness","availableForPlayback":true,"availability":0,"numTracks":0,"year":2005,"uri":"spotify:album:09LdvC3k8ybEmyeiShUWw2","cover":"spotify:image:8cb87b3db1bc3b0068657cb4657b15fd658e863f"},"artists":[{"type":"artist","name":"Smashing Pumpkins","uri":"spotify:artist:6ilWQselvAn5nhbN0tax10","portrait":""}],"discNumber":0,"duration":266000,"name":"1979","popularity":70,"trackNumber":5}},
    data["tracks"].each do |track|
      #puts track.keys
      #puts "cover: #{}"
      # puts "cover: #{track["data"]["cover"].inspect}"

      #puts track.to_json

      if track.is_a?(Array)
        puts "tracks == Array"
        id = track[0]["data"]["album"]["cover"]
        track[0]["data"]["thumbnail"] = @lib.get_cover(id)
      else
        #puts "ttt: " + track.inspect
        
        begin
          id = track["data"]["album"]["cover"]
          id = track["data"]["album"]["cover"]
        rescue
          id = "spotify:track:7bjpERQ3NwtE65H2aMBjtD"
        end
        track["data"]["thumbnail"] = @lib.get_cover(id)
      end
    end
    @last_plst = data
    data
  end

  def get_track_img(id)
    #@img_cach.fetch(id) do
      @img_cach[id] = @lib.get_track_img(id) 
    #end
  end

  def get_cover(id)
    #@img_cach.fetch(id) do
      @img_cach[id] = @lib.get_cover(id) 
    #end
  end

  def get_last_plst
    @last_plst
  end

end



