package org.herrvorragend.server;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.herrvorragend.clients.xbmc.model.Response;
import org.herrvorragend.server.model.Song;

public class ModelBridge {

	private String url;
	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	private Song mapSong(Map<String,Object> result){
		Song song = new Song();
		song.setLabel(result.get("label").toString());
		song.setArtist(result.get("artist").toString());
		song.setAlbum(result.get("album").toString());
		song.setTitle(result.get("title").toString());
		song.setYear((Integer)result.get("year"));
		song.setGenre(result.get("genre").toString());
		song.setThumbnail(url+"/vfs/"+result.get("thumbnail"));
		return song;
	}
	
	public Song mapSong(Response response){
		Map<String,Object> wrapper = (Map<String,Object>)response.getResult();
		Map<String,Object> result = (Map<String,Object>)wrapper.get("item");

		return mapSong(result);
	}
	
	public List<Song> mapPlaylist(Response response){
		
		ArrayList<Song> songs = new ArrayList<Song>();
		
		Map<String,Object> wrapper = (Map<String,Object>)response.getResult();
		List<Map<String,Object>> items = (List<Map<String,Object>>)wrapper.get("items");
		for(Map<String, Object> item : items){
			songs.add(mapSong(item));
		}

		return songs;
	}
	
}
