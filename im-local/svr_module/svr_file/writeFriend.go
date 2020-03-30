package svr_file

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (c SvrFile) friendWrite(w http.ResponseWriter, r *http.Request) {
	fmt.Println("log")
	if r.Method == "GET" {
		c.sendBack(w, -1, "method")
		return
	} else {
		var info s_friend
		if !c.getBodyData(w, r, &info) {
			return
		}
		fileName := c.logFileName(info.User, "", ".group.db")
		c.jsonFile.Init(fileName)
		var friendsInfo s_friendsInfo
		c.jsonFile.InterfaceToStruct(c.jsonFile.GetKeyValue(info.Group), &friendsInfo)
		friendsInfo.List = append(friendsInfo.List, info.Friend)
		c.jsonFile.SetKeyValue(info.Group, friendsInfo)
		rst, _ := json.Marshal(friendsInfo)
		c.sendBack(w, 200, string(rst))
	}
}

func (c SvrFile) friendRead(w http.ResponseWriter, r *http.Request) {
	fmt.Println("log")
	if r.Method == "GET" {
		c.sendBack(w, -1, "method")
		return
	} else {
		var info s_friends
		if !c.getBodyData(w, r, &info) {
			return
		}
		fileName := c.logFileName(info.User, "", ".group.db")
		c.jsonFile.Init(fileName)
		var friendsInfo s_friendsInfo
		c.jsonFile.InterfaceToStruct(c.jsonFile.GetKeyValue(info.Group), &friendsInfo)
		rst, _ := json.Marshal(friendsInfo)
		c.sendBack(w, 200, string(rst))
	}
}
