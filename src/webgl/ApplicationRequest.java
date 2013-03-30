package webgl;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.comet.CometEvent;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

/**
 * @author mariusz
 *
 */
public abstract class ApplicationRequest {
    private HttpServletRequest request;
    private HttpServletResponse response;
    private CometEvent event;

	protected HttpServlet servlet;
	final static ObjectMapper mapper = new ObjectMapper(); // can reuse, share globally

    
    public ApplicationRequest(HttpServlet servlet, CometEvent event)
    {
    	this.servlet = servlet;
    	this.event = event;

    	HttpServletRequest request = event.getHttpServletRequest();
        HttpServletResponse response = event.getHttpServletResponse();

    	this.setRequest(request);
    	this.setResponse(response);
    }   
    
    abstract public void process();
    abstract public void endProcess();
    abstract public boolean getIsComplete();
    abstract public void shutdown();

	public CometEvent getEvent() {
		return event;
	}

	public HttpServlet getServlet()
	{
		return servlet;
	}
	
	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}	
	
    protected static String getJSON(Object o)
    {
    	String json = "";
    	
    	try {
			json = mapper.writeValueAsString(o);
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	return json;
    }
}
