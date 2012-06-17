require 'hallon'

class Libspotify

  def initialize
    puts "Libspotify: start"
    spotify_appkey = IO.read('./spotify_appkey.key')
    @session = Hallon::Session.initialize(spotify_appkey)

    puts "login"
    @session.login "1126980044", "hackathon12"

    @session.wait_for(:logged_in) do |event, error|
      @session.logged_in?
    end
    puts "logged in"

  end

  def search(query)
    req = Hallon::Search.new(query)
    req.load
    req.tracks
  end

  def get_track_img(id)
    puts "rq"
    link = Hallon::Link.new(id)
    track = Hallon::Track.new(link)
    track.load
    track.album.cover_link.to_url
  end

  def get_cover(id)
    #puts "id: #{id}"
    link = Hallon::Link.new(id)
    link.to_url
  end

end

# lib = Libspotify.new
# tracks = lib.search("Videogames")
# tracks.each do |track|
#   puts "#{track.name} - #{track.artist.name} - #{track.album.cover_link.to_url}"
# end


# session = Hallon::Session.instance(spotify_appkey, user_agent: 'Hallon') do
#   on(:connection_error) do |error|
#     puts "[ERROR] %s" % Hallon::Error.explain(error)
#     abort
#   end

#   on(:log_message) do |message|
#     puts "[LOG] #{message}"
#   end
# end

# # make absolutely sure we’ve logged in
# session.wait_for(:connection_error) do |error|
#   session.logged_in? or Hallon::Error.maybe_raise(error)
# end

# image = Hallon::Image.new("spotify:image:3ad93423add99766e02d563605c6e76ed2b0e450")
# session.wait_for(:metadata_updated) { image.loaded? }

# puts "Image format: #{image.format}"
# puts "Where to save raw image data?"
# path = gets
# File.open(path, 'w') { |f| f.write(image.data) }
# puts "Image saved to #{path}!"


