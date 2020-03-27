package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	if len(os.Args) < 3 {
		fmt.Println("please input full path and index [1|-1] -_-")
		return
	}
	path := os.Args[1]
	index, err := strconv.Atoi(os.Args[2])
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	rst := strings.Split(path, "\\")
	length := len(rst)
	if length < 0 {
		rst = strings.Split(path, "/")
		length = len(rst)
	}
	if length < 1 {
		fmt.Println(path)
	} else {
		if index > 0 {
			if length < index {
				index = length
			}
			fmt.Println(rst[index-1])
		} else {
			if length < -index {
				index = 0
			} else {
				index = length + index
			}
			fmt.Println(rst[index])
		}
	}
}
