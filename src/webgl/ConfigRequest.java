package webgl;

import graphs.GraphData;
import graphs.Series;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequestWrapper;
import javax.servlet.ServletResponseWrapper;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.catalina.comet.CometEvent;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.concurrent.FutureCallback;
import org.apache.http.impl.nio.client.DefaultHttpAsyncClient;
import org.apache.http.nio.reactor.IOReactorException;
import org.apache.http.params.CoreConnectionPNames;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import com.otherbrane.configuration.Settings;

public class ConfigRequest extends ApplicationRequest 
{
	static DefaultHttpAsyncClient httpclient;
	static DocumentBuilderFactory dbf;
	static DocumentBuilder db;

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
        
        dbf = DocumentBuilderFactory.newInstance();
        try {
			db = dbf.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	boolean isComplete = false;

    final HttpGet[] requests = new HttpGet[] {
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/Whistler.png"),
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/lamps.js"),
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/shoe.js")
    };
    
    final AtomicInteger pendingRequestsCount = new AtomicInteger(requests.length);
	private List<String> keys = new ArrayList<String>(50);

	public ConfigRequest(HttpServlet servlet, CometEvent event) {
		super(servlet, event);
	}

	@Override
    public void process()
    {
		try {
			loadKeys();
		} catch (IOException e) {
			servlet.log("IOException:", e);
		} catch (Exception e) {
			servlet.log("Exception:", e);
		}
    }

	private void render()
	{
		ServletResponseWrapper capturedResponse = new JspServletResponseWrapper(getResponse());
        RequestDispatcher view = getRequest().getRequestDispatcher("dojoconfig.jsp");
        
        Set<String> buckets = new HashSet<String>(50);
        for(String key : keys)
        {
        	String[] segments = key.split("/");
        	if(segments.length >=4 && "js".equals(segments[2]))
        	{
        		buckets.add(segments[3]);
        	}
        }
        
        getRequest().setAttribute("keys", buckets.toArray());
        
        try {
			view.forward(getRequest(), capturedResponse);
		} catch (ServletException e) {
			servlet.log("ServletException:", e);
		} catch (IOException e) {
			servlet.log("IOException:", e);
		}

	}

	@Override
    public void endProcess()
    {
		try {
			render();
			getEvent().close();
		} catch (IOException e) {
			servlet.log("IOException:", e);
		}
    }
    
	@Override
    public boolean getIsComplete()
    {
		return isComplete;
    }
    
	@Override
    public void shutdown()
    {
    }

	public List<String> getKeys() {
		return keys;
	}

	public void setKeys(List<String> keys) {
		this.keys = keys;
	}
	
	
	
    public void loadKeys() throws Exception 
    {
    	final HttpGet resourceGet = new HttpGet(Settings.getRootUrl());
//	    for (final HttpGet request: requests) {
	    	FutureCallback<HttpResponse> callback = new FutureCallback<HttpResponse>() {
	    		@Override
	            public void completed(final HttpResponse response) {
	            	if(response.getStatusLine().getStatusCode() == 200)
	            	{
		            	HttpEntity entity = response.getEntity();
		            	try {
							InputStream stream = entity.getContent();
							Document doc = db.parse(stream);
							Node root = doc.getFirstChild();
							for (Node child = root.getFirstChild(); child != null;
							         child = child.getNextSibling()) 
							{
			                	//parent.getServlet().log("Node :" + child.toString());
			                	String nodeName = child.getNodeName();
			                	if( ! "Contents".equals(nodeName) )
			                	{
			                		continue;
			                	}
								for (Node content = child.getFirstChild(); content != null;
								         content = content.getNextSibling()) 
								{
				                	//parent.getServlet().log("Contents Node :" + content.toString());
				                	String contentsName = content.getNodeName();
				                	if("Key".equals(contentsName))
				                	{
					                	servlet.log("Key :" + content.getTextContent());
				                		keys.add(content.getTextContent());
				                	}
								}
							}
						} catch (IllegalStateException e) {
		                	servlet.log("IllegalStateException:" + e.toString());
						} catch (IOException e) {
		                	servlet.log("IOException:" + e.toString());
						} catch (Exception nakedException){
		                	servlet.log("Exception:" + nakedException.toString());
						}
		            	finally{
		                	servlet.log("Finally: " + resourceGet.toString());
		            	}
	            	} else {
	            		// TODO 404 and other non-200 responses handling
	            	}
	                complete();
	            }
	
	    		@Override
	            public void failed(final Exception ex) {
	                if(pendingRequestsCount.decrementAndGet() == 0)
	                {
	                	complete();
	                }
	            }
	
	    		@Override
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
    	setKeys(keys);
    	endProcess();
    	isComplete = true;
    }    
}
