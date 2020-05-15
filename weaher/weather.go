package weather

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func getArg(tag string) string {
	L := len(os.Args)
	for i := 1; i < L; i++ {
		if os.Args[i] == tag {
			if i+1 < L {
				return os.Args[i+1]
			}
			return ""
		}
	}
	return ""
}
func help() {
	fmt.Println("eg-订阅天气:-ww where -wu urlWeather [-wc check]\n ")
}

func Gethour3data(url string) []string {
	var urls []string
	client := &http.Client{}
	//提交请求
	reqest, err := http.NewRequest("GET", url, nil)

	//增加header选项
	//reqest.Header.Add("Cookie", "xxxxxx")
	//reqest.Header.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1;WOW64) AppleWebKit/537.36 (KHTML,like GeCKO) Chrome/45.0.2454.85 Safari/537.36 115Broswer/6.0.3")

	if err != nil {
		fmt.Println("err--1")
		panic(err)
	}
	//处理返回结果
	resp, err := client.Do(reqest)
	//defer resp.Body.Close()

	//	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("err--1", resp.StatusCode)
		panic(err)
	}
	// bodyString, err := ioutil.ReadAll(resp.Body)
	// fmt.Println(string(bodyString))
	if resp.StatusCode != 200 {
		fmt.Println("err--1", resp.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		panic(err)
	}
	//doc.Find("#content div div.article ol li div div.info div.hd a").Each(func(i int, s *goquery.Selection) {
	doc.Find("div.left-div div#today script").Each(func(i int, s *goquery.Selection) {
		// year
		//	fmt.Println(s.Html())
		//	class, err := s.Attr("class")
		//	fmt.Println(s.Text())
		datas := strings.Split(s.Text(), "=")
		if len(datas) > 1 {
			datas = strings.Split(datas[1], ",\"23d\"")
			datas = strings.Split(datas[0], ":")
			lenth := len(datas[1])
			data := datas[1][1 : lenth-1]
			urls = strings.Split(data, "\",\"")
		}
	})
	return urls
}

func getWeather(url, check string) []string {
	//newUrl := "http://www.weather.com.cn/weather1d/101230705.shtml#around1"
	weathers := Gethour3data(url)
	rain := false
	rst := []string{}
	for index, weather := range weathers {
		if index > 0 && !rain {
			if (check != "" && strings.Contains(weather, check)) || check == "" {
				rain = true
			}
		}
		//去掉 "
		tmp := strings.Replace(weather, "\"", "", -1)
		tmps := strings.Split(tmp, ",")
		tmp = ""
		//去掉 x0x 最后一个
		for i, v := range tmps {
			if i == 1 || i == 6 {
				continue
			}
			tmp += v + " "
		}
		rst = append(rst, tmp)
	}
	if rain {
		return rst
	}
	return nil
}

func GetWeather() string {
	url := getArg("-wu")
	where := getArg("-ww")
	check := getArg("-wc")
	if url == "" || where == "" {
		help()
		return ""
	}
	wl := getWeather(url, check)
	body := ""
	if wl != nil {
		body = "局部天气:" + where + "<br>"
		for _, data := range wl {
			body += data + "<br>"
		}
	}
	return body
}
