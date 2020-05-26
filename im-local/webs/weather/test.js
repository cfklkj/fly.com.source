weather = { 
    getWeatherInfo: function () {
      //  var param = encodeURI("ProcCode=2059&appId=web2&Uid=web&cityName=" + cityName + "&province=" + province + "&district=" + district + "&city=" + cityId);
      var param = "ProcCode=2059&appId=web2&Uid=web&cityName=&province=&district=&city=0101050203"
      $.ajax({
            data: {
                p: param,
                output: 'json',
            },
            url: 'https://ext.zuimeitianqi.com/extDataServer/3.0/',
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'callback',
            error: function () {
            },
            success: function (res) {
                if (res.data.length > 0) {
                   // weather.showWeatherInfo(res);
                   // reportStat(9999);
                   console.log(res)
                } else {
                    alert('暂无数据,请重新选择！');
                }
            }
        }, false);
    },
}

window.onload = main  

function main(){
    weather.getWeatherInfo()
}