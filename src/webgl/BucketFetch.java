package webgl;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import javax.xml.parsers.DocumentBuilder; 
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.DocumentType;
import org.w3c.dom.Entity;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;


import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.concurrent.FutureCallback;
import org.apache.http.impl.nio.client.DefaultHttpAsyncClient;
import org.apache.http.nio.reactor.IOReactorException;
import org.apache.http.params.CoreConnectionPNames;

import sun.misc.IOUtils;

public class BucketFetch {
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
	
	ApplicationRequest parent;
	boolean isComplete = false;
	
	List<String> keys;
	
    final HttpGet[] requests = new HttpGet[] {
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/Whistler.png"),
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/lamps.js"),
            new HttpGet("http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1/3d/shoe.js")
    };
    final AtomicInteger pendingRequestsCount = new AtomicInteger(requests.length);
    
//    List<FutureCallback<HttpResponse>> futures = new ArrayList<FutureCallback<HttpResponse>>();
    
	public BucketFetch(ApplicationRequest parent)
	{
		this.parent = parent;
		this.keys = new ArrayList<String>(100);
	}
	
    public void callOthers() throws Exception 
    {
    	final HttpGet resourceGet = new HttpGet("http://s3.amazonaws.com/otherbrane/");
    	
//	    for (final HttpGet request: requests) {
	    	FutureCallback<HttpResponse> callback = new FutureCallback<HttpResponse>() {
	
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
					                	parent.getServlet().log("Key :" + content.getTextContent());
				                		keys.add(content.getTextContent());
				                	}
								}
							}
							
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
    	((BucketRequest)parent).setKeys(keys);
    	parent.endProcess();
    	isComplete=true;
    }
    
    public boolean getIsComplete()
    {
    	return isComplete;
    }
    
    public void shutdown()
    {

    }
 
    
    private static class MyErrorHandler implements ErrorHandler {
        
        private PrintWriter out;

        MyErrorHandler(PrintWriter out) {
            this.out = out;
        }

        private String getParseExceptionInfo(SAXParseException spe) {
            String systemId = spe.getSystemId();
            if (systemId == null) {
                systemId = "null";
            }

            String info = "URI=" + systemId + " Line=" + spe.getLineNumber() +
                          ": " + spe.getMessage();
            return info;
        }

        public void warning(SAXParseException spe) throws SAXException {
            out.println("Warning: " + getParseExceptionInfo(spe));
        }
            
        public void error(SAXParseException spe) throws SAXException {
            String message = "Error: " + getParseExceptionInfo(spe);
            throw new SAXException(message);
        }

        public void fatalError(SAXParseException spe) throws SAXException {
            String message = "Fatal Error: " + getParseExceptionInfo(spe);
            throw new SAXException(message);
        }
    }
}
