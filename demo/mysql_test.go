package demo

import (
	"fmt"
	"testing"

	"../mysql"
)

/*
use mysql;
GRANT ALL PRIVILEGES ON im_tzjV2.* TO 'imAdmin'@'*' IDENTIFIED BY 'abc123' WITH GRANT OPTION;
grant all privileges on im_tzjV2.* to im@'%' identified by 'abc123';
FLUSH   PRIVILEGES;
*/
func TestCon(t *testing.T) {
	con, err := mysql.Connect("im:abc123@tcp(web.me:10031)/im_tzjV2?charset=utf8")
	if err == nil {
		err = con.Listen()
	}
	fmt.Println(err)
}
