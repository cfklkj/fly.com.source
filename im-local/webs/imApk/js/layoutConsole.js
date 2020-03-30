 
var layoutConsole = layoutConsole || {};
var consoleLayout = layoutConsole.Method = { 
    div_bodys:"bodys",
    div_main:"console",
    main_ele:null,
    show:function(){
        div = util.addEle("div")
        div.setAttribute("class", 'console')
        div.setAttribute("style", 'z-index:999') 
        div.id = this.div_main
        ele = util.getEleById(this.div_bodys)
        ele.appendChild(div) 
        this.main_ele = div
        this.baseinfo()
    },
    baseinfo:function(){
        this.main_ele.innerText = "\nwidth:" + window.screen.width
        this.main_ele.innerText += "\nheight:" + window.screen.height
        this.main_ele.innerText += "\nbodyHeight:" + document.body.clientHeight
        this.main_ele.innerText += "\nbodyWidth:" + document.body.clientWidth
    },
    debug:function(obj){ 
        this.main_ele.innerText +=  this.write(obj)
    },
    write:function(obj){
        var description = "\n" 
        for(var i in obj) {
            var property = obj[i];
            if (typeof(property) == "object") {
                description +=  "ad11222d" + this.write(property)
            }else{ 
                description += "ad11d" + property
            }
        }
        return description
    }
}