package main

import (
	"encoding/base64"
	"fmt"
	"log"
	"os"
)

func main() {
	input := os.Args[1]
	// 如果要用在url中，需要使用URLEncoding
	// uEnc := base64.URLEncoding.EncodeToString([]byte(input))
	// fmt.Println(uEnc)

	uDec, err := base64.StdEncoding.DecodeString(input)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println(string(uDec))
}
