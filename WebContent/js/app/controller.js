define(["dojo/_base/config", "dojox/image/LightboxNano", "dojo/dom", "dojo/on", "dijit/registry", "dojo/dom-construct", "dojo/keys", 
             "dijit/layout/ContentPane", "dojox/image/LightboxNano","app/S3Upload"], 
             function(config, LightboxNano, dom, on, registry, domConstruct, keys, ContentPane, LightboxNano, S3Upload) {
    var store = null, flickrQuery = config.flickrRequest || {}, startup = function() {
        // create the data store
        //store = new FlickrRestStore();
        initUi();
    }, initUi = function() {
        // summary:
        //      create and setup the UI with layout and widgets
        // create a single Lightbox instnace which will get reused
        lightbox = new LightboxNano({});
        // set up ENTER keyhandling for the search keyword input field
        on(dom.byId("searchTerms"), "keydown", function(evt) {
            if (evt.keyCode == keys.ENTER) {
                evt.preventDefault();
                doSearch();
            }
        });
        // set up click handling for the search button
        on(dom.byId("searchBtn"), "click", doSearch);
    }, doSearch = function() {
        // summary:
        //      inititate a search for the given keywords
        var terms = dom.byId("searchTerms").value;
        if (!terms.match(/\w+/)) {
            return;
        }
        var listNode = createTab(terms);

    }, createTab = function(term, items) {
        // summary:
        //      Handle fetch results

        var contr = registry.byId("contentStack");
        var listNode = domConstruct.create("ul", {
            "class" : "demoImageList",
            "id" : "panel" + contr.getChildren().length
        });

        // create the new tab panel for this search
        var panel = new ContentPane({
            title : term,
            content : listNode,
            closable : true
        });
        contr.addChild(panel);
        // make this tab selected
        contr.selectChild(panel);

        // connect mouse click events to our event delegation method
        var hdl = on(listNode, "click", onListClick);
        return listNode;
    }, onListClick = function(evt) {
         // TODO
    }, renderItem = function(item, refNode, posn) {
        // summary:
        //      Create HTML string to represent the given item
    };
    return {
        init : function() {
            // proceed directly with startup
            startup();
        }
    };
});
