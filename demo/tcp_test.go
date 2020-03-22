package demo

import (
	"fmt"
	"testing"

	"github.com/garyburd/redigo/redis"
)

func TestListen(t *testing.T) {
	//server.Listen("127.0.0.1:1102")
}

func TestConnect(t *testing.T) {
	con, err := redis.Dial("tcp", "127.0.0.1:802")
	if err != nil {
		fmt.Println(err)
	} else {
		con.Read()
	}

}
