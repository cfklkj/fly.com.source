package notepad

import (
	"crypto/md5"
	"encoding/hex"
	"math/rand"
	"strconv"
	"time"
)

const (
	TypeGuid_Pro  = 100
	TypeGuid_File = 101
	TypeGuid_Dir  = 102
)

//生成32位md5字串
func (c *explorer) getMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

//生成Guid字串
func (c *explorer) makeGuid() string {
	tm := time.Now()
	head := rand.Intn(int(tm.Unix())) //tm 秒级别 存在不唯一  添加head
	return c.getMd5String(strconv.Itoa(head) + tm.String())
}
