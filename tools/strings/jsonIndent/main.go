package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/atotto/clipboard"
)

func main() {
	if len(os.Args) > 1 {
		fmt.Println("please ctrl+c  jsonString to clipboard \nthen result will copy back to clipboard")
		return
	}
	content, err := clipboard.ReadAll()
	if err != nil {
		fmt.Println("err", err)
		return
	}
	var c map[string]interface{}
	err = json.Unmarshal([]byte(content), &c)
	if err != nil {
		fmt.Println("err", err)
		return
	}
	data, err := json.MarshalIndent(c, "", "      ") //这里返回的data值，类型是[]byte
	if err != nil {
		fmt.Println("ERROR:", err)
	} else {
		fmt.Println(string(data))
		clipboard.WriteAll(string(data))
	}

}
