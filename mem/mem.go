package mem

import "sync"

type Check func(k, v interface{}) bool

type MEM interface {
	Set(key, value interface{})
	Find(key interface{}) bool
	Del(key interface{})
	Get(key interface{}) interface{}
	Rand(check Check) (interface{}, interface{})
	Lock()
	Unlock()
}

type mem struct {
	data map[interface{}]interface{}
	lock sync.Mutex
}

func NewMem() MEM {
	return &mem{make(map[interface{}]interface{}), sync.Mutex{}}
}

func (c *mem) Lock() {
	c.lock.Lock()
}
func (c *mem) Unlock() {
	defer c.lock.Unlock()
}

func (c *mem) Rand(check Check) (interface{}, interface{}) {
	for k, v := range c.data {
		if check != nil && !check(k, v) {
			continue
		}
		return k, v
	}
	return nil, nil
}

func (c *mem) Set(key, value interface{}) {
	c.data[key] = value
}
func (c *mem) Del(key interface{}) {
	delete(c.data, key)
}

func (c *mem) Find(key interface{}) bool {
	_, ok := c.data[key]
	return ok
}

func (c *mem) Get(key interface{}) interface{} {
	return c.data[key]
}
