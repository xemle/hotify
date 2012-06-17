class ServerM
  
  def initialize
    @lib = Libspotify.new
    @img_cach = {} 
    
    @events = {
      "PlaylistUpdated" => [:all, :update],
      "search" => [:back, :search]
    }

  end

  def act(msg)
    data = JSON.parse(msg)
    event = data["eventType"]
    
    method = @events.fetch(event, [:all, nil])
    
    puts "event: #{event} - #{method.last} - @#{method.first}"
    return [:all, data] if method.last == nil

    #puts data.inspect if (event == "PlaylistUpdated") 

    r, m = @events[event]
    d = send(m, data)
    [r, d]
  end

  def search(data)
    query = data["query"]
    return { error: "no query passed" } if query.nil?

    tracks = @lib.search(query)
    
    result = []
    tracks.each do |track|
      result.push({
        title: track.name,
        artist: track.artist,
        thumbnail: track.album.cover_link.to_url,
        album: track.album.name,
        id: track.to_link.to_str
      });
      #binding.pry
      #puts "#{track.name} - #{track.artist.name} - #{track.album.cover_link.to_url}"
    end
    result 
  end

  def update(data)
    #puts data.keys

    #{"data":{"type":"track","starred":false,"availableForPlayback":true,"availability":0,"isLoaded":true,"isInvalid":false,"isLocal":false,"isAd":false,"isPlaceholder":false,"uri":"spotify:track:5KRRcT67VNIZUygEbMoIC1","album":{"type":"album","artist":{"type":"artist","name":"The Smashing Pumpkins","uri":"spotify:artist:40Yq4vzPs9VNUrIBG5Jr2i","portrait":"spotify:image:292be1cebce499a260c544e3f40b20b5951eb1f3"},"name":"Mellon Collie And The Infinite Sadness","availableForPlayback":true,"availability":0,"numTracks":0,"year":2005,"uri":"spotify:album:09LdvC3k8ybEmyeiShUWw2","cover":"spotify:image:8cb87b3db1bc3b0068657cb4657b15fd658e863f"},"artists":[{"type":"artist","name":"Smashing Pumpkins","uri":"spotify:artist:6ilWQselvAn5nhbN0tax10","portrait":""}],"discNumber":0,"duration":266000,"name":"1979","popularity":70,"trackNumber":5}},
    data["tracks"].each do |track|
      #puts track.keys
      #puts "cover: #{}"
      # puts "cover: #{track["data"]["cover"].inspect}"
      id = track["data"]["album"]["cover"]
      track["data"]["thumbnail"] = @lib.get_cover(id);
    end
    data
  end

  def get_track_img(id)
    @img_cach.fetch(id) do
      @img_cach[id] = @lib.get_track_img(id) 
    end
  end

  def get_cover(id)
    @img_cach.fetch(id) do
      @img_cach[id] = @lib.get_cover(id) 
    end
  end


end



