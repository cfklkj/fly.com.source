package localMem

import (
	"sync"
)

type LocalIndex struct {
	index         map[interface{}]interface{}
	lockIndex     sync.Mutex
	PrintHashKeys func(key interface{})
}

func NewLocalIndex() *LocalIndex {
	ret := new(LocalIndex)
	ret.index = make(map[interface{}]interface{})
	return ret
}

func (c *LocalIndex) lockI() {
	c.lockIndex.Lock()
}
func (c *LocalIndex) unlockI() {
	c.lockIndex.Unlock()
}

//查找key
func (c *LocalIndex) Ifind(key interface{}) bool {
	c.lockI()
	defer c.unlockI()
	_, ok := c.index[key]
	return ok
}

//获取value
func (c *LocalIndex) Iget(key interface{}) interface{} {
	c.lockI()
	defer c.unlockI()
	return c.index[key]
}

//设置
func (c *LocalIndex) Iset(key, value interface{}) {
	c.lockI()
	defer c.unlockI()
	c.index[key] = value
}

//删除
func (c *LocalIndex) Idel(key interface{}) {
	c.lockI()
	defer c.unlockI()
	delete(c.index, key)
}
