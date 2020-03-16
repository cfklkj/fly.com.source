package etcd

import (
	"context"
	"errors"
	"fmt"

	"go.etcd.io/etcd/clientv3"
	"go.etcd.io/etcd/mvcc/mvccpb"
)

func (c *etcd) Unwatch(node string) error {
	exitChannel := c.db.Get("w" + node)
	if exitChannel != nil {
		exitChannel.(chan bool) <- true
		c.db.Del(node)
		return nil
	}
	return errors.New("no find node")
}

func (c *etcd) Watch(node string, callback WatchBack) error {
	// 启动监听
	watchRespChan := c.client.Watch(context.Background(), node, clientv3.WithPrefix())
	exitChannel := make(chan bool)
	c.db.Set("w"+node, exitChannel)
	// 处理kv变化事件
	for {
		select {
		case <-exitChannel:
			//fmt.Println("exit")
			goto END
		case <-c.client.Ctx().Done():
			goto END
		case watchResp := <-watchRespChan:
			for _, event := range watchResp.Events {
				switch event.Type {
				case mvccpb.PUT:
					if callback != nil {
						callback(WatchAct_set, string(event.Kv.Key), string(event.Kv.Value))
					}
					//fmt.Println("修改为", string(event.Kv.Value))
				case mvccpb.DELETE:
					if callback != nil {
						callback(WatchAct_del, string(event.Kv.Key), string(event.Kv.Key))
					}
					//fmt.Println("删除了", string(event.Kv.Key))
				}
			}
		}
	}
END:
	return nil
}

func (c *etcd) WatchRev(node string, callback WatchBack) error {
	// 创建一个监听器
	watcher := clientv3.NewWatcher(c.client)

	// 启动监听
	ctx, cancelFunc := context.WithCancel(context.TODO())
	defer cancelFunc()
	var watchStartRevision int64
	watchRespChan := watcher.Watch(ctx, node, clientv3.WithRev(watchStartRevision))
	exitChannel := make(chan bool)
	c.db.Set("w"+node, exitChannel)
	// 处理kv变化事件
	for {
		select {
		case <-exitChannel:
			fmt.Println("exit")
			goto END
		case <-c.client.Ctx().Done():
			goto END
		case watchResp := <-watchRespChan:
			for _, event := range watchResp.Events {
				switch event.Type {
				case mvccpb.PUT:
					if callback != nil {
						callback(WatchAct_set, node, string(event.Kv.Value))
					}
					//fmt.Println("修改为", string(event.Kv.Value))
				case mvccpb.DELETE:
					if callback != nil {
						callback(WatchAct_del, node, string(event.Kv.Key))
					}
					//fmt.Println("删除了", string(event.Kv.Key))
				}
			}
		}
	}
END:
	return nil
}
