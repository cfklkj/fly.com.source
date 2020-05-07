package rpc

import (
	"errors"
	"net"
	"net/rpc"
	"time"

	Mem "fly.com.sub/mem"
)

type Conn interface {
	FindCon(url string) bool
	AddCon(url string) error
	DelCon(url string)
	SendRequest(url, serviceMethod string, args interface{}, reply interface{}) error
}

type client struct {
	mem Mem.MEM
}

func RPC() Conn {
	return &client{Mem.NewMem()}
}
func (c *client) FindCon(url string) bool {
	return c.mem.Find(url)
}
func (c *client) DelCon(url string) {
	c.mem.Del(url)
}
func (c *client) checkCon(url string) error {
	timeout := time.Second * 3
	conn, err := net.DialTimeout("tcp", url, timeout)
	if err != nil {
		return err
	}
	defer conn.Close()
	return nil
}
func (c *client) AddCon(url string) error {
	if err := c.checkCon(url); err != nil {
		return err
	}
	conn, err := rpc.Dial("tcp", url)
	if err != nil {
		return err
	}
	c.mem.Set(url, conn)
	return nil
}

//发送请求
func (c *client) SendRequest(url, serviceMethod string, args interface{}, reply interface{}) error {
	if reply == nil {
		return errors.New("replay is nil")
	}
	con := c.mem.Get(url)
	if con == nil {
		return errors.New("requere con is nil -- " + serviceMethod)
	}
	conn := con.(*rpc.Client)
	//同步发送
	return conn.Call(serviceMethod, args, reply)
}
