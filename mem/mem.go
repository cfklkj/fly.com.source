package mem

import "sync"

type Check func(k, v interface{}) bool

type MEM interface {
	Set(key, value interface{})
	Find(key interface{}) bool
	Del(key interface{})
	Get(key interface{}) interface{}
	GetAll() map[interface{}]interface{}
	Rand(check Check) (interface{}, interface{})
	Lock()
	Unlock()
}

type mem struct {
	data map[interface{}]interface{}
	lock sync.Mutex
	lk   sync.Mutex
}

func NewMem() MEM {
	return &mem{make(map[interface{}]interface{}), sync.Mutex{}, sync.Mutex{}}
}

func (c *mem) Lock() {
	c.lock.Lock()
}
func (c *mem) Unlock() {
	defer c.lock.Unlock()
}

func (c *mem) Rand(check Check) (interface{}, interface{}) {
	c.lk.Lock()
	defer c.lk.Unlock()
	for k, v := range c.data {
		if check != nil && !check(k, v) {
			continue
		}
		return k, v
	}
	return nil, nil
}

func (c *mem) Set(key, value interface{}) {
	c.lk.Lock()
	defer c.lk.Unlock()
	c.data[key] = value
}
func (c *mem) Del(key interface{}) {
	c.lk.Lock()
	defer c.lk.Unlock()
	delete(c.data, key)
}

func (c *mem) Find(key interface{}) bool {
	c.lk.Lock()
	defer c.lk.Unlock()
	_, ok := c.data[key]
	return ok
}

func (c *mem) Get(key interface{}) interface{} {
	c.lk.Lock()
	defer c.lk.Unlock()
	return c.data[key]
}
func (c *mem) GetAll() map[interface{}]interface{} {
	c.lk.Lock()
	defer c.lk.Unlock()
	return c.data
}
