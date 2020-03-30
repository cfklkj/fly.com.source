 
var layoutLogin = layoutLogin || {};
var loginLayout = layoutLogin.Method = { 
    div_bodys:"bodys",
    div_main:"login",
    div_logo:"logo", 
    div_edit:"loginParam", 
    div_login:"doLogin", 
    main:null, 
    edit:null,
    chat_logFirst:false,
    addListen:function(){
        this.edit.addEventListener('keydown', function(e){ 
             if(e.keyCode == 13 ) {
                 clicks.login()
                 return
             } 
        })
    },
    logined:function(){
        ele = util.getEleById(this.div_bodys)
        ele.innerHTML = "" 
       titleLayout.show();
       mainLayout.show(); 
       menuLayout.show();    
    },
    show:function(){ 
        div = util.addEle("div")
        div.setAttribute("class", this.div_main) 
        div.id = this.div_main
        ele = util.getEleById(this.div_bodys)
        ele.appendChild(div) 
        this.main = div 
        this.addLogoDiv()
        this.addUserPasswdDiv() 
        this.addLoginBtn() 
        this.addListen();   
    }, 
    addLoginBtn:function(){
        div = util.addEle("div")
        div.setAttribute("class", this.div_login) 
        div.setAttribute("onclick", "clicks.login()") 
        dv = util.addEle("div")
        div.appendChild(dv)
        img = util.addEle("img")
        div.appendChild(img)
        this.main.appendChild(div) 
    },
    addLogoDiv:function(){ 
        div = util.addEle("div")
        div.setAttribute("class", this.div_logo) 
        dv = util.addEle("div")
        div.appendChild(dv)
        img = util.addEle("img")
        div.appendChild(img)
        this.main.appendChild(div)  
    },
    addUserPasswdDiv:function(){ 
        div = util.addEle("div")
        div.setAttribute("class", this.div_edit)  
        this.main.appendChild(div) 
        div.innerHTML +=  this.userHtml()  //会变更 textarea 地址 
        this.edit = util.getEleById("user")
    },
    userHtml:function(){
        var fileUps= '<div class="loginData">\
        <span><div></div><img alt="" ></span>\
        <input id="user" required="" onchange="" \
        type="text" maxlength="11" placeholder="username" value=""/></div>'
         return fileUps 
    },
    getUserName:function(){  
        return this.edit.value 
    }, 
    
}
 
 