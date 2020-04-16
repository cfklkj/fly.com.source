package localMem

import (
	"sync"
)

type LocalMem struct {
	hash     map[interface{}]*HashInfo
	set      map[interface{}]*SetInfo
	lockHash sync.Mutex
	lockSet  sync.Mutex
}

func NewLocalMem() *LocalMem {
	ret := new(LocalMem)
	ret.hash = make(map[interface{}]*HashInfo)
	ret.set = make(map[interface{}]*SetInfo)
	return ret
}

func (c *LocalMem) lockH() {
	c.lockHash.Lock()
}
func (c *LocalMem) unlockH() {
	c.lockHash.Unlock()
}
func (c *LocalMem) lockS() {
	c.lockSet.Lock()
}
func (c *LocalMem) unlockS() {
	c.lockSet.Unlock()
}

//查找key
func (c *LocalMem) Hfind(key string) bool {
	c.lockH()
	defer c.unlockH()
	return c.hash[key] != nil
}

//获取field
func (c *LocalMem) Hfield(key interface{}) (res HashInfo) {
	c.lockH()
	defer c.unlockH()
	if c.hash[key] == nil {
		return res
	}
	res = *c.hash[key]
	return res
}

//查找field
func (c *LocalMem) HfindField(key, field interface{}) bool {
	c.lockH()
	defer c.unlockH()
	if c.hash[key] == nil {
		return false
	}
	return c.hash[key].Find(field)
}

//获取值
func (c *LocalMem) Hget(key, field interface{}) interface{} {
	c.lockH()
	defer c.unlockH()
	if c.hash[key] == nil {
		return nil
	}
	return c.hash[key].Get(field)
}

//写入值
func (c *LocalMem) HmkKey(key interface{}) {
	c.lockH()
	defer c.unlockH()
	if c.hash[key] == nil {
		c.hash[key] = NewHashInfo()
	}
}

//写入值
func (c *LocalMem) Hset(key, field, value interface{}) {
	c.lockH()
	defer c.unlockH()
	if c.hash[key] == nil {
		c.hash[key] = NewHashInfo()
	}
	c.hash[key].Set(field, value)
}

//删除field
func (c *LocalMem) Hdel(key, field interface{}) bool {
	c.lockH()
	defer c.unlockH()
	if c.hash[key] == nil {
		return false
	}
	c.hash[key].Del(field)
	return true
}

//删除key
func (c *LocalMem) Hdrop(key interface{}) bool {
	c.lockH()
	defer c.unlockH()
	if c.hash[key] == nil {
		return false
	}
	delete(c.hash, key)
	return true
}

//-----------------------------set
//找
func (c *LocalMem) Sfind(key interface{}) bool {
	c.lockS()
	defer c.unlockS()
	return c.set[key] != nil
}

//成员
func (c *LocalMem) Sismember(key, value interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return false
	}
	return c.set[key].Find(value)
}

//获取所有
func (c *LocalMem) Smembers(key interface{}) []interface{} {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return nil
	}
	return c.set[key].Smembers()
}

//添加
func (c *LocalMem) Sadd(key interface{}, value interface{}) {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		c.set[key] = NewSetInfo()
	}
	c.set[key].Add(value)
}

//删除
func (c *LocalMem) Sdel(key, value interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] == nil {
		return false
	}
	return c.set[key].Del(value)
}

//
func (c *LocalMem) Sdrop(key interface{}) bool {
	c.lockS()
	defer c.unlockS()
	if c.set[key] != nil {
		return false
	}
	delete(c.set, key)
	return true
}
