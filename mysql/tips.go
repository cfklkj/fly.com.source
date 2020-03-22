package mysql

import (
	"errors"
	"fmt"
)

func (c *mysql) AddSingleTip(from, to string) error {
	return c.exec("call addTipMsg(?,?)", from, to)
}
func (c *mysql) DelSingleTips(to string) error {
	return c.exec("call delMsgTips(?)", to)
}

func (c *mysql) AddMucTip(group, to string) error {
	return c.exec("call addTipMucMsg(?,?)", group, to)
}
func (c *mysql) DelMucTips(to string) error {
	return c.exec("call delMucMsgTips(?)", to)
}

type PrintTips func(from, to string, len int)

func (c *mysql) GetSingleTips(to string, callback PrintTips) error {
	//查询数据，指定字段名，返回sql.Rows结果集
	rows, err := c.db.Query("call getMsgTips(?)", to)
	if err != nil {
		return err
	}
	if rows == nil {
		return errors.New("no rows")
	}
	defer rows.Close()
	user := ""
	len := 0
	for rows.Next() {
		rows.Scan(&user, &len)
		fmt.Println("ddds", user, len)
		callback(user, to, len)
	}
	return nil
}

func (c *mysql) GetMucTips(to string, callback PrintTips) error {
	//查询数据，指定字段名，返回sql.Rows结果集
	rows, err := c.db.Query("call getMucMsgTips(?)", to)
	if err != nil {
		return err
	}
	if rows == nil {
		return errors.New("no rows")
	}
	defer rows.Close()
	group := ""
	len := 0
	for rows.Next() {
		rows.Scan(&group, &len)
		callback(group, to, len)
	}
	return nil
}
