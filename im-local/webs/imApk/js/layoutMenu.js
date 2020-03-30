 
var layoutMenu = layoutMenu || {};
var menuLayout = layoutMenu.Method = { 
    div_bodys:"bodys",
    div_main:"menu",
    main:null,
    show:function(){
        if (this.main != null) {
            this.main.setAttribute("style","")
        }else{ 
            div = util.addEle("div")
            div.setAttribute("class", this.div_main) 
            div.id = this.div_main
            ele = util.getEleById(this.div_bodys)
            ele.appendChild(div) 
            this.main = div
            this.addUser()
            this.addChats()
        }
    },
    hide:function(){
        this.main.setAttribute("style","display:none;")
    },
    addChats:function(){
        div = util.addEle("div")
        div.setAttribute("class", "chatsTag") 
        dv = util.addEle("div")
        div.appendChild(dv)
        img = util.addEle("img")
        div.appendChild(img)
        this.main.appendChild(div)
    },
    addUser:function(){
        div = util.addEle("div")
        div.setAttribute("class", "user") 
        div.setAttribute("onclick", "clicks.selectContent('')") 
        dv = util.addEle("div")
        div.appendChild(dv)
        img = util.addEle("img")
        div.appendChild(img)
        this.main.appendChild(div)
    },
}