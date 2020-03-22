package rpc

import (
	"fmt"
	"net"
	"net/rpc"
)

func Listen(addr string, rcvr interface{}) error {
	err := rpc.Register(rcvr) //注册函数
	if err != nil {
		return err
	}
	tcpAddr, err := net.ResolveTCPAddr("tcp", addr)
	if err != nil {
		return err
	}
	listener, err := net.ListenTCP("tcp", tcpAddr)
	if err != nil {
		return err
	}
	defer listener.Close()
	for {
		conn, err := listener.Accept()
		if err != nil {
			return err
		}
		fmt.Println("link--")
		go rpc.ServeConn(conn) //每当检测到请求时，启动一个goroutine去处理该连接
	}
}
