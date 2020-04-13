package ssh

import (
	"bufio"
	"errors"
	"io"
	"os"
	"strings"

	"github.com/atotto/clipboard"
)

func GetFileCmdLines(path, tag string) ([]string, error) {
	f, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	rd := bufio.NewReader(f)
	var cmdLine []string
	findTag := false
	for {
		line, err := rd.ReadString('\n') //以'\n'为结束符读入一行
		if err != nil || io.EOF == err {
			break
		}
		if !findTag { //find tag
			if strings.Contains(line, tag) {
				findTag = true
			}
			continue
		}
		str := strings.Replace(line, " ", "", -1)
		if len(str) < 2 { //clear
			continue
		}
		if str[0] == ':' { //new tag or tips
			break
		}
		if str[0] == '-' { // tips
			continue
		}
		cmdLine = append(cmdLine, line)
	}
	return cmdLine, nil
}

func GetClipboardCmdLines() ([]string, error) {
	content, err := clipboard.ReadAll()
	if err != nil {
		return nil, err
	}
	res := []string{}
	cmdLines := strings.(content, "\n")
	for _, v := range cmdLines {
		//去头尾
		str := strings.TrimLeft(v, " ")
		str = strings.TrimRight(str, " ")
		str = strings.TrimRight(str, "\r\n")
		str = strings.TrimRight(str, "\r")
		str = strings.TrimRight(str, "\n")
		if len(str) < 2 {
			continue
		}
		if str[0] == '-' { // tips
			continue
		}
		//加末尾
		res = append(res, str+"\n")
	}
	return res, nil
}
func GetCmd(cmdLine string) ([]string, error) {
	//去头尾
	str := strings.TrimLeft(cmdLine, " ")
	str = strings.TrimRight(str, " ")
	str = strings.TrimRight(str, "\r\n")
	str = strings.TrimRight(str, "\r")
	str = strings.TrimRight(str, "\n")
	if len(str) < 2 {
		return nil, errors.New("args is nil")
	}
	args := strings.Split(str, " ")
	res := []string{}
	for _, v := range args {
		if v != "" {
			res = append(res, v)
		}
	}
	return res, nil
}
