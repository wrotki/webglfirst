package webgl;

import javax.servlet.annotation.WebServlet;

/**
 * Servlet implementation class HelloWorld
 */
@WebServlet("/GraphListServer")
public class GraphListServer extends CometServlet<GraphListRequest>
{
	private static final long serialVersionUID = 1L;
       
    public GraphListServer() 
    {
        super(GraphListRequest.class);
    }	
}
