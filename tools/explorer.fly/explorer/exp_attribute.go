package explorer

import (
	"encoding/json"
	"errors"
	"fmt"
)

type guidData struct {
	Type int
	Name string
}

func (c guidData) isMe(name string) bool {
	return c.Name == name
}

type PathNameAttribute struct {
	Guid string
	Next *PathNode
}

type PathNode struct {
	Node map[string]*PathNameAttribute
}

func NewPathNode() *PathNode {
	ret := new(PathNode)
	ret.Node = make(map[string]*PathNameAttribute)
	return ret
}

//name bind guid
func (c *PathNode) SetGuid(k, guid string) {
	if c.Node[k] == nil {
		c.Node[k] = new(PathNameAttribute)
	}
	c.Node[k].Guid = guid
}
func (c *PathNode) AddNextNode(k string) *PathNode {
	if c.Node[k] == nil {
		c.Node[k] = new(PathNameAttribute)
	}
	c.Node[k].Next = NewPathNode()
	return c.Node[k].Next
}

//child node
func (c *PathNode) SetNext(parent, chile, guid string) (*PathNode, error) {
	if ok := c.Node[parent]; ok == nil {
		return nil, errors.New("no parent")
	}
	node := NewPathNode()
	node.SetGuid(chile, guid)
	c.Node[parent].Next = node
	return c.Node[parent].Next, nil
}

//get node
func (c *PathNode) GetNext(parent string) (*PathNode, error) {
	if ok := c.Node[parent]; ok == nil {
		return nil, errors.New("no parent")
	}
	return c.Node[parent].Next, nil
}

func (c *PathNode) GetGuid(parent string) (string, error) {
	if ok := c.Node[parent]; ok == nil {
		return "", errors.New("no parent")
	}
	return c.Node[parent].Guid, nil
}

//内存
func (c *explorer) getDBdir() (*PathNode, error) {
	v := c.db.GetValue(Cmd_dir)
	if v == nil {
		return nil, errors.New("path error")
	}
	pathNode := NewPathNode()
	bytes, _ := json.Marshal(v)
	json.Unmarshal(bytes, pathNode)
	return pathNode, nil
}

//校验节点
func (c *explorer) checkPathNode(pwd []string) error {
	head, err := c.getDBdir()
	if err != nil {
		return err
	}
	for _, v := range pwd {
		if guid, err := head.GetGuid(v); guid == "" || err != nil { //节点不存在 或未初始化
			return errors.New("path no find:" + v)
		} else {
			head, _ = head.GetNext(v)
			if head == nil {
				return errors.New("is file no path:" + v)
			}
		}
	}
	return nil
}

//pwd node
func (c *explorer) getPwdNode(head *PathNode) (pre *PathNode, recent *PathNode, next *PathNode) {
	pwd, err := c.getPwd()
	if err != nil {
		return nil, nil, head
	}
	return c.getPathNode(head, pwd)
}

//获取节点
func (c *explorer) getPathNode(head *PathNode, pwd []string) (pre *PathNode, recent *PathNode, next *PathNode) {
	pre = head
	next = head
	for _, v := range pwd {
		if guid, err := next.GetGuid(v); guid == "" || err != nil { //节点不存在 或未初始化
			return nil, nil, nil
		} else {
			head = next
			next, _ = next.GetNext(v)
		}
	}
	return pre, head, next
}

//删除节点
func (c *explorer) delPathNode(pwd []string) error {
	dirs, err := c.getDBdir()
	if err != nil {
		return err
	}
	head := dirs
	next := dirs
	node := ""
	for _, v := range pwd {
		if guid, err := head.GetGuid(v); guid == "" || err != nil { //节点不存在 或未初始化
			return errors.New("no find node")
		} else {
			head = next
			node = v
			next, _ = head.GetNext(v)
		}
	}
	fmt.Println("ddds", node)
	delete(head.Node, node)
	return nil
}
