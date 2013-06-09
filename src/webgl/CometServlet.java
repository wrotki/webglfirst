package webgl;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.comet.CometEvent;
import org.apache.catalina.comet.CometProcessor;

import com.otherbrane.configuration.Settings;

import workqueue.RequestProcessor;

// http://www.ibm.com/developerworks/web/library/wa-cometjava/

/**
 * Servlet implementation class CometServlet
 */
public abstract class CometServlet<T extends ApplicationRequest> extends HttpServlet implements CometProcessor 
{
	private static final long serialVersionUID = 1L;
	private Class<T> runtimeType;

	// Forbidden
	@SuppressWarnings("unused")
	private CometServlet()
	{
	}
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CometServlet(Class<T> runtimeType) {
        super();
    	this.runtimeType =  runtimeType;
    }

    private static final Integer TIMEOUT = 600 * 1000;

    @Override
    public void destroy() {
    	RequestProcessor.destroy();
    	log("******************CometServlet destroyed********************");
    }

    @Override
    public void init() throws ServletException {
    	RequestProcessor.init();
    	log("******************CometServlet created********************");
    }

	@Override
	public void event(CometEvent event) throws IOException, ServletException {
        if (event.getEventType() == CometEvent.EventType.BEGIN) {
        	HttpServletRequest request = event.getHttpServletRequest();
        	request.setAttribute("org.apache.tomcat.comet.timeout", TIMEOUT);
        	
        	logRequest();
        	
        	T workitem;
			try {
				workitem = (T)runtimeType.getDeclaredConstructor(HttpServlet.class, CometEvent.class).newInstance(this, event);
			} catch (InstantiationException e) {
				log("CometServlet:", e);
				throw new ServletException(e);
			} catch (IllegalAccessException e) {
				log("CometServlet:", e);
				throw new ServletException(e);
			} catch (IllegalArgumentException e) {
				log("CometServlet:", e);
				throw new ServletException(e);
			} catch (InvocationTargetException e) {
				log("CometServlet:", e);
				throw new ServletException(e);
			} catch (NoSuchMethodException e) {
				log("CometServlet:", e);
				throw new ServletException(e);
			} catch (SecurityException e) {
				log("CometServlet:", e);
				throw new ServletException(e);
			}
        	RequestProcessor.send(workitem);
            //log("Begin for session: " + request.getSession(true).getId());
        } else if (event.getEventType() == CometEvent.EventType.ERROR) {
            //log("Error for session: " + request.getSession(true).getId());
            event.close();
        } else if (event.getEventType() == CometEvent.EventType.END) {
            //log("End for session: " + request.getSession(true).getId());
            event.close();
        } else if (event.getEventType() == CometEvent.EventType.READ) {
            throw new UnsupportedOperationException("This servlet does not accept data");
        }
	}	
	
	private void logRequest() 
	{
		Request request = Settings.getRequest();
		request.log(this);
	}

	private void dumpParameters(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		//Map<String, String[]> parameters = request.getParameterMap();
		// The following generates a page showing all the request parameters
		PrintWriter out = response.getWriter();
		response.setContentType("text/plain");

		// Get the values of all request parameters
		Enumeration<String> paramNames = request.getParameterNames();
		for (; paramNames.hasMoreElements(); ) {
		    // Get the name of the request parameter
		    String name = paramNames.nextElement();
		    out.println(name);

		    // Get the value of the request parameter
		    String value = request.getParameter(name);

		    // If the request parameter can appear more than once in the query string, get all values
		    String[] values = request.getParameterValues(name);

		    for (int i=0; i<values.length; i++) {
		        out.println("    "+values[i]);
		    }
		}
		//out.close();
	}		

}
