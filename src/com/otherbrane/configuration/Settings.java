package com.otherbrane.configuration;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

// http://mythinkpond.wordpress.com/2010/03/22/spring-application-context/

public class Settings implements ApplicationContextAware {
	private static Settings settings = new Settings();
	
	private static ApplicationContext ctx = null;

	/* (non-Javadoc)
	 * @see org.springframework.context.ApplicationContextAware#setApplicationContext(org.springframework.context.ApplicationContext)
	 */
	@Override
	public void setApplicationContext(final ApplicationContext actx)
			throws BeansException {
		ctx = actx; 
	}
	
	public static Settings get() {
		return settings;
	}
	
	public static String getRootUrl() 
	{
		if (ctx != null && ctx.containsBean("rootUrl")){
			return (String)ctx.getBean("rootUrl");
		}
		return "http://404.s3.amazonaws.com/otherbrane/";
	}
}
