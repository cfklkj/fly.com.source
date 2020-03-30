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
        this.topButtonsImv2(div) 
    }, 
    topButtonsImv2:function(ele){
        bt = util.addEle("button")
        bt.innerHTML = "心跳"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.heart())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "登入获取tcp信息"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.readyLogin())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "登入获取websocket信息"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.readyLoginWs())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "登入"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.msgLogin())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "群创建"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.mucCreate())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "群删除"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.mucDel())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "加入群"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.mucJoin())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "退出群"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.mucLeave())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "大群创建"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.bigMucCreate())")
        ele.appendChild(bt) 
        bt = util.addEle("button")
        bt.innerHTML = "大群删除"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.bigMucDel())")
        ele.appendChild(bt) 
        this.topButtonsImv2Socket(ele)
    },
    topButtonsImv2Socket:function(ele){
        bt = util.addEle("button")
        bt.innerHTML = "大群加入"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.bigMucJoin())")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "大群退出"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.bigMucLeave())")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "大群消息"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.bigMucMsg())")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "普通群聊"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.mucMsg())")
        ele.appendChild(bt)  
        bt = util.addEle("button")
        bt.innerHTML = "私聊"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.singleMsg())")
        ele.appendChild(bt) 
        this.topButtonsImv2Msg(ele)
    },
    topButtonsImv2Msg:function(ele){
        bt = util.addEle("button")
        bt.innerHTML = "未读消息"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.topicMsg())")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "私聊消息"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.singleMsgDetail())")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "群聊消息"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs_imV2.mucMsgDetail())")
        ele.appendChild(bt) 
    },
    topButtonsIm:function(ele){
        bt = util.addEle("button")
        bt.innerHTML = "登入"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.msgLogin('stzj1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJzdHpqMSJ9.k7odXzrmicUBBK9lNs4E1CMA7u6Fc77rouV457ercxw'))")
        //bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.msgLogin('7a57a5a743894a0e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODQxOTMxNjMsInVpZCI6IjEyMDAwMDAwMDMifQ.MKu0HEg1nezF8Kg-tmPwb6rKvl94w4LfIUb73TmCNGM'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "用户列表"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.msgUserlist())")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "备注设置"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.userAliasSet('7a57a5a743894a0e', '备注'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "清除用户"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.userAliasDel('7a57a5a743894a0e'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "消息"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.msgSend('7a57a5a743894a0e', 'chat','hello'))")
      //  bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.msgSend('stzj1', 'chat','hello'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "获取快捷回复"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.callBackMsgGet())")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "设置快捷回复"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.callBackMsgSet('group','你好！'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "删除快捷回复"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.callBackMsgDel('group','你好！'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "获取日志记录长度"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.msgLength('7a57a5a743894a0e'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "获取日志内容"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.msgDetail('7a57a5a743894a0e', 1))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "SET"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.set('keyA', 1))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "GET"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.get('keyA'))")
        ele.appendChild(bt)
        this.drawGroupButton(ele)
    },
    drawGroupButton:function(ele){ 
        bt = util.addEle("button") 
        bt.innerHTML = "已加群列表"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.grouplist())")
        ele.appendChild(bt)
        bt = util.addEle("button") 
        bt.innerHTML = "创建群"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.groupAdd(1, 'testGroup', 'password'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "加群"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.groupDel(1, 'groupid'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "退群"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.groupJoin(1, 'groupid', 'password'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "解散"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.groupLeave(1, 'groupid'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "群成员"                 
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.groupMsgLength(1, 'groupid'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "群消息"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.groupMsgDetail(1,'groupid'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "群名称"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.Msg_groupSetAlias(1,'groupid', 'groupname'))")
        ele.appendChild(bt)
        bt = util.addEle("button")
        bt.innerHTML = "群成员名称"
        bt.setAttribute("onclick", "bodysLeft.setBottomEdit(mkMsgs.groupSetMemberAlias(1,'groupid','userid','alias'))")
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