package webgl;

import java.io.IOException;
import javax.servlet.http.HttpServlet;
import org.apache.catalina.comet.CometEvent;

public class ThreeDResourceRequest extends ApplicationRequest 
{
    private FetchResource subCall;

	public ThreeDResourceRequest(HttpServlet servlet, CometEvent event) {
		super(servlet, event);
    	try {
        	this.subCall = new FetchResource(this);
		} catch (Exception e) {
			servlet.log("ThreeDResourceRequest:", e);
		}
	}

	@Override
    public void process()
    {
		try {
			subCall.callOthers();
		} catch (IOException e) {
			servlet.log("ThreeDResourceRequest:", e);
		} catch (Exception e) {
			servlet.log("ThreeDResourceRequest:", e);
		}
		endProcess();
    }

	@Override
    public void endProcess()
    {
//		try {
//		    getEvent().close();
//		} catch (IOException e) {
//		    servlet.log("ThreeDResourceRequest:", e);
//		}
    }
    
	@Override
    public boolean getIsComplete()
    {
		return true;
    }
    
	@Override
    public void shutdown()
    {
    }
}
