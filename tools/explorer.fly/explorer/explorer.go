package explorer

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"../localDB"
)

type Exp interface {
	Pwd() error
	Ls(path string, switchLs string) error
	Cd(path string) error
	Mkdir(path string) error
	Mkfile(path string) error
	Mklink(path, newName string) error
	Rm(path string) error
	Mv(path string, newName string) error
	Find(path string, str string, switchFi string) error
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
		return errors.New("err existed! " + path)
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

func (c *explorer) Mklink(path string, newName string) error {
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
	des := node
	if newName != "" {
		des = newName
	}
	_, _, pwd := c.getPwdNode(dirs)
	if pwd.Node[des] != nil {
		return errors.New("local have same node!")
	}
	pwd.Node[des] = recent.Node[node] //add
	guid := pwd.Node[des].Guid
	if !strings.Contains(guid, Ln_file) {
		pwd.Node[des].Guid = Ln_file + guid
	}
	c.db.SetKeyValue(Cmd_dir, dirs)
	c.printPwd(c.getPwdStr(), des, pwd.Node[des])
	return nil
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

func (c *explorer) Ls(path string, switchLs string) error {
	pwd, v := c.split(path)
	if v != nil {
		return v
	}
	dirs, err := c.getDBdir()
	if err != nil {
		return err
	}
	_, _, next := c.getPathNode(dirs, pwd)
	if next == nil {
		return errors.New("no find node!")
	}
	step := 0
	c.ls(c.nodeToStr(pwd), next, switchLs, &step)
	return nil
}
func (c *explorer) ls(pwd string, node *PathNode, switchLs string, step *int) {
	for k, v := range node.Node {
		if v == nil {
			continue
		}

		if v.Next != nil {
			c.ls(pwd+k+"/", v.Next, switchLs, step)
		}
		switch switchLs {
		case Ls_dir:
			if v.Next == nil {
				continue
			}
		case Ls_file:
			if v.Next != nil {
				continue
			}
		default:
		}
		c.printPwd(pwd, k, v)
		c.showMore(step)
	}
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
		if next != nil {
			if nodeIndex, pwdIndex, isCd := c.isPwd(k); isCd {
				if nodeIndex == pwdIndex { //相同节点
					return c.Cd("..")
				}
				if nodeIndex < pwdIndex { //父节点
					return c.Cd(c.nodeToStr(k[:length-1]))
				}
			}
		} else {
			return nil
		}
	}
	return c.Pwd()
}

func (c *explorer) deleteNodeFiles(node *PathNode) {
	for k, v := range node.Node {
		if v.Next != nil {
			c.deleteNodeFiles(v.Next)
		} else { //文件
			if !strings.Contains(v.Guid, Ln_file) {
				path := c.db.GetWorkPath() + "/" + v.Guid
				os.Remove(path)
				fmt.Println(k)
			}
		}
	}
}

func (c *explorer) Mv(path string, newName string) error {
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
	des := node
	if newName != "" {
		des = newName
	}
	_, _, pwd := c.getPwdNode(dirs)
	if pwd.Node[des] != nil {
		return errors.New("local have same node!")
	}
	pwd.Node[des] = recent.Node[node] //add
	delete(recent.Node, node)         //mv
	c.db.SetKeyValue(Cmd_dir, dirs)
	c.printPwd(c.getPwdStr(), des, pwd.Node[des])
	return nil
}
func (c *explorer) Find(path string, str string, switchFi string) error {
	if str == "" {
		return errors.New("findStr is empty")
	}
	k, v := c.split(path)
	if v != nil {
		return v
	}
	dirs, err := c.getDBdir()
	if err != nil {
		return err
	}
	_, _, pwd := c.getPathNode(dirs, k)
	if pwd == nil {
		return errors.New("no find:" + path)
	}
	step := 0
	c.findStr(c.nodeToStr(k), pwd, str, switchFi, &step)
	return nil
}
