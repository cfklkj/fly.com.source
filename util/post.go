package util

import (
	"errors"
	"net/http"
	"strings"
)

func PostMsg(token, url, body string) error {
	if token == "" || url == "" || body == "" {
		return errors.New("empty request")
	}
	body_type := "application/json;charset=utf-8"
	reqest, err := http.NewRequest("POST", url, strings.NewReader(body))
	if err != nil {
		return err
	}
	client := &http.Client{}
	reqest.Header.Set("Content-Type", body_type)
	reqest.Header.Set("Authorization", token)
	//处理返回结果
	_, err2 := client.Do(reqest)
	if err2 != nil {
		return err2
	}
	return nil
	// //将结果定位到标准输出 也可以直接打印出来 或者定位到其他地方进行相应的处理
	// stdout := os.Stdout
	// _, err = io.Copy(stdout, response.Body)
	// if response.StatusCode != 200 {
	// 	log.PrintErr("err", "post result", response.StatusCode)
	// }
	//log.PrintErr("postMsg", body)
	// //返回的状态码
	// status := response.StatusCode
}
