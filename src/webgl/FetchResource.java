package webgl;

import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.concurrent.FutureCallback;
import org.apache.http.impl.nio.client.DefaultHttpAsyncClient;
import org.apache.http.nio.reactor.IOReactorException;
import org.apache.http.params.CoreConnectionPNames;

import sun.misc.IOUtils;

public class FetchResource {
	static DefaultHttpAsyncClient httpclient;
	static{
        try {
			httpclient = new DefaultHttpAsyncClient();
		} catch (IOReactorException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
        httpclient.getParams()
            .setIntParameter(CoreConnectionPNames.SO_TIMEOUT, 3000)
            .setIntParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 3000)
            .setIntParameter(CoreConnectionPNames.SOCKET_BUFFER_SIZE, 8 * 1024)
            .setBooleanParameter(CoreConnectionPNames.TCP_NODELAY, true);

        httpclient.start();
	}
	
	ApplicationRequest parent;
	boolean isComplete = false;
	
    final HttpGet[] requests = new HttpGet[] {
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/Whistler.png"),
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/lamps.js"),
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/shoe.js")
    };
    final AtomicInteger pendingRequestsCount = new AtomicInteger(requests.length);
    
//    List<FutureCallback<HttpResponse>> futures = new ArrayList<FutureCallback<HttpResponse>>();
    
	public FetchResource(ApplicationRequest parent)
	{
		this.parent = parent;
	}
	
    public void callOthers() throws Exception 
    {
		String contextPath = parent.getRequest().getContextPath(); // This contains "WebGLFirst"
    	parent.getServlet().log("******************Context path:" + contextPath);

		String pathInfo = parent.getRequest().getPathInfo(); // This contains the resource "filename"
    	parent.getServlet().log("******************Path info:" + pathInfo);

    	String pathTranslated = parent.getRequest().getPathTranslated(); // This contains "C:\\projects\\workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp3\\wtpwebapps\\WebGLFirst\\lamp.js"
    	parent.getServlet().log("******************Path translated:" + pathTranslated);
    	
    	final HttpGet resourceGet = new HttpGet("https://s3.amazonaws.com/otherbrane/world1/area1/3d" + pathInfo);
    	
//	    for (final HttpGet request: requests) {
	    	FutureCallback<HttpResponse> callback = new FutureCallback<HttpResponse>() {
	
	            public void completed(final HttpResponse response) {

	            	if(response.getStatusLine().getStatusCode() == 200)
	            	{
		            	HttpEntity entity = response.getEntity();
		            	try {
							InputStream stream = entity.getContent();
							byte[] resourceBytes = IOUtils.readFully(stream, Integer.MAX_VALUE, true);
							parent.getResponse().getOutputStream().write(resourceBytes);
							parent.getResponse().getOutputStream().flush();
							parent.getResponse().getOutputStream().close();
						} catch (IllegalStateException e) {
		                	parent.getServlet().log("IllegalStateException:" + e.toString());
						} catch (IOException e) {
		                	parent.getServlet().log("IOException:" + e.toString());
						} catch (Exception nakedException){
		                	parent.getServlet().log("Exception:" + nakedException.toString());
						}
		            	finally{
		                	parent.getServlet().log("Finally: " + resourceGet.toString());
		            	}
	            	} else {
	            		// TODO 404 and other non-200 responses handling
	            	}
	                complete();
	            }
	
	            public void failed(final Exception ex) {
	                if(pendingRequestsCount.decrementAndGet() == 0)
	                {
	                	complete();
	                }
	            }
	
	            public void cancelled() {
	                if(pendingRequestsCount.decrementAndGet() == 0)
	                {
	                	complete();
	                }
	            }
	        };
	        httpclient.execute(resourceGet, callback);
//	    }
    }
    
    void complete()
    {
    	parent.endProcess();
    	isComplete=true;
    }
    
    public boolean getIsComplete()
    {
    	return isComplete;
    }
    
    public void shutdown()
    {
//    	if(isComplete && httpclient != null)
//    	{
//			try {
//				httpclient.shutdown();
//			} catch (InterruptedException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			httpclient = null;
//    	}
    }
    
//    ExecutorService exec = Executors.newFixedThreadPool(4);
//
//    private void runServer() {
//      ServerSocket sock = new ServerSocket(portNo);
//      while (!stopRequested) {
//        Socket s = sock.accept();
//        exec.execute(new ConnectionRunnable(s));
//      }
//    }
//
//    private static class ConnectionRunnable implements Runnable {
//      private final Socket s;
//      ConnectionRunnable(Socket s) {
//        this.s = s;
//      }
//      public void run() {
//        // handle connection
//      }
//    }
}
