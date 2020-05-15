package fund

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
	fmt.Println("eg-订阅基金:-fu url -fn name -fs souver -fb buy\n ")
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
	doc.Find("div.fundDetail-main div.dataOfFund dl dd.dataNums").Each(func(i int, s *goquery.Selection) {
		// year
		//fmt.Println(s.Html())
		//	class, err := s.Attr("class")
		//fmt.Println(s.Text())
		points := s.Text()
		if i == 0 {
			nowPoint, next := getFundPt(points)
			urls = append(urls, nowPoint)
			nowPoint, _ = getFundPt(next)
			urls = append(urls, nowPoint)
		}
		if i == 1 {
			nowPoint, _ := getFundPt(points)
			urls = append(urls, nowPoint)
		}
	})
	return urls
}

func getFundPt(data string) (string, string) {
	index := strings.Index(data, ".")
	nowPoint := data[0 : index+5]
	data = data[index+5:]
	return nowPoint, data
}
func getPoint(url string, fundName, max, min string) []string {
	fundPoints := Gethour3data(url)
	push := false
	rst := []string{}
	tips := ""
	for index := 0; index < 3; index++ {
		weather := fundPoints[index]
		tmp := ""
		if index == 0 && !push {
			if weather > max {
				tips = "到达设定高峰--" + max + "--赶紧卖出"
				push = true
			}
			if weather < min {
				tips = "到达设定低谷--" + min + "--快快买入"
				push = true
			}
			tmp = "当前净值:" + weather
		}
		if index == 1 {
			if fundPoints[0] > fundPoints[1] {
				tmp = "差值:-" + weather
			} else {
				tmp = "差值:+" + weather
			}
		}
		if index == 2 {
			tmp = "历史净值:" + weather
		}
		rst = append(rst, tmp)
	}
	if push {
		rst = append(rst, tips)
		return rst
	}
	return nil
}

func GetFundInfo() string {
	url := getArg("-fu")
	fname := getArg("-fn")
	souver := getArg("-fs")
	buy := getArg("-fb")
	if url == "" || fname == "" || souver == "" || buy == "" {
		help()
		return ""
	}
	fd := getPoint(url, fname, souver, buy)
	body := ""
	if fd != nil {
		body = "基金:" + fname + "<br>"
		for index := 3; index > -1; index-- {
			body += fd[index] + "<br>"
		}
	}
	return body
}
