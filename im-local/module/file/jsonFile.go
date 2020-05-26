package file

import (
	"encoding/json"
	"fmt"

	conf "../config"
	"../localMem"
)

type KeyValueInfo struct {
	Data map[string]interface{} `json:"data"`
}

func NewKeyValueInfo() *KeyValueInfo {
	ret := new(KeyValueInfo)
	ret.Data = make(map[string]interface{})
	return ret
}

type JsonFile struct {
	configAct *conf.Config
	keyValue  *localMem.HashInfo
}

func (c JsonFile) Init(filePath string) {
	if c.configAct == nil {
		c.configAct = conf.NewConfig()
		c.keyValue = localMem.NewHashInfo()
		fmt.Println("SssS", c.keyValue)
	}
	c.configAct.SetConfigPath(filePath)
	c.loadKeyValue()
}

func (c JsonFile) loadKeyValue() {
	keyValue := []KeyValueInfo{}
	c.configAct.GetConfigInfo("keyValue", &keyValue)
	fmt.Println("keyValue", keyValue)
	for _, v := range keyValue {
		if v.Data["key"] == nil {
			continue
		}
		c.keyValue.Set(v.Data["key"], v.Data["value"])
	}
}
func (c JsonFile) upKeyValue() {
	keyValue := []KeyValueInfo{}
	data := NewKeyValueInfo()
	for k, v := range c.keyValue.Hwnd() {
		data.Data["key"] = k
		data.Data["value"] = v
		keyValue = append(keyValue, *data)
	}
	c.configAct.SetConfigInfo("keyValue", keyValue)
}

func (c JsonFile) SetKeyValue(k, v interface{}) {
	fmt.Println("SS", c.keyValue)
	c.keyValue.Set(k, v)
	c.upKeyValue()
}

func (c JsonFile) GetKeyValue(k interface{}) interface{} {
	return c.keyValue.Get(k)
}

func (c JsonFile) InterfaceToStruct(data interface{}, out interface{}) error {
	rst, _ := json.Marshal(data)
	return json.Unmarshal(rst, out)
}
