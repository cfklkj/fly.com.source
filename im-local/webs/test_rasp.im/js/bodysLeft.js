var bodyLeft = bodyLeft || {};
var bodysLeft = bodyLeft.Method = {  
    div_main:"bodys",
    div_left:null,
    div_middle:null,
    div_bottomEdit:null,
    show:function(ele){ 
        this.drawTop(ele)
        this.drawBottom(ele)  
    },
    drawTop:function(ele){
        div = util.addEle("div")
        div.setAttribute("class", "bLeftTop") 
        ele.appendChild(div)
        this.topButtons(div) 
    }, 
    topButtons:function(ele){
        bt = util.addEle("button")
        bt.innerHTML = "ssh"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_rasp.Ssh())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "关机"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_rasp.Shutdown())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "播放歌曲"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_rasp.PlayMusic())")
        ele.appendChild(bt)  
    }, 
    drawBottom:function(ele){
        div = util.addEle("div")
        div.setAttribute("class", "bLeftBottom")
        ele.appendChild(div)
        this.bottomEdit(div)
    },  
    bottomEdit:function(ele){
        txt = util.addEle("textarea") 
        ele.appendChild(txt)
        this.div_bottomEdit = txt
    },
    setBottomEdit:function(msg){
        this.div_bottomEdit.innerText = msg
    }
}  