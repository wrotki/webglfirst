define(["dojo/_base/config", "dojox/image/LightboxNano"],
function(config, LightboxNano) {
    var store = null,
    flickrQuery = config.flickrRequest || {},
 
    startup = function() {
        // create the data store
        //store = new FlickrRestStore();
        initUi();
    },
 
    initUi = function() {
        // summary:
        //      create and setup the UI with layout and widgets
        // create a single Lightbox instnace which will get reused
        lightbox = new LightboxNano({});
 
    },
    doSearch = function() {
        // summary:
        //      initiate a search for the given keywords
    },
    renderItem = function(item, refNode, posn) {
        // summary:
        //      Create HTML string to represent the given item
    };
    return {
        init: function() {
            // proceed directly with startup
            startup();
        }
    };
});