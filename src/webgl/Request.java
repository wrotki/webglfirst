package webgl;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;

// TODO - how does this relate to:
// http://stackoverflow.com/questions/1528444/accessing-scoped-proxy-beans-within-threads-of

// Also interesting: @Async stuff in Spring 3.0.

// http://blog.springsource.org/2012/05/06/spring-mvc-3-2-preview-introducing-servlet-3-async-support/
	
public class Request {
	
	private @Autowired HttpServletRequest request;
	
	public Request()
	{
	}
	
	public void log(javax.servlet.GenericServlet servlet)
	{
		String requestUrl = request.getRequestURL().toString();
		//servlet.log(String.format("I am the Spring Request handling: %s", requestUrl));		
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
}
