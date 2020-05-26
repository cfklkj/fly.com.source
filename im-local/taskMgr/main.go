package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"os"
	"strconv"
	"strings"

	cltTcp "../client_module/client_tcp"
	tls "../module/zlib"
	"./db"
	"./task"
)

const (
	Cmd_add  = "add"
	Cmd_list = "ls"
	Cmd_del  = "del"
	Cmd_alt  = "alt"
)

var tasks *task.Task

func main() {
	if len(os.Args) < 2 {
		fmt.Println("eg: :802 adminTips")
		return
	}
	clttcp := cltTcp.NewCltTcp()
	clttcp.Println = expMsg
	tasks = task.NewTask()
	addr := os.Args[1]
	user := os.Args[2] //adminTips
	fmt.Println(addr, user)
	clttcp.Login(addr, user, "")
}
func expMsg(con net.Conn, msg []byte) {
	var data cltTcp.MsgInfo
	json.Unmarshal(msg, &data)
	if data.Data != "" {
		rst := routeMsg(data.From, data.To, data.Data)
		if rst != nil {
			con.Write(rst)
		}
	}
}

func routeMsg(from, to, data string) []byte {
	var info cltTcp.DataInfo
	de := tls.Jsunzip(data)
	if de != "" {
		json.Unmarshal([]byte(de), &info)
		if info.Type == "chat" {
			args := strings.Split(info.Content, " ")
			cmds := strings.Split(info.Content, "\"")
			dbs := db.NewDB()
			switch args[0] {
			case Cmd_add:
				rate, _ := strconv.Atoi(args[3])
				tm := args[2]
				if dbs.AddTask(from, args[1], tm, rate, cmds[1]) {
					info.Content = dbs.ListTask(from)
					tasks.AddTick(tm)
				}
				return mkBackStr(from, to, info)
			case Cmd_list:
				info.Content = dbs.ListTask(from)
				return mkBackStr(from, to, info)
			case Cmd_del:
				dbs.DelTask(from, args[1])
				info.Content = dbs.ListTask(from)
				return mkBackStr(from, to, info)
			case Cmd_alt:
				dbs.DelTask(from, args[1])
				rate, _ := strconv.Atoi(args[3])
				tm := args[2]
				if dbs.AddTask(from, args[1], tm, rate, cmds[1]) {
					info.Content = dbs.ListTask(from)
					tasks.AddTick(tm)
				}
				return mkBackStr(from, to, info)
			default:
				info.Content = help()
				return mkBackStr(from, to, info)
			}
		}
	}
	return nil
}

func help() string {
	rst, _ := ioutil.ReadFile("./help.md")
	return string(rst)
}

func mkBackStr(from, to string, info cltTcp.DataInfo) []byte {
	var data cltTcp.MsgInfo
	data.To = from
	data.From = to
	tmps, _ := json.Marshal(info)
	data.Data = tls.Jszip(string(tmps))
	datas, _ := json.Marshal(data)
	return datas
}
