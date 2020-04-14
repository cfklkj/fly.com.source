package explorer

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func (c *explorer) printPwd(pwd string, nodeName string, node *PathNameAttribute) {
	path := ""
	if node.Next != nil {
		path = pwd + nodeName + "/"
	} else {
		path = pwd + nodeName + "\t--> "
		file := c.db.GetWorkPath() + "/" + node.Guid
		file, _ = filepath.Abs(file)
		path += file
	}
	fmt.Println(path)

}
func (c *explorer) showMore(step *int) {
	if *step > 7 {
		fmt.Println("More ...")
		temp := ""
		fmt.Scanln(&temp)
		*step = 0
	}
	*step += 1
}
func (c *explorer) findStr(pwd string, node *PathNode, str string, step *int) {
	for k, v := range node.Node {
		if v == nil {
			continue
		}
		if strings.Contains(k, str) {
			c.printPwd(pwd, k, v)
			c.showMore(step)
		}
		if v.Next != nil {
			c.findStr(pwd+k+"/", v.Next, str, step)
		} else {
			c.findValue(pwd+k+"/", c.db.GetWorkPath()+"/"+v.Guid, str, step)
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
			fmt.Println(pwd + "\t--> " + path + " <--> in line:" + strconv.Itoa(index))
			fmt.Print(line)
			c.showMore(step)
		}
	}
}
