package svr_file

import (
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
)

func (c SvrFile) randName(lenth int, tail string) string {
	rand.Seed(int64(rand.Intn(10000)))
	name := make([]byte, lenth)
	for i := 0; i < lenth; i++ {
		isUp := rand.Intn(2)
		index := rand.Intn(25)
		if isUp < 1 {
			name[i] = byte('a' + index)
		} else {
			name[i] = byte('A' + index)
		}
	}
	return string(name) + tail
}

func (c SvrFile) upload(w http.ResponseWriter, r *http.Request) {
	fmt.Println("upload")
	if r.Method == "GET" {
		c.sendBack(w, -1, "method")
		return
	} else {
		//r.ParseMultipartForm(32 << 20)
		file, fileHead, err := r.FormFile(c.FormKey_up)
		if err != nil {
			c.sendBack(w, -2, "formFile")
			return
		}
		fileName := fileHead.Filename
		if fileName == "" || fileName == "blob" {
			fileName = c.randName(9, ".fly.db")
		} else {
			fileName += ".fly.db"
		}
		defer file.Close()
		localPath := c.FileServerDir + c.PatternFileServer + "/" + fileName
		f, err := os.OpenFile(localPath, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			c.sendBack(w, -3, "openFile")
			return
		}
		defer f.Close()
		io.Copy(f, file)
		c.sendBack(w, 200, c.PatternFileServer+"/"+fileName)
	}
}
