package demo

import (
	"errors"
	"fmt"
	"testing"

	"fly.com.imsub/redis"
	"fly.com.imsub/util"
)

func TestRedis(t *testing.T) {
	con, err := redis.Connect("web.me:10021", "", 12)
	if err == nil {
		url, err := getUrlByUserid(con, "test3@test.com")
		fmt.Println(url, err)
	}
	fmt.Println(err)
}

func getUrlByUserid(con redis.Conn, userid string) (string, error) {
	//"xxx@qq.com"
	head, tail, err := util.GetUserSplit(userid)
	if err != nil {
		return "", err
	}
	//ip
	replay, err := con.Do(redis.Cmd_hget, tail, head)
	if err != nil {
		return "", err
	}
	if replay == nil {
		return "", errors.New("no distribution user for server")
	}
	url := string(replay.([]byte))
	return url, nil
}
