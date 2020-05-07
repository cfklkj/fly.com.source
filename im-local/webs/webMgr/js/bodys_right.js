 
var layoutBody_Right = layoutBody_Right || {};
var bodysRight = layoutBody_Right.Method = {   
    div_set_bottom:null, 
    div_statu_left:null,
    div_statu_right:null,
    pList:[],      
    showStatu:function(event){ 
        if(!bodysLeft.select(event)){
            return
        } 
        eleBody = util.getEleById(bodys.div_right); 
        eleBody.innerHTML = ""
        this.addStatu_left(eleBody) 
        this.addStatu_right(eleBody) 
        localSocket.getRunInfo(defines.Act_all, "")
    },
    addStatu_left:function(pEle){
        div = util.addEle('div') 
        div.setAttribute("class","statuLeft") 
        pEle.appendChild(div)
        this.div_statu_left = div 
        bodys.mem.add(defines.act_rightSelect, null)
    },
    addStatu_right:function(pEle){
        div = util.addEle('div') 
        div.setAttribute("class","statuRight") 
        pEle.appendChild(div) 
        this.div_statu_right = div 
    },
    statu_leftAdd:function(name, isRun){
        if(!isRun){
            return
        }
        p = util.addEle('p')  
        p.innerText=name
        p.setAttribute("onclick","bodysRightAct.getStatulenth(this)")
        p.setAttribute("class", "statuLeftPunSelect")
        this.div_statu_left.appendChild(p)  
        if (bodys.mem.get(defines.act_rightSelect) == null) { 
            p.click()
        }
    },
    statu_rightAdd:function(name, text, old=false){  
        if(name != bodys.mem.get(defines.act_rightSelect).innerText)
            return;
        div = util.addEle('div')  
        xmp = util.addEle('xmp')  
        xmp.innerText=text
        if (old){
            this.div_statu_right.insertBefore(div, this.div_statu_right.children[0]) 
        }else{
            this.div_statu_right.appendChild(div) 
        }
        div.appendChild(xmp)
    },
    showSet:function(event){ 
        if(!bodysLeft.select(event)){
            return
        }  
        eleBody = util.getEleById(bodys.div_right); 
        eleBody.innerHTML = "" 
        this.addSet_top(eleBody)
        this.addSet_bottom(eleBody)
        window.setTimeout('localSocket.getRunInfo(defines.Act_all, "")', 10)
    }, 
    addSet_top:function(pEle){
        div = util.addEle('div')
        div.setAttribute("class","setTop") 
        pEle.appendChild(div)  
        divChile = util.addEle('div') 
        div.appendChild(divChile) 
        p = util.addEle('p')
        p.innerText="添加"
        p.setAttribute("onclick","bodysRightDlg.showAdd(this)")
        divChile.appendChild(p) 
        p = util.addEle('p')
        p.innerText="全部运行"
        p.setAttribute("onclick","bodysRightAct.startAll(this)")
        divChile.appendChild(p) 
        p = util.addEle('p')
        p.innerText="全部停止"
        p.setAttribute("onclick","bodysRightAct.stopAll(this)")
        divChile.appendChild(p) 
    },
    addSet_bottom:function(pEle){
        div = util.addEle('div')
        div.setAttribute("class","setBottom") 
        pEle.appendChild(div)  
        this.div_set_bottom = div        
    },
    addSet_bottom_ele:function(name, isRun=false){  
        if(name == ""){
            return
        }  
        divChile = util.addEle('div')  
        this.div_set_bottom.appendChild(divChile) 
        span = util.addEle('span')
        span.innerHTML=name
        divChile.appendChild(span) 
        p = util.addEle('p')
        p.innerText="详情"
        p.setAttribute("onclick", "bodysRight.getDetail(this, '"+name+"')")
        divChile.appendChild(p) 
        p = util.addEle('p')
        p.innerText="删除"
        p.setAttribute("onclick", "bodysRight.delRunInfo(this, '"+name+"')")
        divChile.appendChild(p) 
        p = util.addEle('p')
        if (isRun){
            p.innerText="停止"
        }else{
            p.innerText="运行" 
        }
        p.setAttribute("onclick", "bodysRight.run(this, '"+name+"')")
        this.pList[this.pList.length] = p
        divChile.appendChild(p)  
    },
    run:function(evt, name){
        bodys.mem.add(defines.act_detail, evt)
        if (evt.innerText == "运行"){
            localSocket.doRun(defines.Act_start,  name )  
        }else{
            localSocket.doRun(defines.Act_stop,  name) 
        }
    },
    alterStatu:function(isRun){  
        evt = bodys.mem.get(defines.act_detail)
        if (isRun){ 
            evt.innerHTML = "停止" 
        }else{
            evt.innerText = "运行"
        }

    },
    delRunInfo:function(evt, name){
        bodys.mem.add(defines.act_detail, evt)
        localSocket.setRunInfo(defines.Act_del, "", name, "")  
    },
    delTag:function(){ 
        evt = bodys.mem.get(defines.act_detail)
        evt = evt.parentNode
        evt.parentNode.removeChild(evt)
    },
    getDetail:function(evt, name){
        bodys.mem.add(defines.act_detail, evt)
        localSocket.getRunInfo(defines.Act_single, name)
    },
    alterDetail:function(name){ 
        if (name == ""){
            return
        } 
       evt = bodys.mem.get(defines.act_detail)
       evt = evt.parentNode
       evt.childNodes[0].innerText = name 
    }
}

 
