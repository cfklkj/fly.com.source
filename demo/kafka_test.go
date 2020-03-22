package demo

import (
	"fmt"
	"testing"

	"fly.com.imsub/kafka"
)

func TestPro(t *testing.T) {
	con, err := kafka.Connect([]string{"vm.me:9092"})
	if err == nil {
		err = con.Send("ListenRpc.C_login", "127.0.0.1:4961", "dddds1")
	}
	fmt.Println(err)
}
