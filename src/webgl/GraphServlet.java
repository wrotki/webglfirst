package webgl;

import javax.servlet.annotation.WebServlet;

@SuppressWarnings("serial")
@WebServlet("/GraphServer")
public class GraphServlet extends CometServlet<GraphRequest>
{
    public GraphServlet() 
    {
        super(GraphRequest.class);
    }
}
