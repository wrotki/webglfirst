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
}
