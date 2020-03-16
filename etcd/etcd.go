package etcd

import (
	"time"

	"fly.com.sub/mem"
	"go.etcd.io/etcd/clientv3"
)

/*
interface for etcd action
*/
const (
	WatchAct_set = 1
	WatchAct_del = 0
)

type WatchBack func(act int, node, value string)
type Conn interface {
	Set(key, value string) error
	Del(key string) error
	Get(key string) (res map[string]string, err error)
	Lease(node, url string) error
	Unlease(node string) error
	Watch(node string, callback WatchBack) error
	Unwatch(node string) error
}

/*
实现
*/
type etcd struct {
	client *clientv3.Client
	db     mem.MEM
}

func Connect(addr []string) (Conn, error) {
	//配置客户端
	config := clientv3.Config{
		Endpoints:   addr,
		DialTimeout: 5 * time.Second,
	}
	//建立连接
	client, err := clientv3.New(config)
	if err != nil {
		return nil, err
	}
	return &etcd{client, mem.NewMem()}, nil
}
