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
import org.springframework.web.context.support.WebApplicationContextUtils;

import workqueue.RequestProcessor;

// http://www.ibm.com/developerworks/web/library/wa-cometjava/

/**
 * Servlet implementation class HelloWorld
 */
//@WebServlet("/3d/*") // This is correct - disable temporarily to let the default (file) servlet send responses
//@WebServlet("/3d") // Incorrect - intentionally
public class ThreeDResourceServer extends HttpServlet implements CometProcessor {
	private static final long serialVersionUID = 1L;
	
    ApplicationContext applicationContext = null;
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	// TODO guard against races
        if (applicationContext == null){
            System.out.println("setting context in get");
            applicationContext = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
        }
        if (applicationContext != null && applicationContext.containsBean("accessKeys")){
//            AccessBean thisAccessBean = (AccessBean) applicationContext.getBean("accessKeys");
//            req.setAttribute("keys", thisAccessBean.toString());
//            System.out.println("setting keys");
        }
 
        // LOOK OUT!!!!!!!!!!!!!!
//        req.getRequestDispatcher("/index2.jsp").include(req,resp);
    }
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ThreeDResourceServer() {
        super();
        // TODO Auto-generated constructor stub
    }

    private static final Integer TIMEOUT = 600 * 1000;

    @Override
    public void destroy() {
    	//RequestProcessor.destroy();
    	log("******************ThreeDResourceServer Servlet destroyed********************");
    }

    @Override
    public void init() throws ServletException {
    	//RequestProcessor.init();
    	log("******************ThreeDResourceServer Servlet created********************");
    }

	@Override
	public void event(CometEvent event) throws IOException, ServletException {
        if (event.getEventType() == CometEvent.EventType.BEGIN) {
        	// TODO: use parameters for data selection 
        	//dumpParameters(request, response);

        	// TODO guard against races
            if (applicationContext == null){
                System.out.println("setting context in get");
                applicationContext = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
            }
            if (applicationContext != null && applicationContext.containsBean("accessKeys")){
//                AccessBean thisAccessBean = (AccessBean) applicationContext.getBean("accessKeys");
//                req.setAttribute("keys", thisAccessBean.toString());
//                System.out.println("setting keys");
            }

        	HttpServletRequest request = event.getHttpServletRequest();

        	request.setAttribute("org.apache.tomcat.comet.timeout", TIMEOUT);
        	RequestProcessor.send(new ThreeDResourceRequest(this, event));
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
		    String name = (String)paramNames.nextElement();
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
