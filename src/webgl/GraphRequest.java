package webgl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletResponseWrapper;
import javax.servlet.http.HttpServlet;
import org.apache.catalina.comet.CometEvent;

public class GraphRequest extends ApplicationRequest 
{
	public GraphRequest(HttpServlet servlet, CometEvent event) 
	{
		super(servlet, event);
	}

	@Override
    public void process()
    {
		try {
			ServletResponseWrapper capturedResponse = new JspServletResponseWrapper(getResponse());
	        RequestDispatcher view = getRequest().getRequestDispatcher("graphlist.jsp");
	        
	        final int size = 10;
	        List<Integer> series = new ArrayList<Integer>(size);
	        fillSeries(size, series);
	        
	        getRequest().setAttribute("series", series);
	        
	        view.forward(getRequest(), capturedResponse);
		} catch (IOException e) {
			servlet.log("GraphRequest:", e);
		} catch (Exception e) {
			servlet.log("GraphRequest:", e);
		}
		endProcess();
    }

	private void fillSeries(final int size, List<Integer> series) {
		for(int i=0;i< size ;i++)
		{
			double time = 100.0 * (System.currentTimeMillis()/1000.0);
			double timeShift = time * (2*Math.PI)/500;
			double x = timeShift + ((double)i)/size * 2 * Math.PI;
			series.add((int)(100 * Math.cos(x)));
		}
	}

	@Override
    public void endProcess()
    {
		try {
			getEvent().close();
		} catch (IOException e) {
			servlet.log("GraphRequest:", e);
		}
    }
    
	@Override
    public boolean getIsComplete()
    {
		return true;
    	//return subCall.getIsComplete();
    }
    
	@Override
    public void shutdown()
    {
    	//subCall.shutdown();
    }
}
