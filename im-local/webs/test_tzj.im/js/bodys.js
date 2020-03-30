var body = body || {};
var bodys = body.Method = {  
    div_main:"bodys",
    div_left:null,
    div_middle:null,
    div_right:null,
    show:function(){
        eleBody = util.getEleById(this.div_main)
        this.drawLeft()
        eleBody.appendChild(bodys.div_left)
        this.drawMiddel()
        eleBody.appendChild(bodys.div_middle)
        this.drawRight()
        eleBody.appendChild(bodys.div_right)

        bodysLeft.show(bodys.div_left)
        bodysMiddel.show(bodys.div_middle)
        bodysRight.show(bodys.div_right)
    },
    drawLeft:function(){
        div = util.addEle("div")
        div.setAttribute("class", "bLeft")
        bodys.div_left = div
    }, 
    drawMiddel:function(){
        div = util.addEle("div")
        div.setAttribute("class", "bMiddle")
        bodys.div_middle = div
    }, 
    drawRight:function(){
        div = util.addEle("div")
        div.setAttribute("class", "bRight")
        bodys.div_right = div
    }, 
}  