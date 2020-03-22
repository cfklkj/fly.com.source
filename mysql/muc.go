package mysql

import (
	"errors"
)

type PrintMembers func(id int, userid string)

func (c *mysql) GetMembers(group string, callback PrintMembers) error {
	//查询数据，指定字段名，返回sql.Rows结果集
	rows, err := c.db.Query("call getMembers(?)", group)
	if err != nil {
		return err
	}
	if rows == nil {
		return errors.New("no rows")
	}
	defer rows.Close()
	id := 0
	user := ""
	for rows.Next() {
		rows.Scan(&id, &user)
		callback(id, user)
	}
	return nil
}

func (c *mysql) AddGroup(group string) error {
	//查询数据，指定字段名，返回sql.Rows结果集
	rows, err := c.db.Query("call addGroup(?)", group)
	if err != nil {
		return err
	}
	if rows == nil {
		return errors.New("no rows")
	}
	defer rows.Close()
	id := 0
	for rows.Next() {
		rows.Scan(&id)
	}
	if id < 1 {
		return errors.New("add group failed")
	}
	return nil
}

func (c *mysql) DelGroup(group string) error {
	return c.exec("call delGroup(?)", group)
}

func (c *mysql) AddGroupMember(group, user string) error {
	return c.exec("call addGroupMember(?,?)", group, user)
}
func (c *mysql) DelGroupMember(group, user string) error {
	return c.exec("call delGroupMember(?,?)", group, user)
}
func (c *mysql) AddGroupMsg(from, group, msg string) error {
	return c.exec("call addGroupMsg(?,?, ?)", from, group, msg)
}
func (c *mysql) AddBigGroupLog(from, group, msg string) error {
	return c.exec("call addBigGroupLog(?,?, ?)", from, group, msg)
}

func (c *mysql) GetGroupMsgLength(group string) (int, error) {
	rows, err := c.db.Query("call getGroupMsgLength(?)", group)
	if err != nil {
		return 0, err
	}
	if rows == nil {
		return 0, errors.New("no rows")
	}
	defer rows.Close()
	id := 0
	for rows.Next() {
		rows.Scan(&id)
	}
	return id, nil
}

func (c *mysql) GetGroupMsgDetail(group string, index int) (string, string, string, error) {
	rows, err := c.db.Query("call getGroupMsgDetail(?, ?)", group, index)
	if err != nil {
		return "", "", "", err
	}
	if rows == nil {
		return "", "", "", errors.New("no rows")
	}
	defer rows.Close()
	from := ""
	msg := ""
	for rows.Next() {
		rows.Scan(&from, &group, &msg)
	}
	return from, group, msg, nil
}
