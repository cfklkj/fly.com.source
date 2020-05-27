package db

import (
	"encoding/base64"
	"encoding/json"
	"io/ioutil"
	"regexp"
	"strconv"
)

const (
	Rate_once    = 1
	Rate_alltime = 2
	Rate_work    = 3
)

type taskInfo struct {
	Guid     string
	Tm       string
	User     string
	TaskName string
	Cmd      string
	RateType int
}
type DB struct {
	tasklist map[string][]*taskInfo
}

func NewTaskInfo(tm, user, taskName, cmd string, rateType int) *taskInfo {
	ret := new(taskInfo)
	ret.Tm = tm
	ret.User = user
	ret.TaskName = taskName
	ret.Cmd = cmd
	ret.RateType = rateType
	ret.Guid = base64.StdEncoding.EncodeToString([]byte(tm + user + taskName + cmd))
	return ret
}

func NewDB() *DB {
	ret := new(DB)
	ret.tasklist = make(map[string][]*taskInfo)
	ret.loadData()
	return ret
}

func (c *DB) AddTask(user, taskName, tm string, rateType int, cmd string) bool {
	pattern := `^([01]\d|2[01234]):([0-5]\d|60)$`
	if rst, _ := regexp.MatchString(pattern, tm); rst {
		task := NewTaskInfo(tm, user, taskName, cmd, rateType)
		c.tasklist[tm] = append(c.tasklist[tm], task)
		c.tasklist[user] = append(c.tasklist[user], task)
		c.UpData()
		return true
	}
	return false
}


func (c *DB) ListTask(user string) string {
	rst := ""
	for _, k := range c.tasklist[user] {
		if k != nil && k.TaskName != "" {
			rst += k.TaskName + " " + k.Tm + " " + strconv.Itoa(k.RateType) + " \"" + k.Cmd + "\" "
			rst += "\n"
		}
	}
	return rst
}

func (c *DB) DelTask(user, taskName string) {
	guid := ""
	tm := ""
	for v, k := range c.tasklist[user] {
		if k != nil && k.TaskName == taskName {
			guid = k.Guid
			tm = k.Tm
			c.tasklist[user] = append(c.tasklist[user][:v], c.tasklist[user][v+1:]...)
			break
		}
	}
	if guid != "" {
		c.delTm(tm, guid)
		c.DelTask(user, taskName)
	} else {
		if len(c.tasklist[user]) < 1 {
			delete(c.tasklist, user)
		}
		c.UpData()
	}
}
func (c *DB) delTm(tm, guid string) {
	for v, k := range c.tasklist[tm] {
		if k != nil && k.Guid == guid {
			c.tasklist[tm] = append(c.tasklist[tm][:v], c.tasklist[tm][v+1:]...)
			break
		}
	}
	if len(c.tasklist[tm]) < 1 {
		delete(c.tasklist, tm)
	}
}
func (c *DB) GetTask(tm string) []*taskInfo {
	return c.tasklist[tm]
}
func (c *DB) GetTms() []string {
	rst := []string{}
	for v, _ := range c.tasklist {
		pattern := `^([01]\d|2[01234]):([0-5]\d|60)$`
		if ok, _ := regexp.MatchString(pattern, v); ok {
			rst = append(rst, v)
		}
	}
	return rst
}
func (c *DB) UpData() {
	data, _ := json.Marshal(c.tasklist)
	ioutil.WriteFile("./tasklist.md", data, 0666)
}
func (c *DB) loadData() {
	data, _ := ioutil.ReadFile("./tasklist.md")
	json.Unmarshal(data, &c.tasklist)
}
