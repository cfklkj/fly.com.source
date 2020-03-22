package main

import (
	"fmt"
	"os"

	"../../util"
)

func main() {
	if len(os.Args) < 3 {
		fmt.Println("xx.exe userid key")
		return
	}
	key, _ := util.GenerateToken(os.Args[1], os.Args[2])
	fmt.Println(key)
}
