package webgl;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import org.apache.catalina.comet.CometEvent;
import org.apache.catalina.comet.CometProcessor;
import workqueue.RequestProcessor;

// http://www.ibm.com/developerworks/web/library/wa-cometjava/

/**
 * Servlet implementation class CometServlet
 */
public abstract class CometServlet<T extends ApplicationRequest> extends HttpServlet implements CometProcessor 
{
	private static final long serialVersionUID = 1L;
	//@SuppressWarnings("rawtypes")
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
    	log("******************GraphServer Servlet destroyed********************");
    }

    @Override
    public void init() throws ServletException {
    	RequestProcessor.init();
    	log("******************GraphServer Servlet created********************");
    }

	@Override
	public void event(CometEvent event) throws IOException, ServletException {
        if (event.getEventType() == CometEvent.EventType.BEGIN) {
        	HttpServletRequest request = event.getHttpServletRequest();
        	request.setAttribute("org.apache.tomcat.comet.timeout", TIMEOUT);
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
}
