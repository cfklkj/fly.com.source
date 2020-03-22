package redis

import (
	"sync"
	"time"

	Redis "github.com/garyburd/redigo/redis"
)

const (
	Cmd_exists    = "exists"
	Cmd_sismember = "SISMEMBER"
	Cmd_smembers  = "smembers"
	Cmd_hget      = "hget"
	Cmd_hgetall   = "hgetall"
	Cmd_hkeys     = "hkeys"
	Cmd_del       = "del"
	Cmd_hset      = "hset"
	Cmd_hdel      = "hdel"
	Cmd_sadd      = "sadd"
	Cmd_srem      = "srem"
	Cmd_publish   = "publish"
)

type Conn interface {
	Listen() error
	Send(commandName string, args ...interface{}) error
	Do(commandName string, args ...interface{}) (reply interface{}, err error)
}

type redis struct {
	con  Redis.Conn
	exit chan error
	lock sync.Mutex
}

func Connect(dbUrl, pwd string, db int) (Conn, error) {
	con, err := Redis.Dial("tcp", dbUrl, Redis.DialPassword(pwd), Redis.DialDatabase(db))
	return &redis{con, make(chan error), sync.Mutex{}}, err
}
func (c *redis) Send(commandName string, args ...interface{}) error {
	return c.con.Send(commandName, args...)
}
func (c *redis) Do(commandName string, args ...interface{}) (reply interface{}, err error) {
	c.lock.Lock()
	defer c.lock.Unlock()
	return c.con.Do(commandName, args...)
}

func (c *redis) Listen() error {
	tick := time.NewTicker(1 * time.Second) //定时器
	defer tick.Stop()
	for {
		select {
		case err := <-c.exit:
			c.con.Close()
			return err
		case <-tick.C:
			err := c.con.Flush()
			if err != nil {
				return err
			}
		}
	}
}
