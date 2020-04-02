package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
)

func main() {
	file, err := getParame(os.Args, "-f")
	check(err)
	tag, err := getParame(os.Args, "-t")
	check(err)
	newLine, err := getParame(os.Args, "-s")
	check(err)
	oldFile := file + ".old"
	f, err := os.Open(file)
	check(err)
	defer f.Close()
	fOld, err := os.Create(oldFile)
	check(err)
	defer fOld.Close()
	rd := bufio.NewReader(f)
	rw := bufio.NewWriter(fOld)
	for {
		line, err := rd.ReadString('\n') //以'\n'为结束符读入一行
		if err != nil || io.EOF == err {
			_, err = rw.WriteString(line)
			check(err)
			break
		}
		if strings.Contains(line, tag) {
			_, err = rw.WriteString(newLine + "\n")
			check(err)
		} else {
			_, err = rw.WriteString(line)
			check(err)
		}
	}
	rw.Flush()
}
func help() {
	fmt.Println("eg:-f file -t tag -s (replace info)")
}

func check(err error) {
	if err != nil {
		fmt.Println(err)
		os.Exit(0)
	}
}

func getParame(args []string, tag string) (string, error) {
	finded := false
	for _, v := range args {
		if !finded {
			if v == tag {
				finded = true
			}
			continue
		}
		return v, nil
	}
	help()
	return "", errors.New("no find tag")
}
