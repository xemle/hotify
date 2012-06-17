package org.herrvorragend.clients.xbmc.model;

import java.util.HashMap;
import java.util.Map;

public class Request {

	private String jsonrpc = "2.0";
	private String method;
	private int id = 1;
	public Map<String, Object> params = new HashMap<String, Object>();
	
	public Request(String method){
		this.method = method;
	}
	
	public String getJsonrpc() {
		return jsonrpc;
	}
	public void setJsonrpc(String jsonrpc) {
		this.jsonrpc = jsonrpc;
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Map<String, Object> getParams(){
		return params;
	}
	
	public void addParam(String key, Object value){
		params.put(key, value);
		
	}
}
