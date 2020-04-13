package explorer

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
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
	return c.getMd5String(tm.String())
}

func (c *explorer) addData(guidType int) string {
	Guid := ""
	switch guidType {
	case TypeGuid_Pro:
		Guid = "P_" + c.makeGuid()
	case TypeGuid_File:
		Guid = "F_" + c.makeGuid()
	case TypeGuid_Dir:
		Guid = "D_" + c.makeGuid()
	}
	return Guid
}
func (c *explorer) getGuidType(guid string) (int, error) {
	if guid == "" {
		return 0, errors.New("guid is nil")
	}
	switch guid[0] {
	case 'P':
		return TypeGuid_Pro, nil
	case 'D':
		return TypeGuid_Dir, nil
	case 'F':
		return TypeGuid_File, nil
	default:
		return 0, errors.New("guid type error")
	}
}
