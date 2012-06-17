package org.herrvorragend;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.herrvorragend.clients.xbmc.XBMCClient;
import org.herrvorragend.clients.xbmc.XBMCWebsocketClient;
import org.herrvorragend.server.ModelBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@ComponentScan(basePackages = { "org.herrvorragend" })
public class HotifyConfig {

	@Bean
	public XBMCWebsocketClient xbmcWebsocketClient(){
		XBMCWebsocketClient client = new XBMCWebsocketClient();
		try {
			client.setUri(new URI("ws://localhost:9090/jsonrpc"));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		client.init();
		return client;
	}
	
	@Bean 
	public RestTemplate xbmcJsonTemplate(){
		RestTemplate template = new RestTemplate();
		MappingJacksonHttpMessageConverter converter = new MappingJacksonHttpMessageConverter();
		List<MediaType> supportedMediaTypes = new ArrayList<MediaType>();
		supportedMediaTypes.add(MediaType.APPLICATION_OCTET_STREAM);
		converter.setSupportedMediaTypes(supportedMediaTypes);
		template.getMessageConverters().add(converter);
		return template;
	}
	
	@Bean
	public XBMCClient xbmcClient(){
		XBMCClient client = new XBMCClient();
		client.setHostName("http://172.31.8.13:8091");
		return client;
	}
	
	@Bean 
	public ModelBridge modelBridge(){
		ModelBridge bridge = new ModelBridge();
		bridge.setUrl("http://172.31.8.13:8090");
		return bridge;
	}

}
