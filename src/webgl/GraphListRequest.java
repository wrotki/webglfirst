package webgl;

import graphs.GraphList;
import graphs.GraphQuery;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.comet.CometEvent;

public class GraphListRequest extends ApplicationRequest {
	
    private CallToWeb subCall;
	private GraphList gl;

	public GraphListRequest(HttpServlet servlet, CometEvent event) {
		super(servlet, event);
    	try {
        	this.subCall = new CallToWeb(this);
		} catch (Exception e) {
			servlet.log(e.toString());
		}
	}

	@Override
	public void process() {
        PrintWriter pw = null;
		try {
			pw = getResponse().getWriter();
			initDataSource();
			pw.println(getJSON(gl));
		} catch (IOException e) {
	        //pw.println("IOException" + e.toString());
	        System.out.println("IOException" + e.toString());
		} catch (Exception e) {
			e.printStackTrace(pw);
		}
		endProcess();
	}

	@Override
    public void endProcess()
    {
        PrintWriter pw = null;
		try {
			pw = getResponse().getWriter();
		} catch (IOException e) {
	        //pw.println("IOException" + e.toString());
		} catch (Exception e) {
			e.printStackTrace(pw);
		}finally{
	        pw.checkError(); // They say it flushes
	        pw.close();    	
		}
    }

	@Override
    public boolean getIsComplete()
    {
    	return subCall.getIsComplete();
    }
    
	@Override
    public void shutdown()
    {
    	subCall.shutdown();
    }

	// TODO: get some real data:
	// http://www.programmableweb.com/
	private void initDataSource()
    {
		gl = new GraphList();
		
		String[] countries = { "US","CA","UK","FR","ES","IT","DE","JP","CN" };
		String[] metrics = { "Fatals","Latency" };
						
		ArrayList<GraphQuery> gq = new ArrayList<GraphQuery>(20);
		
		for(String country : countries)
		{
			for(String metric: metrics)
			{
				GraphQuery q = new GraphQuery();
				q.setCountry(country);
				q.setMetrics(metric);
				gq.add(q);
			}
		}
		gl.setList(gq.toArray(new GraphQuery[gq.size()]));		
    }
	
}
