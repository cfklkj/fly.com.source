package notepad

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func (c *explorer) findStr(pwd string, node *PathNode, str string, all bool, switchFi string, step *int) {
	for k, v := range node.Node {
		if v == nil {
			continue
		}
		if all {
			if v.Next != nil {
				c.findStr(pwd+k+"/", v.Next, str, all, switchFi, step)
			} else {
				c.findValue(pwd+k+"/", c.db.GetWorkPath()+"/"+v.Guid, str, step)
				continue
			}
		}
		switch switchFi {
		case Fi_dir:
			if v.Next == nil {
				continue
			}
		case Fi_file:
			if v.Next != nil {
				continue
			}
		case Fi_value:
			if v.Next == nil {
				c.findValue(pwd+k+"/", c.db.GetWorkPath()+"/"+v.Guid, str, step)
			}
			continue
		default:
		}
		if strings.Contains(k, str) {
			c.printPwd(pwd, k, v)
			c.showMore(step)
		}
	}
}

func (c *explorer) findValue(pwd, path string, str string, step *int) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()
	rd := bufio.NewReader(f)
	index := 0
	for {
		index += 1
		line, err := rd.ReadString('\n') //以'\n'为结束符读入一行
		if err != nil || io.EOF == err {
			break
		}
		if strings.Contains(line, str) {
			file, _ := filepath.Abs(path)
			fmt.Println(pwd + "\t--> " + file + " <--> in line:" + strconv.Itoa(index))
			fmt.Print(line)
			c.showMore(step)
			*step += 1
		}
	}
}
