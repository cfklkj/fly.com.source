package client_tcp

import (
	"encoding/json"
	"fmt"
	"net"
	"time"

	"../../module/tcp"
	"golang.org/x/net/websocket"
)

type CltTcp struct {
	con     net.Conn
	tcp     tcp.Tcp
	user    string
	Println func(con net.Conn, msg []byte)
}

func NewCltTcp() *CltTcp {
	ret := new(CltTcp)
	return ret
}

func (c *CltTcp) Heart() {
	var info MsgInfo
	info.From = c.user
	info.To = c.user
	info.Data = "heart"
	data, _ := json.Marshal(info)
	ticker := time.NewTicker(time.Duration(4500) * time.Second) // 每隔1s进行一次打印
	for {
		<-ticker.C
		c.con.Write(data)
	}
}

//"localhost:9090"
func (c *CltTcp) connectTcp(addr string) error {
	conn, err := net.Dial("tcp", addr) //"tcp"
	if err != nil {
		return err
	}
	c.con = conn
	return nil
}
func (c *CltTcp) connect(addr string) error {
	var wsurl = "ws://" + addr + "/wss"
	var origin = "http://" + addr + "/"
	ws, err := websocket.Dial(wsurl, "", origin)
	if err != nil {
		return err
	}
	c.con = ws
	return nil
}

func (c *CltTcp) Send(msg []byte) bool {
	return c.tcp.SendMsg(c.con, msg)
}

func (c *CltTcp) Login(addr, user, pwd string) bool {
	if err := c.connect(addr); err != nil {
		fmt.Println(err)
		return false
	}
	c.user = user
	go c.Heart()
	var info loginInfo
	info.Login = user
	info.Passwd = pwd
	data, _ := json.Marshal(info)
	c.con.Write(data)
	rst := c.tcp.WaitMsg(c.con, c.waitMsg)
	fmt.Println("end--:", rst)
	return false
}

func (c *CltTcp) waitMsg(con net.Conn, msg []byte) {
	if c.Println != nil {
		c.Println(con, msg)
	} else {
		fmt.Println(string(msg))
	}
}
