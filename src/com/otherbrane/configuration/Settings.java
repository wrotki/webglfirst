package com.otherbrane.configuration;

// http://mythinkpond.wordpress.com/2010/03/22/spring-application-context/

public class Settings {
	private static Settings settings = new Settings();

	public static Settings get() {
		return settings;
	}
	
	private String rootUrl = "http://s3.amazonaws.com/otherbrane/";

	public String getRootUrl() {
		return rootUrl;
	}

	public void setRootUrl(String rootUrl) {
		this.rootUrl = rootUrl;
	}
}
