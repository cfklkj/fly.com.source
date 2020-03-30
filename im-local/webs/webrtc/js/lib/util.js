var flyUtil =  flyUtil || {}; 

var util = flyUtil.commonMethod  = {
    zip:function(str){
        var bStr = pako.gzip(encodeURIComponent(str),{to:'string'})
        return btoa(bStr)
    },
    unzip:function(b64Data){ 
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
    getUrl:function(){   
        return window.location.host 
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
                ele.className += ' ' + classname;   
        } 
    },    
    //删除css
    delClass: function(ele, classname){ 
      var oldClass = ele.className;
      var pattern = new RegExp('(^|\\s)' + classname + '(\\s|$)');      
      if (!pattern.test(oldClass)) {     
            if (ele.className.replace) {   
             ele.className = ele.className.replace(pattern, ' ');
            }
        }else {
            if (ele.className != null) { 
                ele.className  = null
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
    isMobile:function() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){
                //电脑端 
                return false 
        }else{
                //手机端 
                return true
        }
    },
    // 获取光标位置
    getCursortPosition:function(ctrl) {
        var CaretPos = 0;   // IE Support
        if (document.selection) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart ('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }, 
    // 设置光标位置
    setCaretPosition:function(ctrl, pos){
        if(ctrl.setSelectionRange)
        {
            ctrl.focus();
            ctrl.setSelectionRange(pos,pos);
        }
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    },
    copyData:function(evt) {   
        console.debug(evt.innerText)
        var oInput = document.createElement('textarea');  //input 不支持换行

        oInput.value = evt.innerText;

        document.body.appendChild(oInput);

        oInput.select(); // 选择对象

        document.execCommand("Copy"); // 执行浏览器复制命令

        //oInput.className = 'oInput';

        oInput.style.display='none';

        //alert('复制成功'); 
    }

}   


