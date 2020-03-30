package svr_tcp

import (
	"encoding/json"
	"net"
	"net/http"

	"../../module/tcp"
	"./db"
	"golang.org/x/net/websocket"
)

type SvrTcp struct {
	login *db.Login
	tcp   tcp.Tcp
}

func NewSvrTcp() *SvrTcp {
	ret := new(SvrTcp)
	ret.login = db.NewLogin()
	return ret
}

func (c *SvrTcp) Listen() {
	http.Handle("/wss", websocket.Handler(c.acceptFunc))
}

func (c *SvrTcp) acceptFunc(conn *websocket.Conn) {
	c.tcp.SetHdTime(conn, 5)
	c.tcp.WaitMsg(conn, c.expMsg)
	c.loginOut(conn)
}

func (c *SvrTcp) expMsg(con net.Conn, msg []byte) {
	if v := c.login.GetUsername(con); v != nil {
		c.RouteMsg(con, msg)
	} else {
		if !c.isLogin(con, msg) {
			con.Close()
		} else {
			c.tcp.SetHdTime(con, 50000)
		}
	}
}

func (c *SvrTcp) loginOut(conn net.Conn) {
	if v := c.login.GetUsername(conn); v != nil {
		var info offline
		info.Offline = v.(string)
		bt, _ := json.Marshal(info)
		c.BroadMsg(nil, bt)
		c.login.DelCon(conn)
	}
}

func (c *SvrTcp) isLogin(conn net.Conn, msg []byte) bool {
	var data loginInfo //---login check
	json.Unmarshal(msg, &data)
	if data.Login == "" || c.login.FindCon(data.Login) {
		c.tcp.SendMsg(conn, []byte("err-logined"))
		return false
	}
	var info online
	info.Online = data.Login
	bt, _ := json.Marshal(info)
	c.tcp.SendMsg(conn, bt) //先给登入者发送
	c.BroadMsg(conn, bt)    //后广播
	c.login.SetCon(data.Login, conn)
	return true
}

func (c *SvrTcp) BroadMsg(con net.Conn, msg []byte) {
	for _, k := range c.login.GetUsers() {
		switch k.(type) {
		case net.Conn:
			c.tcp.SendMsg(k.(net.Conn), msg)
		default:
			if con != nil {
				var info online
				info.Online = k.(string)
				bt, _ := json.Marshal(info)
				c.tcp.SendMsg(con, bt)
			}
		}
	}
}
func (c *SvrTcp) RouteMsg(con net.Conn, msg []byte) {
	var info MsgInfo
	json.Unmarshal(msg, &info)
	if c.login.GetCon(info.From) != con {
		c.tcp.SendMsg(con, []byte("err-fmt:"+string(msg)))
		con.Close()
		return
	}
	if v := c.login.GetCon(info.To); v != nil {
		if !c.tcp.SendMsg(v.(net.Conn), msg) {
			c.loginOut(v.(net.Conn))
		}
	}
}
