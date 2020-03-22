package main

//https://www.mogublog.net/post/2014.html
import (
	"fmt"
	"io"
	"net"
)

type route struct {
	in  string //":8080"
	out string //":802"
}

func (c route) Listen() {
	server, err := net.Listen("tcp", c.out)
	if err != nil {
		fmt.Println("err-Listen", err)
		return
	}
	fmt.Println("转发", c.in, " to ", c.out)
	for {
		client, err := server.Accept()
		if err == nil {
			go c.handleClientRequest(client)
		}
	}
}

func (c route) handleClientRequest(client net.Conn) {
	defer client.Close()

	remote, err := net.Dial("tcp", c.in)
	if err != nil {
		fmt.Println("err-handleClientRequest", err)
		return
	}
	defer remote.Close()

	go io.Copy(remote, client)
	io.Copy(client, remote)
}

func main() {
	fmt.Println("please input localPort(:port):")
	rt := route{}
	fmt.Scanln(&rt.in)
	fmt.Println("please input natPort(:port):")
	fmt.Scanln(&rt.out)
	rt.Listen()
}
