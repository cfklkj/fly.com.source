package server

import (
	"net"
	"net/http"

	"golang.org/x/net/websocket"
)

type Server interface {
	Listen(addr string, callback Message) error
	ListenWebSocket(conn *websocket.Conn, callback Message)
	SetHdTime(con net.Conn, second int) error
	Send(con net.Conn, msg []byte) error
}

type listen struct {
}

func Get() {

}

type Message func(con net.Conn, msg []byte, errs ListenError)

//tcp
func Listen(addr string, callback Message) error {
	//1.监听端口
	server, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	defer server.Close()
	for {
		con, err := server.Accept()
		if err != nil {
			return err
		}
		go waitMsg(con, callback)
	}
}

//websocet
func ListenWebSocket(pattern, addr string, callback Message) error {
	var handle web
	handle.Message = callback
	http.Handle(pattern, websocket.Handler(handle.accept))
	return http.ListenAndServe(addr, nil)
}

type web struct {
	Message func(con net.Conn, msg []byte, errs ListenError)
}

func (c *web) accept(con *websocket.Conn) {
	waitMsg(con, c.Message)
}
