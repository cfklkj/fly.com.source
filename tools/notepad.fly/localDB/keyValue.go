package localDB

import (
	"encoding/json"
	"fmt"
)

func (c *LocalDB) loadKeyValue() {
	c.configAct.GetConfigInfo("keyValue", &c.KeyValue)
}
func (c *LocalDB) Update() {
	c.configAct.SetConfigInfo("keyValue", c.KeyValue)
}

func (c *LocalDB) SetKeyValue(k string, v interface{}) {
	c.KeyValue[k] = v
	c.Update()
}

//key 最好不用 int  取值时有问题
func (c *LocalDB) GetValue(k string) interface{} {
	return c.KeyValue[k]
}

func (c *LocalDB) Print(data interface{}) {
	bytes, _ := json.Marshal(data)
	fmt.Println("Print", string(bytes))
}
