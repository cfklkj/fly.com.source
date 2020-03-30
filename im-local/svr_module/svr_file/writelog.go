package svr_file

import (
	"encoding/json"
	"net/http"
)

func (c SvrFile) logFileName(user, from, taile string) string {
	if user > from {
		return user + from + taile
	}
	return from + user + taile
}

func (c SvrFile) logWrite(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		c.sendBack(w, -1, "method")
		return
	} else {
		var info s_logInfo
		if !c.getBodyData(w, r, &info) || info.From == "" || info.To == "" {
			c.sendBack(w, -2, "getBodyData")
			return
		}
		fileName := c.logFileName(info.From, info.To, ".msg.db")
		fileName = c.FileServerDir + c.PatternLog + "/" + fileName
		body, _ := json.Marshal(info)
		rst := c.fileAct.WriteLine(fileName, string(body))
		c.sendBack(w, 200, rst)
	}
}

func (c SvrFile) logReadLen(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		c.sendBack(w, -1, "method")
		return
	} else {
		var info s_logLenReq
		if !c.getBodyData(w, r, &info) {
			c.sendBack(w, -2, "getBodyData")
			return
		}
		fileName := c.logFileName(info.From, info.To, ".msg.db")
		fileName = c.FileServerDir + c.PatternLog + "/" + fileName
		count := c.fileAct.CountsLine(fileName)
		c.sendBack(w, 200, s_logLen{info.From, info.To, count})
	}
}
func (c SvrFile) logReadIndex(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		c.sendBack(w, -1, "method")
		return
	} else {
		var info s_logIndex
		if !c.getBodyData(w, r, &info) {
			c.sendBack(w, -2, "getBodyData")
			return
		}
		fileName := c.logFileName(info.From, info.To, ".msg.db")
		fileName = c.FileServerDir + c.PatternLog + "/" + fileName
		data := c.fileAct.ReadLine(fileName, info.Index)
		c.sendBack(w, 200, data)
	}
}
