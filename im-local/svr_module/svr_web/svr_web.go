package svr_web

import (
	//"fmt"

	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

const (
	webs = "/webs/"
	web  = "/web/"
)

type SvrWeb struct {
	PatternCss    string //"/css/"
	PatternJs     string //"/js/"
	PatternImg    string //"/image/"
	FileServerDir string //"./"
	IndexHtml     string
}

func NewSvrWeb() *SvrWeb {
	ret := new(SvrWeb)
	return ret
}

//开启服务器
func (c *SvrWeb) Listen() int {
	// 设置服务文件
	dir, err := filepath.Abs(c.FileServerDir) //dir := "./web/"
	if err != nil {
		log.Fatal(err)
		return -1
	}
	os.Mkdir(dir+webs, os.ModePerm)
	os.Mkdir(dir+web, os.ModePerm)
	fmt.Println("web-FileServer:", http.FileServer(http.Dir(dir)))
	/*/文件服务器访问方式   ip/goto/web/index.html
	将web目录存放到 goto 目录下
	*/
	http.Handle(webs, http.FileServer(http.Dir(dir)))
	//默认访问方式
	http.Handle(c.PatternCss, http.FileServer(http.Dir(dir+web)))
	http.Handle(c.PatternJs, http.FileServer(http.Dir(dir+web)))
	http.Handle(c.PatternImg, http.FileServer(http.Dir(dir+web)))
	http.HandleFunc("/", c.HomePage)
	return 0
}

func (c *SvrWeb) HomePage(w http.ResponseWriter, req *http.Request) {
	if req.Method != "GET" && req.Method != "get" {
		return
	}
	path := req.URL.Path
	if path != "/" {
		return
	}
	path = c.FileServerDir + web + c.IndexHtml
	t, err := template.ParseFiles(path)
	if err != nil {
		fmt.Println("sdd", err)
		return
	}
	var buf bytes.Buffer
	err = t.Execute(&buf, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*") //跨域
	w.Header().Set("Cache-Control", "no-cache")        //跨域
	_, err = w.Write(buf.Bytes())
	if err != nil {
		fmt.Println("err2", err)
		return
	}
}
