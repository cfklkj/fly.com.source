package localMem

import (
	"sync"
)

type LocalSet struct {
	set     map[interface{}]*SetInfo
	lockSet sync.Mutex
}

func NewLocalSet() *LocalSet {
	ret := new(LocalSet)
	ret.set = make(map[interface{}]*SetInfo)
	return ret
}

func (c *LocalSet) lockS() {
	c.lockSet.Lock()
}
func (c *LocalSet) unlockS() {
	c.lockSet.Unlock()
}

//找
func (c *LocalSet) Sfind(key interface{}) bool {
	c.lockS()
	defer c.unlockS()
	return c.set[key] != nil
}

//成员
func (c *LocalSet) Sismember(key, value interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return false
	}
	return c.set[key].Find(value)
}

//获取所有
func (c *LocalSet) Smembers(key interface{}) []interface{} {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return nil
	}
	return c.set[key].Smembers()
}

//添加
func (c *LocalSet) Sadd(key interface{}, value interface{}) {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		c.set[key] = NewSetInfo()
	}
	c.set[key].Add(value)
}

//删除
func (c *LocalSet) Sdel(key, value interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return false
	}
	return c.set[key].Del(value)
}

//
func (c *LocalSet) Sdrop(key interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] != nil {
		return false
	}
	delete(c.set, key)
	return true
}
