 
var layoutBody_left = layoutBody_left || {};
var bodysLeft = layoutBody_left.Method = {     
    select:function(event){
        if(bodys.mem.get(defines.act_leftSelect) == event){ 
            return false
        }  
        util.delClass(event, "unSelect")
        util.addClass(event, "select")
        ele = bodys.mem.get(defines.act_leftSelect)
        if (ele != null){
            util.delClass(ele, "select")
            util.addClass(ele, "unSelect") 
        }
        bodys.mem.add(defines.act_leftSelect, event);
        return true
    },
    show:function(){
        eleBody = util.getEleById(bodys.div_left);
        this.addLogo(eleBody) 
        this.addStatu(eleBody)
        this.addSet(eleBody)
    },
    addLogo:function(pEle){
        logo = util.addEle('div')
        logo.setAttribute("index","1")
        logo.innerHTML = '<img  alt="" src="/image/ic_logo.png"/>'
        pEle.appendChild(logo)  
    },
    addStatu:function(pEle){
        statu = util.addEle('div') 
        statu.setAttribute("index","2")
        statu.setAttribute("class", "unSelect")
        statu.innerHTML = "<p onclick='bodysRight.showStatu(this)' >状态信息</p>"
        pEle.appendChild(statu)   
    },
    addSet:function(pEle){
        set = util.addEle('div') 
        set.setAttribute("index","3")
        set.setAttribute("class", "unSelect")
        p = util.addEle('p') 
        set.appendChild(p)  
        p.innerHTML = "设置/运行"
        p.setAttribute("onclick", 'bodysRight.showSet(this)') 
        pEle.appendChild(set)   
        bodysRight.showSet(p)
    }
}

 
