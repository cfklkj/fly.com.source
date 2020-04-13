package localMem

//--https://blog.csdn.net/yzf279533105/article/details/94010954

//----------------------------hash--------------------
type HashInfo struct { //map[interface{}]interface{}
	data map[interface{}]interface{}
}

func (c *HashInfo) SetData(data map[interface{}]interface{}) {
	c.data = data
}

func (c *HashInfo) Hwnd() map[interface{}]interface{} {
	return c.data
}

func (c *HashInfo) Set(file, value interface{}) {
	c.data[file] = value
}
func (c *HashInfo) Del(file interface{}) {
	delete(c.data, file)
}
func (c *HashInfo) Find(file interface{}) bool {
	_, ok := c.data[file]
	return ok
}
func (c *HashInfo) Get(file interface{}) interface{} {
	return c.data[file]
}
func (c *HashInfo) GetValues() interface{} {
	return c.data
}
func (c *HashInfo) Keys() []interface{} {
	var keys []interface{}
	for name, _ := range c.data {
		keys = append(keys, name)
	}
	return keys
}

func NewHashInfo() *HashInfo {
	ret := new(HashInfo)
	ret.data = make(map[interface{}]interface{})
	return ret
}
