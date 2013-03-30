package webgl;

import graphs.GraphData;
import graphs.Series;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletRequestWrapper;
import javax.servlet.ServletResponseWrapper;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.comet.CometEvent;

public class GraphRequest extends ApplicationRequest {

    private CallToWeb subCall;
    private GraphData gd;

	public GraphRequest(HttpServlet servlet, CometEvent event) {
		super(servlet, event);
    	try {
        	this.subCall = new CallToWeb(this);
		} catch (Exception e) {
			servlet.log(e.toString());
		}
	}

	@Override
    public void process()
    {
        PrintWriter pw = null;
		try {
			//subCall.callOthers();
			//initDataSource();
	       // request.setAttribute("types", types);
			
			// TODO: override this one to capture a JSP generated string
			ServletResponseWrapper capturedResponse = new JspServletResponseWrapper(getResponse());
	        RequestDispatcher view = getRequest().getRequestDispatcher("graphlist.jsp");
	        
	        final int size = 10;
	        List<Integer> series = new ArrayList<Integer>(size);
	        fillSeries(size, series);
	        
	        getRequest().setAttribute("series", series);
	        
	        view.forward(getRequest(), capturedResponse);

			//pw = getResponse().getWriter();
			//pw.println(getJSON(gd));
		} catch (IOException e) {
	        //pw.println("IOException" + e.toString());
	        System.out.println("IOException" + e.toString());
		} catch (Exception e) {
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
//        PrintWriter pw = null;
//		try {
//			//pw = getResponse().getWriter();
//		} catch (IOException e) {
//	        //pw.println("IOException" + e.toString());
//		} catch (Exception e) {
//			//e.printStackTrace(pw);
//		}finally{
////	        pw.checkError(); // They say it flushes
////	        pw.flush();
////	        pw.close();    	
//		}
		try {
//			getResponse().flushBuffer();
//			getResponse().setStatus(HttpServletResponse.SC_OK);
			getEvent().close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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

	private void initDataSource()
    {
		gd = new GraphData();
		gd.setCountry("CA");
    	Series series = new Series();
    	Map<String,int[]> data = new HashMap<String,int[]>();
    	data.put("Fatals", new int[] {1,2,3});
    	data.put("Latency", new int[] {100,200,300});
    	series.setData(data);
    	gd.setSeries(series);
    }
}
