package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/axgle/mahonia"
)

func help() {
	fmt.Println("eg:-f file -t tag [-o isold]")
}

func check(err error) {
	if err != nil {
		help()
		fmt.Println(err)
		os.Exit(0)
	}
}

func getParame(args []string, tag string) (string, error) {
	finded := false
	for _, v := range args {
		if !finded {
			if v == tag {
				finded = true
			}
			continue
		}
		return v, nil
	}
	return "", errors.New("no find tag")
}
func getParames(s string, sep string) ([]string, error) {
	args := strings.Split(s, sep)
	rst := []string{}
	for _, v := range args {
		if v != "" {
			rst = append(rst, v)
		}
	}
	if len(rst) > 0 {
		return rst, nil
	}
	return nil, errors.New("no find tag")
}

var showOld = ""

func main() {
	file, err := getParame(os.Args, "-f")
	check(err)
	tag, err := getParame(os.Args, "-t")
	check(err)
	showOld, _ = getParame(os.Args, "-o")
	f, err := os.Open(file)
	check(err)
	defer f.Close()
	rd := bufio.NewReader(f)
	for {
		line, err := rd.ReadString('\n') //以'\n'为结束符读入一行
		getPid(line, tag)
		if err != nil || io.EOF == err {
			break
		}
	}
}

func getPid(line string, tag string) {
	de, err := ConvertToString(line, "GBK", "utf-8")
	if err != nil {
		de = line
	}
	datas, err := getParames(de, " ")
	if err != nil {
		return
	}
	for k, v := range datas {
		if strings.Contains(v, tag) {
			if showOld != "" {
				fmt.Println(line)
			} else {
				fmt.Println(datas[k+1])
			}
		}
	}
}

func ConvertToString(str string, strCode string, tagCode string) (string, error) {
	strCoder := mahonia.NewDecoder(strCode)
	strResult := strCoder.ConvertString(str)
	tagCoder := mahonia.NewDecoder(tagCode)
	_, cdata, err := tagCoder.Translate([]byte(strResult), true)
	return string(cdata), err
}
