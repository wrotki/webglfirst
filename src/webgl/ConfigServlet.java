package webgl;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.comet.CometEvent;
import org.apache.catalina.comet.CometProcessor;
import org.springframework.context.ApplicationContext;

import workqueue.RequestProcessor;

// http://www.ibm.com/developerworks/web/library/wa-cometjava/

/**
 * Servlet implementation class ConfigServlet
 */
@WebServlet("/Config")
public class ConfigServlet extends HttpServlet implements CometProcessor {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ConfigServlet() {
        super();
        // TODO Auto-generated constructor stub
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
        	RequestProcessor.send(new ConfigRequest(this, event));
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
