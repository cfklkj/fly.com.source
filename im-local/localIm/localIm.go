package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"

	"../svr_module/svr_file"
	"../svr_module/svr_tcp"
	"../svr_module/svr_web"
)

func check(err error) {
	if err == nil {
		return
	}
	fmt.Println(err)
	fmt.Println("eg:\n -ip ip:port -w webLocalPath -f fileLocalPath [-ssl sslPath]")
	os.Exit(0)
}

func getParame(args []string, tag string) (string, error) {
	finded := false
	length := len(args)
	for index := 1; index < length; index++ { //range  是随机 不能在此处使用
		v := args[index]
		if !finded {
			if v == tag {
				finded = true
			}
			continue
		}
		return v, nil
	}
	return "", errors.New("no find tag:" + tag)
}

func main() {
	host, err := getParame(os.Args, "-ip")
	check(err)
	webFilePath, err := getParame(os.Args, "-w")
	check(err)
	//---
	svrweb := svr_web.SvrWeb{
		PatternCss:    "/css/",
		PatternJs:     "/js/",
		PatternImg:    "/image/",
		FileServerDir: "./",
		IndexHtml:     "index.html",
	}
	svrtcp := svr_tcp.NewSvrTcp()
	svrfile := svr_file.SvrFile{
		PatternFileServer: "/download/",
		PatternUpfile:     "/upload",
		PatternLog:        "/log",
		PatternFriend:     "/friend",
		FileServerDir:     "d:/www",
		FormKey_up:        "uploadfile",
	}
	svrweb.FileServerDir = webFilePath

	fileLocalPath, err := getParame(os.Args, "-f")
	if err != nil {
		svrfile.FileServerDir = webFilePath
	} else {
		svrfile.FileServerDir = fileLocalPath
	}
	svrtcp.Listen()
	svrweb.Listen()
	svrfile.Listen()
	fmt.Println("server: " + host)
	sslPath, err := getParame(os.Args, "-ssl")
	if err != nil {
		err = http.ListenAndServe(host, nil)
		check(err)
	} else {
		err = http.ListenAndServeTLS(host, sslPath+"/cert.pem", sslPath+"/key.pem", nil)
		check(err)
	}
}

//https://studygolang.com/articles/14947?utm_medium=referral -- openssl
// -ip 127.0.0.1:8002 -w E:\gits\fly.com.build\tools\localim [-f E:\gits\fly.com.build\tools\localim]
// -ssl E:\gits\fly.com.build\tools\localim\download\ssl
