package org.herrvorragend.clients.xbmc;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.herrvorragend.clients.xbmc.model.Request;
import org.herrvorragend.clients.xbmc.model.Response;
import org.springframework.web.client.RestTemplate;

public class XBMCClient {

	
	//private static final String URI = "http://localhost:8091/jsonrpc";
	
	@Resource(name="xbmcJsonTemplate")
	RestTemplate template;
	
	private String hostName;
	
	public void setHostName(String hostName) {
		this.hostName = hostName;
	}
	
	private String generateUrl(){
		return hostName+"/jsonrpc";
	}

	public Response skipSong(){
		Request request = new Request("Player.GoNext");
		request.addParam("playerid", 0);
		Response response = template.postForObject(generateUrl(), request, Response.class);
		return response;
	}
	
	public Response getPlayers(){
		
		Response response = template.postForObject(generateUrl(), new Request("Player.GetActivePlayers"), Response.class);
		return response;
	}

	public Response getPlaylists(){
		Response response = template.postForObject(generateUrl(), new Request("Playlist.GetPlaylists"), Response.class);
		return response;
	}
	
	public Response getPlayListItems(){
		
		Request request = new Request("Playlist.GetItems");
		request.addParam("playlistid", 0);
		request.addParam("properties", getSongProperties());
		Response response = template.postForObject(generateUrl(), request, Response.class);
		
		return response;
	}
	
	public Response getActiveItem(){
		Request request = new Request("Player.GetItem");
		request.addParam("playerid", 0);
		List<String> properties = getSongProperties();
		
		request.addParam("properties", properties);
		
		Response response = template.postForObject(generateUrl(), request, Response.class);
		return response;
	}
	
	private List<String> getSongProperties(){
		List<String> properties = new ArrayList<String>();
		properties.add("artist");
		properties.add("album");
		properties.add("title");
		properties.add("year");
		properties.add("genre");
		properties.add("thumbnail");
		return properties;
		
	}
	
}
