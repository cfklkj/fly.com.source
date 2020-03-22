package demo

import (
	"fmt"
	"net/rpc"
	"testing"

	rpcs "../rpc"
	client "../rpc/client"
)

type B struct {
	C_test func(req int, res *interface{}) error
}

type A struct {
}

func (c *A) C_test(req int, res *interface{}) error {
	fmt.Println("test")
	return nil
}

func TestListen(t *testing.T) {
	a := new(A)
	b := new(B)
	b.C_test = a.C_test
	err := rpcs.Listen("127.0.0.1:8858", *b)
	fmt.Println(err)
}

func TestTest(t *testing.T) {
	conn, err := rpc.Dial("tcp", ":8858")
	if err != nil {
		fmt.Println(err)
		return
	}
	var reply interface{}
	err = conn.Call("A.C_test", 2, &reply)
	fmt.Println(err)
}

func TestClient(t *testing.T) {
	con := client.RPC()
	err := con.AddCon("127.0.0.1:8961")
	err = con.SendRequest("127.0.0.1:8961", "a.b", "a", &con)
	fmt.Println(err)
}
