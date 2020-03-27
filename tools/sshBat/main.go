package main

import (
	"fmt"
	"os"

	"./ssh"
)

func main() {
	if len(os.Args) < 3 {
		cmdLines, err := ssh.GetClipboardCmdLines()
		if err != nil || len(cmdLines) < 1 {
			help()
		} else {
			run(cmdLines)
		}
	} else {
		cmdLines, err := ssh.GetFileCmdLines(os.Args[1], os.Args[2])
		if err != nil {
			fmt.Println(err)
			help()
		} else {
			run(cmdLines)
		}
	}
}
func help() {
	fmt.Println("eg: path | please ctrl+c  cmdString to clipboard\n first need: user pass addr\nthen:cmds [down|up|cmd|pause|exit]")
}
func run(cmdLines []string) {
	fmt.Println(cmdLines)
	user := ""
	var con ssh.Conn
	for k, v := range cmdLines {
		if k == 0 {
			args, err := ssh.GetCmd(v)
			if len(args) < 3 {
				fmt.Println(err)
				help()
				return
			}
			user = args[0]
			pass := args[1]
			addr := args[2]
			conn, err := ssh.Connect(user, pass, addr)
			if err != nil {
				fmt.Println("Connect failed:", err, user, pass, addr)
				return
			}
			con = conn
			continue
		}
		args, err := ssh.GetCmd(v)
		if err != nil {
			return
		}
		fmt.Printf(user + ">" + v)
		switch args[0] {
		case "cmd": //本地操作
			rst, err := con.Cmd(args[1:])
			if err != nil {
				fmt.Println(err, args)
			} else {
				fmt.Println(string(rst))
			}
			continue
		case "pause":
			wait := ""
			fmt.Scanln(&wait)
		case "exit":
			return
		case "down":
			if len(args) < 3 {
				fmt.Println("eg:down remote local")
				continue
			}
			err := con.SCPDownFile(args[1], args[2])
			if err != nil {
				fmt.Println(err)
			} else {
				fmt.Println("下载成功:", args[1])
			}
		case "up":
			if len(args) < 3 {
				fmt.Println("eg:up local remote")
				continue
			}
			err := con.SCPupFile(args[1], args[2])
			if err != nil {
				fmt.Println(err)
			} else {
				fmt.Println("上传成功:" + args[1])
			}
		default:
			rst, err := con.Run(v)
			if err != nil {
				if rst != nil {
					fmt.Print(string(rst))
				} else {
					fmt.Println(err)
				}
			} else {
				fmt.Print(string(rst))
			}
		}
	}
}
