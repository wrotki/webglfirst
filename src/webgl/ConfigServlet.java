package webgl;

import javax.servlet.annotation.WebServlet;

@SuppressWarnings("serial")
@WebServlet("/Config")
public class ConfigServlet extends CometServlet<ConfigRequest> {
    public ConfigServlet() {
        super(ConfigRequest.class);
    }
}
