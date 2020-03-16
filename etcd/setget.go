package etcd

import (
	"context"
	"fmt"

	"go.etcd.io/etcd/clientv3"
)

func (c *etcd) Set(key, value string) error {
	_, err := c.client.Put(context.TODO(), key, value)
	return err
}

func (c *etcd) Del(key string) error {
	_, err := c.client.Delete(context.TODO(), key, clientv3.WithPrevKV())
	return err
}

func (c *etcd) Get(key string) (res map[string]string, err error) {
	getResp, err := c.client.Get(context.TODO(), key, clientv3.WithPrefix())
	if err != nil {
		return res, err
	} else {
		fmt.Println("getResp.Kvs", key, getResp.Kvs)
		res = make(map[string]string)
		for _, data := range getResp.Kvs {
			res[string(data.Key)] = string(data.Value)

		}
		return res, nil
	}
}
