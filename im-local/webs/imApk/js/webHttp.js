var imHttp = imHttp || {};
var doHttp = imHttp.Method = {  
    checkData: function(res){  
        data = JSON.parse(res)
        if (data == null || data.Code != 200) {        
            alert(data, res) 
            return null
        }else{ 
            return data
        }      
    },
    requestProx: function(GOrP, URL, formData, callBack){ 
        var xhr = new XMLHttpRequest();
        xhr.open(GOrP, URL, true); 
        xhr.send(formData);  
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { // 读取完成
                if (xhr.status == 200) {  
                       callBack(xhr.responseText) 
                       return
                }
            }
            if(xhr.status == 500){
                callBack(xhr.responseText) 
            } 
            console.log("req-rst", xhr.status, xhr.response)
        }
    },
    request: function(GOrP, URL, data, callBack){ 
        var xhr = new XMLHttpRequest();
        xhr.open(GOrP, URL, true); 
        xhr.send(data);  
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { // 读取完成
                if (xhr.status == 200) { 
                     data = doHttp.checkData(xhr.responseText)
                     if (data != null && callBack != null){ 
                        callBack(data)
                     } 
                     return
                }
            }             
            if(xhr.status == 500){
                if(xhr.responseText == "token timeout")
                {
                    window.location.reload();
                }else
                    alert(xhr.responseText);
            }else{
                console.debug("request error", xhr.status);
            }
        }
    },
    ReadMsgLenth:function(from, to){
        var data =  {"from":from, "to": to}  
        this.request("POST", "/log/select/count", JSON.stringify(data), this.waitMsgLenth)  

    },
    waitMsgLenth:function(msg){ 
        logLength = msg.Data.len 
        if (logLength > 0 ) {
            actRecords.add(imDefine.act_selectContentLogLenth, logLength); 
            chatLayout.chat_logFirst = true;
            chatLayout.upLog(); 
        } 
    },
    mkReadMsg:function(from, to, index){ 
        var data =  {"from":from, "to": to, "index":index}   
        this.request("POST", "/log/select/detail", JSON.stringify(data), this.waitReadMsg)   
    },  
    waitReadMsg:function(msg){
        if (msg.Code == 200){
            info = JSON.parse(msg.Data)
            if (info.from == ""){
                return
            }  
            chatLayout.addMsg(info.from, JSON.parse(util.unzip(info.data)), true)  
        } 
    },
    logAdd:function(msg){ 
        this.request("POST", "/log/add", msg, null) 
    }, 
    // addGroup:function(from, to, index){ 
    //     var data =  {"from":from, "to": to, "index":index}   
    //     this.request("POST", "/log/select/detail", JSON.stringify(data), this.checkData)   
    // },  
    // getGroup:function(msg){ 
    //     this.request("POST", "/log/add", msg, this.checkData) 
    // }, 
}
 