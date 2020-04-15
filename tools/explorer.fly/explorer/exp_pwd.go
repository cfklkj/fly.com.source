package explorer

import (
	"errors"
	"strings"
)

//内存
func (c *explorer) isPwd(node []string) (nodeIndex, pwdIndex int, res bool) {
	pwd, err := c.getPwd()
	if err != nil {
		return 0, 0, false
	}
	index := 0
	length := len(pwd) - 1
	for _, v := range node {
		if index > length || v != pwd[index] {
			return 0, 0, false
		}
		index += 1
	}
	return index, len(pwd), true
}
func (c *explorer) getPwd() (res []string, err error) {
	v := c.db.GetValue(Cmd_pwd)
	if v == nil {
		return res, nil
	}
	switch v.(type) {
	case []interface{}:
		for _, value := range v.([]interface{}) {
			res = append(res, value.(string))
		}
	case []string:
		return v.([]string), err
	}
	return res, nil
}

//解析头部
func (c *explorer) getPathHead(path string) ([]string, error) {
	args := strings.Split(path, "/")
	switch args[0] {
	case "":
		return []string{}, nil
	default: // ".." "xx"
		return c.getPwd()
	}
}

//解析目录
func (c *explorer) split(path string) ([]string, error) {
	if path == "" {
		return nil, errors.New("path is empty")
	}
	pathRem := strings.Replace(path, " ", "", -1)
	head, err := c.getPathHead(pathRem)
	if err != nil {
		return nil, err
	}
	args := strings.Split(pathRem, "/")
	length := len(args)
	tail := head
	for i := 0; i < length; i++ {
		switch args[i] {
		case "": //不处理
		case ".": //不处理
		case "..": //上一级
			tailLen := len(tail)
			if tailLen < 1 {
				return nil, errors.New("err path:" + path)
			}
			tail = tail[:tailLen-1]
		default: //下一级
			tail = append(tail, args[i])
		}
	}
	return tail, nil
}

func (c *explorer) nodeToStr(node []string) string {
	res := "/"
	for _, v := range node {
		res += v
		res += "/"
	}
	return res
}
