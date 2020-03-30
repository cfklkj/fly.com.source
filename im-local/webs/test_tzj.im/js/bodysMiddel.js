var bodyMiddel = bodyMiddel || {};
var bodysMiddel = bodyMiddel.Method = {   
    d_post:null,
    d_send:null,
    show:function(ele){  
        this.drawButton(ele)  
    },
    drawButton:function(ele){
        div = util.addEle("div")
        div.setAttribute("index", "1") 
        div.innerHTML = "-----发送----》"
        div.setAttribute("onclick", "bodysMiddel.sendMsg()")
        ele.appendChild(div) 
        this.d_send = div
        div = util.addEle("div")
        div.setAttribute("index", "2") 
        div.innerHTML = "-----Post----》"
        div.setAttribute("onclick", "bodysMiddel.postMsg()")
        ele.appendChild(div) 
        this.d_post = div
        this.d_post.setAttribute("style","display:none")
        this.d_send.setAttribute("style","display:none")
    },
    showPost:function(){
        this.d_send.setAttribute("style","display:none")
        this.d_post.setAttribute("style","") 
    },
    showSend:function(){
        this.d_post.setAttribute("style","display:none")
        this.d_send.setAttribute("style","")
    },
    sendMsg:function(){
        data = bodysLeft.div_bottomEdit.innerHTML
        localSocket.send(data)
    },
    postMsg:function(){
        data = bodysLeft.div_bottomEdit.innerHTML
        obj = JSON.parse(data)
        util.post("POST", defines.WebApiUrl + obj.url, obj.data, this.showMsg)
    },
    showMsg:function(msg){
        bodysRight.addMsg(msg)
        console.debug(msg)
    }
}  