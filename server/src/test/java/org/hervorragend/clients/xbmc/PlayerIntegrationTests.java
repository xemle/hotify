package org.hervorragend.clients.xbmc;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;
import java.util.Map;

import org.herrvorragend.HotifyConfig;
import org.herrvorragend.clients.xbmc.XBMCClient;
import org.herrvorragend.clients.xbmc.model.Response;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {HotifyConfig.class})
public class PlayerIntegrationTests {

	@Autowired private XBMCClient client;
	
	@Test
	public void testGetPlaylists(){
		Response response = client.getPlaylists();
	}
	
	@Test
	public void testGetPlaylistItems(){
		Response response = client.getPlayListItems();
	}

	@Test
	public void testSkip(){
		Response response = client.skipSong();
	}
	
	@Test
	public void testPlayers(){
		Response response = client.getPlayers();
		List<Map<String,Object>> result = (List<Map<String,Object>>)response.getResult();
		assertEquals(1, result.size());
		Map<String,Object> player = result.get(0);
		assertNotNull(player.get("playerid"));
		assertNotNull(player.get("type"));
	}
	
	@Test
	public void testActiveItem(){
		Response response = client.getActiveItem();
		Map<String,Object> wrapper = (Map<String,Object>)response.getResult();
		Map<String,Object> result = (Map<String,Object>)wrapper.get("item");
		
		assertNotNull(result.get("artist"));
		assertNotNull(result.get("label"));
		assertNotNull(result.get("type"));
	}
	
	
}
