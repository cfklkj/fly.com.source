package main

import (
	"errors"
	"fmt"
	"os"

	"./explorer"
)

func help() {
	fmt.Println("explorer.fly.exe [ pwd | mkdir | mkfile | mklink | mktag | rm | cd | mv] | [ ls [/f | /d | /t ] ] | [ find <path> strings [/f | /d | /v | /t ] ")
	fmt.Println("pwd  查看当前目录\nmkdir 创建目录\nmkfile 创建文件\ncd 变更到指定目录\nmv 移动目标")
	fmt.Println("mklink 创建链接\nmktag 创建标签")
	fmt.Println("ls 列出当前目录信息\nfind 查找信息")
	fmt.Println("\t/f 文件\n\t/d 目录")
	fmt.Println("\t/v 文件内容")
	fmt.Println("\t/t:tags 标签")
	fmt.Println("path 路径:\n\t. | ./ 当前\n\t../ 上一级目录")
}

func check(err error) {
	if err != nil {
		fmt.Println(err)
		help()
		os.Exit(0)
	}
}
func checkArgs(lenth int) {
	if len(os.Args) < lenth+1 {
		help()
		os.Exit(0)
	}
}

func checkErr(err error) {
	if err != nil {
		fmt.Println(err)
	}
}

func findTag(args []string, tag string) (bool, error) {
	finded := false
	for _, v := range args {
		if !finded {
			if v == tag {
				finded = true
			}
			continue
		}
		return true, nil
	}
	return false, errors.New("no find tag")
}

func main() {
	exp := explorer.Exps()
	if len(os.Args) < 2 {
		help()
		return
	}
	switch os.Args[1] {
	case "pwd":
		exp.Pwd()
	case "ls":
		path := "."
		if len(os.Args) > 2 {
			path = os.Args[2]
		}
		exp.Ls(path)
	case "cd":
		checkArgs(2)
		path := os.Args[2]
		err := exp.Cd(path)
		checkErr(err)
	case "mkdir":
		checkArgs(2)
		path := os.Args[2]
		err := exp.Mkdir(path)
		checkErr(err)
	case "mkfile":
		checkArgs(2)
		path := os.Args[2]
		fmt.Println(path)
		err := exp.Mkfile(path)
		checkErr(err)
	case "rm":
		checkArgs(2)
		path := os.Args[2]
		err := exp.Rm(path)
		checkErr(err)
	case "mv":
		checkArgs(2)
		path := os.Args[2]
		err := exp.Mv(path)
		checkErr(err)
	}
}
