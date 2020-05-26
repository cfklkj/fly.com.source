package tickTimer

//https://blog.csdn.net/HYZX_9987/article/details/99947688
import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

func TimeTicker(tm string, next int) bool {
	//var wait = 0
	//var start = time.Now()
	ts := strings.Split(tm, ":")
	var h, m, s int
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
	num, isAbs := deffTime(h, m, s)
	//next, _ := strconv.Atoi(getArg("-tn")) //下一次执行时间
	if next > 0 {
		num += dayTime() * next
	}
	if isAbs && next < 1 {
		if next > -1 {
			return true
		} else {
			return false
		}
	}
	//wait := num
	//start := time.Now()
	//st, _ := time.ParseDuration(end)
	st := time.Duration(num) * time.Second
	fmt.Println("计时结束时间:", time.Now().Add(st))
	ticker := time.NewTicker(time.Duration(num) * time.Second) // 每隔1s进行一次打印
	//go showLeast()
	<-ticker.C
	fmt.Println("时间到")
	return true
}

// func showLeast() {
// 	for {
// 		fmt.Println("计时中...")
// 		fmt.Scanln()
// 		now := time.Now()
// 		past := now.Sub(start)
// 		num := time.Duration(wait)*time.Second - past
// 		fmt.Println("还剩:", num, "秒")
// 	}
// }
