package com.otherbrane.configuration;

import org.springframework.context.ApplicationContext;

// http://mythinkpond.wordpress.com/2010/03/22/spring-application-context/

public class Settings {
	private static Settings settings = new Settings();
	private static ApplicationContext applicationContext;

	private static ApplicationContext getApplicationContext()
	{
		if(applicationContext == null)
		{
            applicationContext = ApplicationContextProvider.getApplicationContext();
		}
		return applicationContext;
	}
	
	public static Settings get() {
		return settings;
	}
	
	public static String getRootUrl() 
	{
		getApplicationContext();
		if (applicationContext != null && applicationContext.containsBean("rootUrl")){
			return (String)applicationContext.getBean("rootUrl");
		}
		return "http://404.s3.amazonaws.com/otherbrane/";
	}
}
