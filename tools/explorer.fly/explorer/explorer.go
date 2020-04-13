package explorer

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"../localDB"
)

type Exp interface {
	Pwd() error
	Ls(path string) error
	Cd(path string) error
	Mkdir(path string) error
	Mkfile(path string) error
	Rm(path string) error
	Mv(path string) error
}

func Exps() Exp {
	return &explorer{localDB.NewLocalDB()}
}

type explorer struct {
	db *localDB.LocalDB
}

func (c *explorer) Pwd() error {
	v, err := c.getPwd()
	pwd := ""
	if err == nil {
		for _, chile := range v {
			pwd += "/"
			pwd += chile
		}
	}
	if pwd == "" {
		pwd = "/"
	}
	fmt.Println(pwd + "\t-->\t" + c.db.GetWorkPath())
	return nil
}
func (c *explorer) Mkdir(path string) error {
	newDir, err := c.split(path)
	if err != nil {
		return err
	}
	dirs, err := c.getDBdir()
	updata := false //更新
	if err != nil { //不存在
		dirs = NewPathNode()
	}
	head := dirs
	for _, v := range newDir {
		if guid, err := head.GetGuid(v); guid == "" || err != nil { //节点不存在 或未初始化
			guid := c.makeGuid()
			head.SetGuid(v, guid)
			head = head.AddNextNode(v)
			updata = true
			continue
		} else {
			head, _ = head.GetNext(v)
		}
	}
	if updata {
		c.db.SetKeyValue(Cmd_dir, dirs)
		return c.Cd(path)
	} else {
		return c.Pwd()
	}
}

func (c *explorer) Mkfile(path string) error {
	newDir, err := c.split(path)
	if err != nil {
		return err
	}
	dirs, err := c.getDBdir()
	updata := false //更新
	if err != nil { //不存在
		dirs = NewPathNode()
	}
	head := dirs
	last := len(newDir) - 1
	for index, v := range newDir {
		if guid, err := head.GetGuid(v); guid == "" || err != nil { //节点不存在 或未初始化
			guid := c.makeGuid()
			head.SetGuid(v, guid)
			if index != last { //最后一个 文件名 不添加 节点
				head = head.AddNextNode(v)
			} else { //创建文件
				path := c.db.GetWorkPath() + "/" + guid
				file, err := os.Create(path)
				if err != nil {
					return err
				}
				defer file.Close()
				path, _ = filepath.Abs(path)
				fmt.Println(v + "\t--> " + path)
			}
			updata = true
			continue
		} else {
			head, _ = head.GetNext(v)
		}
	}
	if updata {
		c.db.SetKeyValue(Cmd_dir, dirs)
		return nil
	} else {
		return errors.New("err - find same node name")
	}
}

func (c *explorer) Cd(path string) error {
	k, v := c.split(path)
	if v != nil {
		return v
	}
	if err := c.checkPathNode(k); err != nil {
		return err
	}
	c.db.SetKeyValue(Cmd_pwd, k)
	return c.Pwd()
}

func (c *explorer) Ls(path string) error {
	pwd, v := c.split(path)
	if v != nil {
		return v
	}
	dirs, err := c.getDBdir()
	if err != nil {
		return err
	}
	_, _, next := c.getPathNode(dirs, pwd)
	for k, v := range next.Node {
		if v.Next != nil {
			fmt.Println(k)
		} else {
			path := c.db.GetWorkPath() + "/" + v.Guid
			path, _ = filepath.Abs(path)
			fmt.Println(k + "\t--> " + path)
		}
	}
	return nil
}
func (c *explorer) Rm(path string) error {
	k, v := c.split(path)
	if v != nil {
		return v
	}
	dirs, err := c.getDBdir()
	if err != nil {
		return err
	}
	_, recent, next := c.getPathNode(dirs, k)
	if recent == nil {
		return errors.New("no find:" + path)
	}
	if next != nil {
		for {
			choice := ""
			fmt.Println("is dir will be remove, is continue?(Y|N)", c.nodeToStr(k))
			fmt.Scanln(&choice)
			if choice == "" {
				continue
			}
			if choice == "Y" || choice == "y" {
				break
			}
			fmt.Println("user canced!")
			return nil
		}
		c.deleteNodeFiles(next)
	}
	length := len(k)
	if length < 1 { //清空根目录
		var empty interface{}
		c.db.SetKeyValue(Cmd_dir, empty)
		c.db.SetKeyValue(Cmd_pwd, empty)
	} else {
		node := k[length-1]
		delete(recent.Node, node)
		c.db.SetKeyValue(Cmd_dir, dirs)
		if nodeIndex, pwdIndex, isCd := c.isPwd(k); isCd {
			if nodeIndex == pwdIndex { //相同节点
				return c.Cd("..")
			}
			if nodeIndex < pwdIndex { //父节点
				return c.Cd(c.nodeToStr(k[:length-1]))
			}
		}
	}
	return c.Pwd()
}

func (c *explorer) deleteNodeFiles(node *PathNode) {
	for k, v := range node.Node {
		if v.Next != nil {
			c.deleteNodeFiles(v.Next)
		} else { //文件
			path := c.db.GetWorkPath() + "/" + v.Guid
			os.Remove(path)
			fmt.Println(k)
		}
	}
}

func (c *explorer) Mv(path string) error {
	k, v := c.split(path)
	if v != nil {
		return v
	}
	dirs, err := c.getDBdir()
	if err != nil {
		return err
	}
	_, recent, _ := c.getPathNode(dirs, k)
	if recent == nil {
		return errors.New("no find:" + path)
	}
	node := k[len(k)-1]
	_, _, pwd := c.getPwdNode(dirs)
	pwd.Node[node] = recent.Node[node] //add
	delete(recent.Node, node)          //mv
	c.db.SetKeyValue(Cmd_dir, dirs)
	path = c.db.GetWorkPath() + "/" + pwd.Node[node].Guid
	fmt.Println(path)
	return nil
}
