/**
 * 
 */
package com.otherbrane.configuration;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;


// http://mythinkpond.wordpress.com/2010/03/22/spring-application-context/
/**
 * @author mariusz
 *
 */
public class ApplicationContextProvider implements ApplicationContextAware {

	private static ApplicationContext ctx = null;
	 public static ApplicationContext getApplicationContext() {
		 return ctx;
	 }
	/* (non-Javadoc)
	 * @see org.springframework.context.ApplicationContextAware#setApplicationContext(org.springframework.context.ApplicationContext)
	 */
	@Override
	public void setApplicationContext(final ApplicationContext actx)
			throws BeansException {
		ctx = actx; 
	}
}
