package webgl;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//@WebServlet("/3d/*") // This is correct - disable temporarily to let the default (file) servlet send responses
//@WebServlet("/3d") // Incorrect - intentionally
@SuppressWarnings("serial")
public class ThreeDResourceServlet extends CometServlet<ThreeDResourceRequest> 
{
    public ThreeDResourceServlet() 
    {
        super(ThreeDResourceRequest.class);
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
