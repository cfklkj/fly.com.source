package svr_file

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"../../module/file"
)

type SvrFile struct {
	PatternFileServer string //"/download/"
	PatternUpfile     string //"/upload"
	PatternLog        string //"/log"
	PatternFriend     string //"/friend"
	FileServerDir     string // "./" local dir
	FormKey_up        string // "uploadfile"
	fileAct           file.FileAct
	jsonFile          file.JsonFile
}

func (c SvrFile) Listen() int {
	if c.PatternFileServer == "" || c.FileServerDir == "" || c.FormKey_up == "" {
		return -1
	}
	dir, err := filepath.Abs(c.FileServerDir) //filepath.Dir(os.Args[0])
	if err != nil {
		log.Fatal(err)
		return -2
	}
	os.Mkdir(dir, os.ModePerm)
	os.Mkdir(c.FileServerDir+c.PatternLog, os.ModePerm)
	os.Mkdir(c.FileServerDir+c.PatternFileServer, os.ModePerm)
	fmt.Println("file-FileServer:", dir)
	http.Handle(c.PatternFileServer, http.FileServer(http.Dir(dir))) // dir 下的  PatternFileServer 目录
	http.HandleFunc(c.PatternUpfile, c.upload)                       //设置访问的路由
	http.HandleFunc(c.PatternLog+"/select/count", c.logReadLen)      //设置访问的路由
	http.HandleFunc(c.PatternLog+"/select/detail", c.logReadIndex)   //设置访问的路由
	http.HandleFunc(c.PatternLog+"/add", c.logWrite)                 //设置访问的路由
	http.HandleFunc(c.PatternFriend+"/add", c.friendWrite)           //设置访问的路由
	http.HandleFunc(c.PatternFriend+"/select", c.friendRead)         //设置访问的路由
	return 0
}

func (c SvrFile) sendBack(w http.ResponseWriter, code int, data interface{}) {
	var rst S2CBody
	rst.Code = code
	rst.Data = data
	dataStr, _ := json.Marshal(rst)
	io.WriteString(w, string(dataStr))
}

func (c SvrFile) getBodyData(w http.ResponseWriter, r *http.Request, rst interface{}) bool {
	body, err := ioutil.ReadAll(r.Body) //r.FormFile(c.FormKey_up)   req.Form.Get("appid")
	if err != nil {
		c.sendBack(w, -2, "ReadAll")
		return false
	}
	if json.Unmarshal(body, rst) != nil {
		c.sendBack(w, -3, "Unmarshal")
		return false
	}
	return true
}
