package explorer

import (
	"encoding/json"
	"errors"
	"fmt"
)

type TagAttribute struct {
	Guids []string
}

func (c *TagAttribute) find(guid string) bool {
	for _, v := range c.Guids {
		if v == guid {
			return true
		}
	}
	return false
}

func (c *TagAttribute) Add(guid string) {
	c.Guids = append(c.Guids, guid)
}
func (c *TagAttribute) Del(guid string) {
	for index, v := range c.Guids {
		if v == guid {
			c.Guids = append(c.Guids[:index], c.Guids[index+1:]...)
			break
		}
	}
}

type TagNode struct {
	Node map[string]*TagAttribute
}

func NewTagNode() *TagNode {
	ret := new(TagNode)
	ret.Node = make(map[string]*TagAttribute)
	return ret
}

func (c *explorer) getTagNode() (*TagNode, error) {
	v := c.db.GetValue(Cmd_tag)
	if v == nil {
		return nil, errors.New("err tag path")
	}
	pathNode := new(TagNode)
	bytes, _ := json.Marshal(v)
	json.Unmarshal(bytes, pathNode)
	return pathNode, nil
}

func (c *explorer) tagAdd(tagName, guid string) error {
	tagNode, err := c.getTagNode()
	if err != nil {
		tagNode = NewTagNode()
	}
	if v := tagNode.Node[tagName]; v != nil {
		if v.find(guid) {
			return nil
		}
		v.Add(guid)
	} else {
		tagNode.Node[tagName] = new(TagAttribute)
		tagNode.Node[tagName].Add(guid)
	}
	c.db.SetKeyValue(Cmd_tag, tagNode)
	return nil
}

func (c *explorer) tagDel(tagName, guid string) error {
	tagNode, err := c.getTagNode()
	if err != nil {
		return err
	}
	if v := tagNode.Node[tagName]; v != nil {
		v.Del(guid)
		c.db.SetKeyValue(Cmd_dir, tagNode)
	}
	return nil
}
func (c *explorer) getTagGuids(tagName string) ([]string, error) {
	tagNode, err := c.getTagNode()
	if err != nil {
		return nil, err
	}
	if v := tagNode.Node[tagName]; v != nil {
		return v.Guids, nil
	}
	return nil, errors.New("no tag of: " + tagName)
}
func (c *explorer) getGuidTags(guid string) error {
	tagNode, err := c.getTagNode()
	if err != nil {
		return err
	}
	for k, v := range tagNode.Node {
		if v.find(guid) {
			fmt.Println("\t" + k)
		}
	}
	return nil
}

func (c *explorer) getTags() error {
	tagNode, err := c.getTagNode()
	if err != nil {
		return err
	}
	for k, _ := range tagNode.Node {
		fmt.Println(k)
	}
	return nil
}
