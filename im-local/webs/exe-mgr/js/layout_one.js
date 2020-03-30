
var chatLeftHtml='<div class="chat_l">\
<div  id="chat_" ><div class="chat_l_t_search">\
<span><img  alt="" src="/image/search2.png"/></span>\
<input type="text" value="" name="" required="" maxlength="11" placeholder="search" onchange="chatLeft.search(this)">\
</div>\
</div>\
<div id="chat_l_b"></div>\
</div>'
var layoutBody = layoutBody || {};
var bodys = layoutBody.Method = {  
    div_bodys:'bodys',
    div_box:'box',
    div_left:'b_l', 
    div_right:'b_r',
    mem: new Maps(),
    show:function(){
        eleBody = util.getEleById(bodys.div_bodys);
        div = util.addEle('div')
        div.id=this.div_left
        div.setAttribute("class","bodysLeft")
        eleBody.appendChild(div) 
        div = util.addEle('div') 
        div.setAttribute("class","bodysRight")
        div.id=this.div_right
        eleBody.appendChild(div) 
        this.showOther()
    },
    showOther:function(){
        bodysLeft.show()
    }
}

 
