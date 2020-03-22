package etcd

import (
	"context"
	"errors"
	"fmt"

	"go.etcd.io/etcd/clientv3"
)

func (c *etcd) Unlease(node string) error {
	exitChannel := c.db.Get("l" + node)
	if exitChannel != nil {
		exitChannel.(chan bool) <- true
		c.db.Del(node)
		return nil
	}
	return errors.New("no find node")
}

func (c *etcd) Lease(node, url string) error {
	if c.client == nil {
		return errors.New("please first to link")
	}
	cont := context.TODO()
	//建立租约
	leaseResp, err := c.client.Grant(cont, 3)
	if err != nil {
		return err
	}
	_, err = c.client.Put(cont, node, url, clientv3.WithLease(leaseResp.ID))
	if err != nil {
		return err
	}
	if keepAliveChan, err := c.client.KeepAlive(cont, leaseResp.ID); err != nil { //有协程来帮自动续租，每秒一次。
		return err
	} else {
		exitChannel := make(chan bool)
		c.db.Set("l"+node, exitChannel)
		for {
			select {
			case <-exitChannel: //解约
				c.client.Revoke(cont, leaseResp.ID)
				fmt.Println("解约")
				goto END
			case resp := <-keepAliveChan:
				if resp == nil {
					//fmt.Println("续租失败")
					goto END
				} else {
					//fmt.Println("续租成功" + node)
				}
			}
		}
	END:
	}
	return errors.New("listen out")
}
