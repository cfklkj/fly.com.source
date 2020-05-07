var flyUtil =  flyUtil || {}; 

var util = flyUtil.commonMethod  = {
    sleep:function(delay){
        var start = (new Date()).getTime();
        while((new Date()).getTime() -start < delay){
            continue;
        }
    },
    getSearchString:function(key, Url) {
        var str = Url;
        str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
        // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
        var arr = str.split("&");
        var obj = new Object();
        // 将每一个数组元素以=分隔并赋给obj对象 
        for (var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=");
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
        }
        return obj[key];
    },
    zip:function(str){ 
        var bStr = pako.gzip(encodeURIComponent(str),{to:'string'})
        return btoa(bStr)
    },
    unzip:function(b64Data){
        console.log(data); 
        var strData   = atob(b64Data);
        // Convert binary string to character-number array
        var charData  = strData.split('').map(function(x){return x.charCodeAt(0);});
        // Turn number array into byte-array
        var binData   = new Uint8Array(charData);
        // // unzip
        var data    = pako.inflate(binData);
        // Convert gunzipped byteArray back to ascii string:
        strData   = String.fromCharCode.apply(null, new Uint16Array(data));
        return decodeURIComponent(strData); 
    },
    getIp:function(){
        var reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        var ip = reg.exec(window.location.href);
        if (ip == null){ 
            url = window.location.hostname 
            return url
        }else{ 
            return ip[0]
        }
    },
    addEle:function(tag){
        return document.createElement(tag) //li a
    },
    addDiv: function(id){   
      return "<div id="+id +"></div>" 
    },
    //ele
    getEleByTag: function(tag)
    {
        return document.getElementsByTagName(tag)
    },
    //ele
    getEleById: function(id)
    {
        return document.getElementById(id)
    },
    //value
    getEleValue:function(id)
    { 
        ele = document.getElementById(id) 
        return ele.value
    },
    setEleValue:function(id, data){
        document.getElementById(id).value=data
    },
    //set value
    setEleName :function(id, name)
    {
        ele = this.getEleById(id)
        ele.innerHTML = name
    },
    //添加css
    addClass: function(ele, classname)
    {   
        var oldClass = ele.className;
        var pattern = new RegExp('(^|\\s)' + classname + '(\\s|$)');      
        if (!pattern.test(oldClass))
        {         
            if (ele.className == "")
            {
                ele.className = classname
            }else{
                ele.className += ' ' + classname;  
            } 
        } 
    },    
    //删除css
    delClass: function(ele, classname){ 
      var oldClass = ele.className;
      var pattern = new RegExp('(^|\\s)' + classname + '(\\s|$)');      
      if (!pattern.test(oldClass)) {         
            ele.className = ele.className.replace(pattern, ' ');
        }else {
            if (ele.className != null) { 
                ele.className  = ""
            }
        } 
    },
    dropClass:function(id, parent){ 
        ele =  util.getEleById(id)
        if (ele == null) {
            return
        }
        if (parent)
        { 
            if (ele.parentElement.className == null){
                return
            } 
             ele.parentElement.className = null
             return
        }
        if (ele.className == null)
        {
            return
        }
        ele.className = null
    },
    //添加元素
    addElement: function(ele, html){ 
     ele.innerHTML += html 
   },
   //清空
   clearElement:function(ele){
       ele.innerHTML = "";
   },
   //滚动
   addScrollEvt:function(id, callBack){
    ele = util.getEleById(id)
    ele.setAttribute("onscroll",callBack); 
   },
   getScrollTop:function(){
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if(document.body){
            bodyScrollTop = document.body.scrollTop;
        }
        if(document.documentElement){
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    }, 
    addEvt:function(id, event, callBack){
        ele = util.getEleById(id)
        ele.setAttribute(event,callBack);   
    },
   //添加方法
    addEvent: function(id, callBack){ 
        ele = util.getEleById(id)
        ele.setAttribute("onclick",callBack);  
      },
      addMouseOut:function(id, callBack){
          ele = util.getEleById(id)
          ele.setAttribute("onmouseout",callBack);   
      },
    addMouseOver:function(id, callBack){
        ele = util.getEleById(id)
        ele.setAttribute("onmouseover",callBack);   
    },
    addMouseDown:function(id, callBack){
        ele = util.getEleById(id)
        ele.setAttribute("onmousedown",callBack);   
    },
    timeHms:function(){
        var now = new Date();
        var hour = now.getHours();//得到小时
        var minu = now.getMinutes();//得到分钟
        var sec = now.getSeconds();//得到秒
        var time = "";
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        time = hour + ":" + minu + ":" + sec;
        return time
    },
    post: function(GOrP, URL, formData, callBack){ 
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
}   