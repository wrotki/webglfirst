package webgl;

import javax.servlet.annotation.WebServlet;

/**
 * Servlet implementation class HelloWorld
 */
@WebServlet("/GraphList")
public class GraphListServlet extends CometServlet<GraphListRequest>
{
	private static final long serialVersionUID = 1L;
       
    public GraphListServlet() 
    {
        super(GraphListRequest.class);
    }	
}
