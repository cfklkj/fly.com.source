var bodyRight = bodyRight || {};
var bodysRight = bodyRight.Method = {   
    div_logEdit:null,
    show:function(ele){  
        this.bottomEdit(ele)  
    },
    bottomEdit:function(ele){
        txt = util.addEle("textarea") 
        txt.setAttribute("readonly", "readonly")
        ele.appendChild(txt)
        this.div_logEdit = txt
    }, 
    addMsg:function(msg){
        this.div_logEdit.innerHTML = this.div_logEdit.innerHTML + "\n" + msg 
        this.div_logEdit.scrollTop = this.div_logEdit.scrollHeight
    } 
}  