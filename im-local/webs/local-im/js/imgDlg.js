var layoutImgDlg = layoutImgDlg || {};
var imgDlg = layoutImgDlg.Method = {   
    fileType:"",
    fileName:"",
    openDlg:function(id){   
        ele = util.getEleById(id) 
        if(ele.value != "")    //重复图片问题
        {
            ele.value = ""
        }
        ele.click();
    },
    changes:function(file){
        if (!file.files || !file.files[0]) { 
            return;
        }  
        var reader = new FileReader(); 
        reader.onload = function (evt) {  
            imgDlg.fileType = file.files[0].type
            imgDlg.fileName = file.files[0].name
            imgDlg.sumitImageFile(evt.target.result, this.fileType)  
        } 
        reader.readAsDataURL(file.files[0]); 
    },
    doneSubmit:function(res){  
        body = JSON.parse(res)
        if (body.Code == 200){
           data = memHash.get(imDefine.mem_loginData)  
           fileInfo ={"name":imgDlg.fileName,"path": body.Data}
           if (imgDlg.fileType.indexOf("image/") > -1) {
                chatRight.send(actRecords.get(imDefine.act_selectContent),fileInfo, imDefine.chat_img) 
         }else{
                 chatRight.send(actRecords.get(imDefine.act_selectContent),fileInfo, imDefine.chat_file) 
         }
        }       
    },
    sumitImageFile:function(base64Codes, fileType){   
        var formData = new FormData();   
        formData.append("uploadfile",imgDlg.convertBase64UrlToBlob(base64Codes, fileType));  //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同  
        doHttp.requestProx("POST","/upload",formData, imgDlg.doneSubmit) 
    },
    //convertBase64UrlToBlob函数是将base64编码转换为Blob  
    convertBase64UrlToBlob:function(urlData, fileType){  

        var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
    
        //处理异常,将ascii码小于0的转换为大于0  
        var ab = new ArrayBuffer(bytes.length);  
        var ia = new Uint8Array(ab);  
        for (var i = 0; i < bytes.length; i++) {  
            ia[i] = bytes.charCodeAt(i);  
        }   
        return new Blob( [ab] , {type : fileType});  
    } 
} 