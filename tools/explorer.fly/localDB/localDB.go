package localDB

import (
	files "../module/file"
	conf "../module/util/config"
)

type LocalDB struct {
	configAct *conf.Config
	fileAct   *files.Files
	KeyValue  map[string]interface{} `json:"data"`
}

func NewLocalDB() *LocalDB {
	ret := new(LocalDB)
	ret.configAct = conf.NewConfig()
	ret.fileAct = files.NewFiles()
	ret.KeyValue = make(map[string]interface{}) //make(
	ret.LoadUserDB()
	return ret
}

func (c *LocalDB) LoadUserDB() {
	path := c.addUserDir()
	path += "/json.data"
	c.configAct.SetConfigPath(path)
	c.loadKeyValue()
}

func (c *LocalDB) addUserDir() string {
	path := c.GetWorkPath() + "/config"
	c.fileAct.Mkdir(path)
	return path
}

func (c *LocalDB) GetWorkPath() string {
	return "./explorer.fly"
}
