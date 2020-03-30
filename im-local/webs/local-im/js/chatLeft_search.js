 
var chatSearch = chatSearch || {};
var chatSearchs = chatSearch.Method = { 
    lMem: new Maps(),  
    addFrend:function(name, ele){
        this.lMem.add(name, ele)
    },
    hideFrend:function(name){
        ele = this.lMem.get(name) 
    },
    unSearch:function(){
        this.lMem.findName("", this.unSearchAct)
    },
    unSearchAct:function(name, ele){
        util.delClass(ele, "hideDiv")  
    },
    search:function(name){
        this.lMem.findName(name, this.searchAct)
    },    
    searchAct:function(name, ele){ 
        if (ele.getAttribute("name").indexOf(name) < 0){
            util.addClass(ele, "hideDiv")  
        }
    }
}
 
