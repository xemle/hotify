package org.herrvorragend.server;

import java.util.List;

import org.herrvorragend.clients.xbmc.XBMCClient;
import org.herrvorragend.clients.xbmc.model.Response;
import org.herrvorragend.server.model.Song;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HotifyController {

	@Autowired
	private XBMCClient client;
	
	@Autowired
	private ModelBridge bridge;
	
	@RequestMapping(method=RequestMethod.GET, value="/skipsong")
	public @ResponseBody String skipSong(){
		Response response = client.skipSong();
		return "OK";
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/activesong")
	public @ResponseBody Song getActiveSong(){
		Response response = client.getActiveItem();
		return bridge.mapSong(response);
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/playlistitems")
	public @ResponseBody List<Song> getPlaylistItems(){
		Response response = client.getPlayListItems();
		return bridge.mapPlaylist(response);
	}
 
}
