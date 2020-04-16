package Files

import (
	"bufio"
	"fmt"
	"os"
)

type Files struct {
}

func NewFiles() *Files {
	ret := new(Files)
	return ret
}

func (c *Files) Mkdir(path string) {
	os.MkdirAll(path, os.ModePerm)
}

func (c *Files) ReadLine(path string, lineNumber int) string {
	file, err := os.Open(path)
	if err != nil {
		return ""
	}
	Filescanner := bufio.NewScanner(file)
	lineCount := 1
	for Filescanner.Scan() {
		if lineCount == lineNumber {
			return Filescanner.Text()
		}
		lineCount++
	}
	defer file.Close()
	return ""
}

func (c *Files) WriteLine(file, msg string) bool {
	f, err := os.OpenFile(file, os.O_CREATE|os.O_APPEND|os.O_RDWR, 0660)
	if err != nil {
		fmt.Printf("Cannot open file %s!\n", file)
		return false
	}
	defer f.Close()
	f.WriteString(msg + "\n")
	return true
}

func (c *Files) CountsLine(path string) int {
	file, err := os.Open(path)
	if err != nil {
		return 0
	}
	defer file.Close()
	fd := bufio.NewReader(file)
	count := 0
	for {
		_, err := fd.ReadString('\n')
		if err != nil {
			break
		}
		count++

	}
	return count
}
