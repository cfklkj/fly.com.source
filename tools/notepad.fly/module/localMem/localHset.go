package localMem

import (
	"sync"
)

type HashSet struct {
	set           map[interface{}]*SetInfo
	PrintKeyValue func(k interface{}, v []interface{})
	lockSet       sync.Mutex
}

func NewHashSet() *HashSet {
	ret := new(HashSet)
	ret.set = make(map[interface{}]*SetInfo)
	return ret
}

func (c *HashSet) lockS() {
	c.lockSet.Lock()
}
func (c *HashSet) unlockS() {
	c.lockSet.Unlock()
}

//-----------------------------set
func (c *HashSet) SgetKeyValues() bool {
	c.lockS()
	defer c.unlockS()
	if len(c.set) < 1 {
		return false
	}
	for k, v := range c.set {
		if c.PrintKeyValue != nil {
			c.PrintKeyValue(k, v.Smembers())
		}
	}
	return true
}

//找
func (c *HashSet) Sfind(key interface{}) bool {
	c.lockS()
	defer c.unlockS()
	return c.set[key] != nil
}

//成员
func (c *HashSet) Sismember(key, value interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return false
	}
	return c.set[key].Find(value)
}

//获取所有
func (c *HashSet) Smembers(key interface{}) []interface{} {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return nil
	}
	return c.set[key].Smembers()
}

//添加
func (c *HashSet) Sadd(key interface{}, value interface{}) {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		c.set[key] = NewSetInfo()
	}
	c.set[key].Add(value)
}

//删除
func (c *HashSet) Sdel(key, value interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return false
	}
	return c.set[key].Del(value)
}

//
func (c *HashSet) Sdrop(key interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] != nil {
		return false
	}
	delete(c.set, key)
	return true
}
