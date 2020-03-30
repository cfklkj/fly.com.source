package db

import "../../../module/localMem"

const (
	CONINFO = 1
)

type Login struct {
	con_user *localMem.LocalHash
}

func NewLogin() *Login {
	ret := new(Login)
	ret.con_user = localMem.NewLocalHash()
	return ret
}

func (c *Login) SetCon(name string, con interface{}) {
	c.con_user.Hset(CONINFO, con, name)
	c.con_user.Hset(CONINFO, name, con)
}
func (c *Login) GetUsername(con interface{}) interface{} {
	return c.con_user.Hget(CONINFO, con)
}
func (c *Login) GetCon(username interface{}) interface{} {
	return c.con_user.Hget(CONINFO, username)
}
func (c *Login) FindCon(username interface{}) bool {
	return c.con_user.HfindKey(CONINFO, username)
}
func (c *Login) DelCon(con interface{}) {
	name := c.GetUsername(con)
	c.con_user.Hdel(CONINFO, name)
	c.con_user.Hdel(CONINFO, con)
}

func (c *Login) GetUsers() map[interface{}]interface{} {
	users := c.con_user.Hfield(CONINFO)
	return users.Hwnd()
}
