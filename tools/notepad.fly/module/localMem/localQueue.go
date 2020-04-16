package localMem

import (
	"sync"

	"../queue"
)

//----------------------------------------------
type LocalQueueMgr struct {
	hash     map[interface{}]*HashInfo
	lockHash sync.Mutex
}

func NewLocalQueueMgr() *LocalQueueMgr {
	ret := new(LocalQueueMgr)
	ret.hash = make(map[interface{}]*HashInfo)
	return ret
}

//keys
func (c *LocalQueueMgr) HgetKeys() (keys []interface{}) {
	for name, _ := range c.hash {
		keys = append(keys, name)
	}
	return keys
}

//files
func (c *LocalQueueMgr) HgetFiles(key interface{}) []interface{} {

	if c.hash[key] == nil {
		return nil
	}
	return c.hash[key].Keys()
}
func (c *LocalQueueMgr) addKey(key interface{}) {
	c.lockHash.Lock()
	defer c.lockHash.Unlock()
	if c.hash[key] == nil {
		c.hash[key] = NewHashInfo()
	}
}
func (c *LocalQueueMgr) addField(key interface{}, field interface{}) {
	c.lockHash.Lock()
	defer c.lockHash.Unlock()
	list := c.Hget(key, field)
	if list == nil {
		newList := queue.NewLinkListNode()
		c.hash[key].Set(field, newList)
	}
}

//获取
func (c *LocalQueueMgr) Hget(key, field interface{}) *queue.LinkListNode {
	if c.hash[key] == nil {
		return nil
	}
	value, _ := c.hash[key].Get(field).(*queue.LinkListNode)
	return value
}

//更新
func (c *LocalQueueMgr) Hset(key, field, value interface{}) {
	if c.hash[key] == nil {
		c.addKey(key)
		c.addField(key, field)
	}
	list := c.Hget(key, field)
	if list == nil {
		c.addField(key, field)
		list = c.Hget(key, field)
	}
	list.Enque(value)
}

//删除
func (c *LocalQueueMgr) Hdel(key string, field interface{}) {
	if c.hash[key] == nil {
		return
	}
	c.lockHash.Lock()
	defer c.lockHash.Unlock()
	c.hash[key].Del(field)
}
