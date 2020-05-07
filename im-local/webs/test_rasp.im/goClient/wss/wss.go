package wss

import (
	"encoding/json"
	"fmt"
	"net"
	"strings"

	"./ssh"
	"golang.org/x/net/websocket"
)

var tcp Tcp

func MkLoginStr(user, passwd string) []byte {
	var info LoginInfo
	info.Login = user
	data, _ := json.Marshal(info)
	return data
}

func Read(ws *websocket.Conn) {
	if tcp.WaitMsg(ws, expMsg) == TcpWaitRst_null {
		Read(ws)
	}
}
func expMsg(con net.Conn, msg []byte) {
	fmt.Println("msg", string(msg))
	var info MsgInfo
	err := json.Unmarshal(msg, &info)
	if err != nil {
		return
	}
	if info.Data != "" {
		var act ActInfo
		err := json.Unmarshal([]byte(info.Data), &act)
		if err != nil {
			fmt.Println("err", err)
			return
		}
		switch act.Opt {
		case Opt_ssh:
			args := strings.Split(act.Data, " ")
			msg, err := ssh.Cmd(args)
			fmt.Println(msg, err)
		case Opt_shutdown:
			msg, err := ssh.Cmd([]string{"/sbin/shutdown", "-h", "0"})
			fmt.Println(msg, err)
		case Opt_playMusic:
			msg, err := ssh.Cmd([]string{"/usr/bin/omxplayer", "-o", "local", act.Data})
			fmt.Println(msg, err)
		}
	}

}
