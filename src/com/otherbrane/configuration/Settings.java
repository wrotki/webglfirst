package com.otherbrane.configuration;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import webgl.Request;
import webgl.Session;

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
			return ctx.getBean("rootUrl", String.class);
		}
		return "http://404.s3.amazonaws.com/otherbrane/";
	}

	public static String getMediaUrl() 
	{
		if (ctx != null && ctx.containsBean("mediaUrl")){
			return ctx.getBean("mediaUrl", String.class);
		}
		return "/WebGLFirst";
	}
	
	public static Request getRequest() 
	{
		if (ctx != null && ctx.containsBean("webglSession")){
			Session session = ctx.getBean("webglSession", Session.class);
			return session.getRequest();
		}
		return null;
	}

}
