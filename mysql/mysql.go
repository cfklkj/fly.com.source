package mysql

import (
	"database/sql"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type Conn interface {
	GetUsers(callback PrintUsers) error
	AddUser(userid string) error
	AddSingleMsg(from, to, msg string) error
	GetSingleMsgLength(from, to string) (int, error)
	GetSingleMsgDetail(from, to string, index int) (string, string, string, error)
	//--消息提示
	AddSingleTip(from, to string) error
	DelSingleTips(to string) error
	GetSingleTips(to string, callback PrintTips) error

	AddGroup(group string) error
	DelGroup(group string) error
	GetMembers(group string, callback PrintMembers) error
	AddGroupMember(group, user string) error
	DelGroupMember(group, user string) error
	AddGroupMsg(from, group, msg string) error
	GetGroupMsgLength(group string) (int, error)
	GetGroupMsgDetail(group string, index int) (string, string, string, error)
	//--消息提示
	AddMucTip(from, to string) error
	DelMucTips(to string) error
	GetMucTips(to string, callback PrintTips) error

	AddBigGroupLog(from, group, msg string) error

	Listen() error
}

type mysql struct {
	db   *sql.DB
	tx   *sql.Tx
	lock sync.Mutex
}

func Connect(addr string) (Conn, error) {
	con, err := sql.Open("mysql", addr)
	return &mysql{con, nil, sync.Mutex{}}, err
}

func (c *mysql) Listen() error {
	c.db.SetMaxOpenConns(512)
	c.db.SetMaxIdleConns(4096)
	err := c.db.Ping()
	if err != nil {
		return err
	}
	tick := time.NewTicker(60 * time.Second) //定时器
	defer tick.Stop()
	tickCommit := time.NewTicker(1 * time.Second) //定时器
	defer tickCommit.Stop()
	for {
		select {
		case <-tick.C:
			err := c.db.Ping()
			if err != nil {
				return err
			}
		case <-tickCommit.C:
			err := c.commit()
			if err != nil {
				return err
			}
		}
	}
}
func (c *mysql) exec(query string, args ...interface{}) error {
	c.lock.Lock()
	defer c.lock.Unlock()
	if c.tx == nil {
		tx, err := c.db.Begin()
		if err != nil {
			return err
		}
		c.tx = tx
	}
	_, err := c.tx.Exec(query, args...)
	return err
}

func (c *mysql) commit() error {
	c.lock.Lock()
	defer c.lock.Unlock()
	if c.tx != nil {
		err := c.tx.Commit()
		if err != nil {
			return err
		}
		c.tx = nil
	}
	return nil
}
