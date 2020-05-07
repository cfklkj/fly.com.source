package main

//https://www.kancloud.cn/liupengjie/go/999876

import (
	"bufio"
	"fmt"
	"io"
	"os"

	"github.com/axgle/mahonia"
)

func ConvertToString(src string, srcCode string, tagCode string) string {
	srcCoder := mahonia.NewDecoder(srcCode)
	srcResult := srcCoder.ConvertString(src)
	tagCoder := mahonia.NewDecoder(tagCode)
	_, cdata, _ := tagCoder.Translate([]byte(srcResult), true)
	result := string(cdata)
	return result
}

func Println(str string) {
	//str = ConvertToString(str, "utf-8", "gbk")
	fmt.Println(str)
}

func check(err error) {
	if err != nil {
		//s	help()
		fmt.Println(err)
		os.Exit(0)
	}
}
func main() {
	f, err := os.Open("d:\\t.tmp")
	check(err)
	defer f.Close()
	rd := bufio.NewReader(f)
	// var enc mahonia.Decoder
	// enc = mahonia.NewDecoder("gbk")
	for {
		line, err := rd.ReadString('\n') //以'\n'为结束符读入一行
		//Println(enc.ConvertString(line))
		Println(line)
		if err != nil || io.EOF == err {
			break
		}
	}
}
