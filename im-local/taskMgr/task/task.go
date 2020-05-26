package task

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"../db"
	"../tickTimer"
)

type Task struct {
	nTm string
}

func NewTask() *Task {
	ret := new(Task)
	ret.initTick()
	return ret
}
func (c *Task) initTick() {
	ntm, next := c.getNearNextTm()
	if ntm != "" {
		c.nTm = ntm
		go c.runNextTick(c.nTm, next)
	}
}
func (c *Task) AddTick(tm string) {
	if c.nTm == "" {
		c.nTm = tm
		go c.runNextTick(tm, -1)
	} else if tm < c.nTm {
		go c.runTick(tm, -1)
	}
}

func (c *Task) runTick(tm string, next int) {
	fmt.Println("runtick", tm, next)
	if !tickTimer.TimeTicker(tm, next) {
		return
	}
	dbs := db.NewDB()
	tasks := dbs.GetTask(tm)
	for _, k := range tasks {
		rst, err := c.Cmd(strings.Split(k.Cmd, " "))
		fmt.Println(rst, err)
	}
}
func (c *Task) runNextTick(tm string, next int) {
	c.runTick(tm, next)
	nTm := c.getNextTm(tm)
	c.runNextTick(nTm, 1)
}

func (c *Task) getNextTm(tm string) string {
	index := -1
	dbs := db.NewDB()
	tms := dbs.GetTms()
	if tms == nil || len(tms) < 1 {
		return ""
	}
	sort.Strings(tms)
	for v, k := range tms {
		if k != tm {
			continue
		}
		index = v + 1
		break
	}
	fmt.Println(index, tms)
	if index == len(tms) || index == -1 {
		return tms[0]
	}
	if v := tms[index]; v != "" {
		return v
	}
	return ""
}

func (c *Task) getNearNextTm() (tm string, next int) {
	t := time.Now() //2018-07-11 15:07:51.8858085 +0800 CST m=+0.004000001
	H, M, _ := t.Clock()
	now := strconv.Itoa(H) + ":" + strconv.Itoa(M)
	index := -1
	dbs := db.NewDB()
	tms := dbs.GetTms()
	if tms == nil || len(tms) < 1 {
		return "", -1
	}
	sort.Strings(tms)
	for v, k := range tms {
		if k < now {
			continue
		}
		index = v + 1
		break
	}
	fmt.Println(index, now, tms)
	if index == len(tms) || index == -1 {
		return tms[0], 1
	}
	if v := tms[index]; v != "" {
		return v, -1
	}
	return "", -1
}
