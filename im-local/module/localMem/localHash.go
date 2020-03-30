package localMem

import (
	"sync"
)

type LocalHash struct {
	hash          map[interface{}]*HashInfo
	lockHash      sync.Mutex
	PrintHashKeys func(key interface{})
}

func NewLocalHash() *LocalHash {
	ret := new(LocalHash)
	ret.hash = make(map[interface{}]*HashInfo)
	return ret
}

func (c *LocalHash) lockH() {
	c.lockHash.Lock()
}
func (c *LocalHash) unlockH() {
	c.lockHash.Unlock()
}

//查找key
func (c *LocalHash) Hfind(section string) bool {
	c.lockH()
	defer c.unlockH()
	return c.hash[section] != nil
}

//获取field
func (c *LocalHash) Hfield(section interface{}) (res HashInfo) {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		return res
	}
	res = *c.hash[section]
	return res
}

//查找field
func (c *LocalHash) HfindKey(section, key interface{}) bool {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		return false
	}
	return c.hash[section].Find(key)
}

func (c *LocalHash) HKeys(section interface{}) []interface{} {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		return nil
	}
	return c.hash[section].Keys()
}

func (c *LocalHash) HprintKeys(section interface{}) {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] != nil {
		c.hash[section].PrintKeys()
	}
}
func (c *LocalHash) HOneKey(section interface{}) interface{} {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		return nil
	}
	return c.hash[section].RandOneKey()
}

//获取值
func (c *LocalHash) Hget(section, key interface{}) interface{} {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		return nil
	}
	return c.hash[section].Get(key)
}

//写入值
func (c *LocalHash) HmkSection(section interface{}) {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		c.hash[section] = NewHashInfo()
		if c.PrintHashKeys != nil {
			c.hash[section].PrintKey = c.PrintHashKeys
		}
	}
}

//写入值
func (c *LocalHash) Hset(section, key, value interface{}) {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		c.hash[section] = NewHashInfo()
	}
	c.hash[section].Set(key, value)
}

//删除field
func (c *LocalHash) Hdel(section, key interface{}) bool {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		return false
	}
	c.hash[section].Del(key)
	return true
}

//删除section
func (c *LocalHash) Hdrop(section interface{}) bool {
	c.lockH()
	defer c.unlockH()
	if c.hash[section] == nil {
		return false
	}
	delete(c.hash, section)
	return true
}
