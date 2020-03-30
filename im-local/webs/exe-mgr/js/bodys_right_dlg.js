 
var layoutBody_Right_dlg = layoutBody_Right_dlg || {};
var bodysRightDlg = layoutBody_Right_dlg.Method = {  
    oldName:"",
    oldPath:"",
    showAdd:function(){  
        div = util.getEleById(bodys.div_box)
        div.setAttribute("class", "box")   
        div.innerHTML = boxHtml
        input = util.getEleById("addExe")
        input.setAttribute("onclick", "bodysRightDlg.addAct()")
    },
    addAct:function(){ 
        input = util.getEleById("exename")
        name = input.value
        input = util.getEleById("path")
        path = input.value
        if (name == "" || path == "")
        {
            alert("输入信息不能为空！")
            return
        } 
        localSocket.setRunInfo(defines.Act_add, "", name, path) 
        this.closeBox()
    },
    closeBox:function(){ 
        div = util.getEleById(bodys.div_box)
        div.setAttribute("class", "hideDiv")  
        div.innerHTML = ""
    }, 
    showInfo:function(name, path){
        div = util.getEleById(bodys.div_box)
        div.setAttribute("class", "box")   
        div.innerHTML = boxHtml
        input = util.getEleById("exename")
        input.value=name
        input = util.getEleById("path")
        input.value=path
        input = util.getEleById("addExe")
        input.value="修改"
        input.setAttribute("onclick", "bodysRightDlg.altAct()")
        this.oldName = name
        this.oldPath = path
    },
    altAct:function(){ 
        input = util.getEleById("exename")
        name = input.value
        input = util.getEleById("path")
        path = input.value
        if (name == "" || path == "")
        {
            alert("输入信息不能为空！")
            return
        } 
        if(this.oldName != name || this.oldPath != path){
            localSocket.setRunInfo(defines.Act_alt, this.oldName, name, path)
        } 
        this.closeBox()
    },
}

 

var boxHtml='<img  alt="" src="/image/exit.png" onclick="bodysRightDlg.closeBox()">\
<h2>添加运行程序</h2>\
<div>\
    <div class="inputbox">\
        <input type="text" name="" required="" id="exename" value="">\
        <label>名称</label>\
    </div>\
    <div class="inputbox">\
        <input type="text" name=" " required=""  id="path" value="">\
        <label>全路径</label>\
    </div>\
    <input type="button" name="" value="确定" id="addExe" >\
</div>\
</div>'

 