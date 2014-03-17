package graphs;

//import lombok.Data;

//@Data
public class GraphList {
	private GraphQuery[] list;

    public GraphQuery[] getList() {
        return list;
    }

    public void setList(GraphQuery[] list) {
        this.list = list;
    }
}
