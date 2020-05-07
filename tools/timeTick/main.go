package main

//https://blog.csdn.net/HYZX_9987/article/details/99947688
import (
	"fmt"
	"os"
	"strconv"
	"time"
)

func getArg(tag string) string {
	L := len(os.Args)
	for i := 1; i < L; i++ {
		if os.Args[i] == tag {
			if i+1 < L {
				return os.Args[i+1]
			}
			return ""
		}
	}
	return ""
}
func help() {
	fmt.Println("eg:-t 1000 (单位是秒)\n ")
}

var wait = 0
var start = time.Now()

func main() {
	end := getArg("-t")
	if end == "" {
		help()
		return
	}
	num, _ := strconv.Atoi(end)
	if num < 1 {
		help()
		return
	}
	wait = num
	start = time.Now()
	//st, _ := time.ParseDuration(end)
	st := time.Duration(num) * time.Second
	fmt.Println("计时结束时间:", time.Now().Add(st))
	ticker := time.NewTicker(time.Duration(num) * time.Second) // 每隔1s进行一次打印
	go showLeast()
	<-ticker.C
	fmt.Println("时间到")
}

func showLeast() {
	for {
		fmt.Println("计时中...")
		fmt.Scanln()
		now := time.Now()
		past := now.Sub(start)
		num := time.Duration(wait)*time.Second - past
		fmt.Println("还剩:", num, "秒")
	}
}
