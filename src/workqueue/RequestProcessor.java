package workqueue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.servlet.ServletException;

import webgl.ApplicationRequest;

public class RequestProcessor  implements Runnable {
    protected static final BlockingQueue<ApplicationRequest> messages = new LinkedBlockingQueue<ApplicationRequest>();

    private static final Integer PROCESSORS_NO = 16;
    private static RequestProcessor[] requestProcessors = new RequestProcessor[PROCESSORS_NO];
    private static Thread requestProcessorThreads[] = new Thread[PROCESSORS_NO];

    protected static AtomicBoolean running;
    
    static{
    	running = new AtomicBoolean();
    }
    
    protected final List<ApplicationRequest> completedMessages = new ArrayList<ApplicationRequest>();
    
    public static void init() throws ServletException {
    	if(!running.compareAndSet(false, true))
    	{
    		return;
    	}
    	// Once and only once
    	for(int i = 0 ; i < PROCESSORS_NO; i++)
    	{
    		requestProcessors[i] = new RequestProcessor();
    	}
    	for(int i = 0 ; i < PROCESSORS_NO; i++)
    	{
    		requestProcessorThreads[i] = new Thread(requestProcessors[i], "MessageSender[" + /*getServletContext()
            		.getContextPath() +*/ "]["+ i + "]");
    		requestProcessorThreads[i].setDaemon(true);
    		requestProcessorThreads[i].start();
    	}
    	//log("******************Servlet created********************");
    }
    

    public static void destroy() {
    	for(int i = 0 ; i < PROCESSORS_NO; i++)
    	{
//    		requestProcessorThreads[i].stop();
    		requestProcessors[i] = null;
    	}
    	//log("******************Servlet destroyed********************");
    }

    public static void send(ApplicationRequest message) {
        try {
			messages.put(message);
		} catch (InterruptedException e) {
            //log("Exception when inserting request to BlockingQueue", e);
            return;
		}
        //log("Message added #messages=" + messages.size());
    }
    
    public void run() 
    {
        while (running.get()) {
        	ApplicationRequest message;
			try {
				message = messages.take();
				completedMessages.add(message);
			} catch (InterruptedException e1) {
                //log("Exception when inserting request to BlockingQueue", e1);
                continue;
			}
	        //log("Message processing started: #messages waiting=" + messages.size());
            try {
                message.process();
            } catch (Exception e) {
                //log("Exception when processing request", e);
            }
            
	        //log("Completed message cleanup to start: #messages waiting for completion=" + completedMessages.size());
            // Cleanup completed requests (shutdown clients, close connections)
            Iterator<ApplicationRequest> completedIterator = completedMessages.iterator();
            while (completedIterator.hasNext()) {
               // Do something
            	ApplicationRequest next = completedIterator.next();
            	if(next.getIsComplete())
            	{
            		next.shutdown();
            		completedIterator.remove();
            	}
            }
	        //log("Completed message cleanup completed: #messages waiting for completion=" + completedMessages.size());
            
        }
        System.out.println("Nooooooooooooooooo!!!!!!!!!");
    }
}
