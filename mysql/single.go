package mysql

import (
	"errors"
)

//用户
type PrintUsers func(id int, userid string)

func (c *mysql) GetUsers(callback PrintUsers) error {
	//查询数据，指定字段名，返回sql.Rows结果集
	rows, err := c.db.Query("call getUsers()")
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

func (c *mysql) AddUser(userid string) error {
	//查询数据，指定字段名，返回sql.Rows结果集
	rows, err := c.db.Query("call addUser(?)", userid)
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
		return errors.New("add user failed")
	}
	return nil
}

func (c *mysql) AddSingleMsg(from, to, msg string) error {
	return c.exec("call addSingleMsg(?,?, ?)", from, to, msg)
}

func (c *mysql) GetSingleMsgLength(from, to string) (int, error) {
	rows, err := c.db.Query("call getSingleMsgLength(?, ?)", from, to)
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

func (c *mysql) GetSingleMsgDetail(from, to string, index int) (string, string, string, error) {
	rows, err := c.db.Query("call getSingleMsgDetail(?, ?, ?)", from, to, index)
	if err != nil {
		return "", "", "", err
	}
	if rows == nil {
		return "", "", "", errors.New("no rows")
	}
	defer rows.Close()
	msg := ""
	for rows.Next() {
		rows.Scan(&from, &to, &msg)
	}
	return from, to, msg, nil
}
