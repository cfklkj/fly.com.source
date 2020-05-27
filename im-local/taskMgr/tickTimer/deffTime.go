package tickTimer

import (
	"strconv"
	"time"
)

func abs(a int) int {
	if a >= 0 {
		return a
	} else {
		return -a
	}
}
func dayTime() int {
	return 24 * 60 * 60
}
func deffTime(h, m, s int) (int, bool) {
	//获取当前时间
	t := time.Now() //2018-07-11 15:07:51.8858085 +0800 CST m=+0.004000001
	H, M, S := t.Clock()
	iT := h*3600 + m*60 + s
	nT := H*3600 + M*60 + S
	return (iT - nT), iT < nT
}

func StrArrayToInt(ts []string) (h, m, s int) {
	for index, v := range ts {
		if index == 0 {
			h, _ = strconv.Atoi(v)
		}
		if index == 1 {
			m, _ = strconv.Atoi(v)

		}
		if index == 2 {
			s, _ = strconv.Atoi(v)
		}
	}
	return h, m, s
}
