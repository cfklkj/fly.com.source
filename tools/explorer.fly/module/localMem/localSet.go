package localMem

//------------------------------set-------------------
type SetInfo struct {
	data []interface{}
}

func NewSetInfo() *SetInfo {
	ret := new(SetInfo)
	return ret
}

func (c *SetInfo) Add(value interface{}) {
	c.data = append(c.data, value)
}

func (c *SetInfo) Find(value interface{}) bool {
	temp := c.data
	for _, data := range temp {
		if data == value {
			return true
		}
	}
	return false
}
func (c *SetInfo) Del(value interface{}) bool {
	for index, data := range c.data {
		if data == value {
			c.data = append(c.data[:index], c.data[index+1:]...)
			return true
		}
	}
	return false
}
func (c *SetInfo) Smembers() []interface{} {
	return c.data
}
