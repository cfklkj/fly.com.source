package main

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strings"

	"./notepad"
)

func help() {
	fmt.Println("notepad.fly.exe \n[ pwd | mkdir | mkfile | mklink | mktag | cd | mv] | rm [-t] | [ ls [-a] [-f | -d | -t ] ] | [ find <path> strings [-a] [-f | -d | -v | -t ] ")
	fmt.Println("pwd  查看当前目录\nmkdir 创建目录\nmkfile 创建文件\ncd 变更到指定目录\nmv 移动目标到当前目录")
	fmt.Println("mklink 创建链接\nmktag 创建标签")
	fmt.Println("ls 列出当前目录信息\nfind 查找信息")
	fmt.Println("\t-a 列出所有")
	fmt.Println("\t-f 文件\n\t-d 目录")
	fmt.Println("\t-v 文件内容")
	fmt.Println("\t-t:tags 标签")
	fmt.Println("path 路径:\n\t. | ./ 当前\n\t../ 上一级目录")
}
func showHelp(cmd string) {
	helpStr := map[string]string{
		"pwd":    "查看当前目录",
		"mkdir":  "创建目录\n eg:\n\tmkdir path",
		"mkfile": "创建文件\n eg:\n\tmkfile path",
		"mktag":  "创建标签\n eg:\n\tmktag path tagname",
		"rm":     "删除目标\n eg:\n\trm path\n删除标签:\n\t-t [tagname] [-d pathname]",
		"cd":     "变更到到指定目录\n eg:\n\tcd path",
		"mv":     "移动目标到当前目录\n eg:\n\tmv path [newName]",
		"mklink": "创建目标链接到当前目录\n eg:\n\tmklink path [newName]",
		"ls":     "列出信息:\n\t-f 文件\n\t-d 目录\n 复选: \n\t-a 列出所有 \n eg:\n\tls path [-d] [-a]\n查找标签:\n\t-t [tagname]",
		"find":   "查询信息:\n\t-f 文件\n\t-d 目录\t-v 文件内容查找\n 复选: \n\t-a 列出所有 \n eg:\n\tfind path str [-d] [-a]\n查找标签:\n\t-t pathName",
	}
	if v := helpStr[cmd]; v != "" {
		fmt.Println(cmd, v)
	}
}

func checkErr(cmd string, err error) {
	if err != nil {
		fmt.Println(err)
		showHelp(cmd)
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
func getTag(args []string, tag string) string {
	for _, v := range args {
		if strings.Contains(tag, v) {
			return v
		}
	}
	return ""
}
func getTagValue(args []string, tag string) string {
	find := false
	for _, v := range args {
		if !find {
			if strings.Contains(tag, v) {
				find = true
				continue
			}
		} else {
			if v[0] == '-' {
				return ""
			}
			if v == "" {
				continue
			}
			return v
		}
	}
	return ""
}

func getArg(args []string, index int, Default string) string {
	if len(args) < index {
		return Default
	}
	if args[index-1][0] == '-' {
		return Default
	}
	return args[index-1]
}
func getParams(arg string) (res []string) {
	args := strings.Split(arg, " ")
	for _, v := range args {
		if v != "" {
			res = append(res, v)
		}
	}
	return res
}
func main() {
	fmt.Printf("fly->")
	input := bufio.NewScanner(os.Stdin)
	for input.Scan() {
		arg := input.Text()
		if arg == "" {
			fmt.Printf("fly->")
			continue
		}
		args := getParams(arg)
		exp(args)
		fmt.Printf("fly->")
	}
}
func exp(args []string) {
	cmd := getArg(args, 1, "help")
	exp := notepad.Exps()
	switch cmd {
	case "mklink":
		path := getArg(args, 2, "")
		newName := getArg(args, 3, "")
		err := exp.Mklink(path, newName)
		checkErr(cmd, err)
	case "pwd":
		exp.Pwd()
	case "ls":
		switchLs := getTag(args, notepad.Tag_)
		if switchLs != "" {
			tagName := getTagValue(args, notepad.Tag_)
			var err error
			if tagName != "" {
				err = exp.LsGuids(tagName)
			} else {
				err = exp.LsTags()
			}
			checkErr(cmd, err)
		} else {
			path := getArg(args, 2, ".")
			switchLs := getTag(args, notepad.Ls_dir+notepad.Ls_file+notepad.Tag_)
			all := getTag(args, notepad.LayoutAll)
			err := exp.Ls(path, all != "", switchLs)
			checkErr(cmd, err)
		}
	case "cd":
		path := getArg(args, 2, ".")
		err := exp.Cd(path)
		checkErr(cmd, err)
	case "mkdir":
		path := getArg(args, 2, "")
		err := exp.Mkdir(path)
		checkErr(cmd, err)
	case "mkfile":
		path := getArg(args, 2, "")
		fmt.Println(path)
		err := exp.Mkfile(path)
		checkErr(cmd, err)
	case "mktag":
		path := getArg(args, 2, "")
		tagName := getArg(args, 3, "")
		err := exp.Mktag(path, tagName)
		checkErr(cmd, err)
	case "rm":
		switchLs := getTag(args, notepad.Tag_)
		if switchLs != "" {
			tagName := getTagValue(args, notepad.Tag_)
			path := getTagValue(args, notepad.Tag_dir)
			err := exp.MvTag(tagName, path)
			checkErr(cmd, err)
		} else {
			path := getArg(args, 2, "")
			err := exp.Rm(path)
			checkErr(cmd, err)
		}
	case "mv":
		path := getArg(args, 2, "")
		newName := getArg(args, 3, "")
		err := exp.Mv(path, newName)
		checkErr(cmd, err)
	case "find":
		switchLs := getTag(args, notepad.Tag_)
		if switchLs != "" {
			path := getTagValue(args, notepad.Tag_)
			if path != "" {
				err := exp.LsTagNames(path)
				checkErr(cmd, err)
			}
		} else {
			path := getArg(args, 2, ".")
			substr := getArg(args, 3, "")
			switchFi := getTag(args, notepad.Fi_dir+notepad.Fi_file+notepad.Fi_value)
			all := getTag(args, notepad.LayoutAll)
			err := exp.Find(path, substr, all != "", switchFi)
			checkErr(cmd, err)
		}
	default:
		help()
	}
}
