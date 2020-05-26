package task

import (
	"errors"
	"io"
	"os/exec"
)

type RunAdd func(name string, id int)
type RunDel func(name string, id int)
type Record func(name string, reader io.ReadCloser)

func NewCmd(args []string) *exec.Cmd {
	cmd := &exec.Cmd{
		Path: args[0],
		Args: args,
	}
	return cmd
}

//执行命令--
func (c *Task) Cmd(arg []string) ([]byte, error) {
	if arg == nil || len(arg) < 1 {
		return nil, errors.New("err arg nil")
	}
	cmd := NewCmd(arg)
	cmdStdoutPipe, _ := cmd.StdoutPipe()
	cmdStderrPipe, _ := cmd.StderrPipe()
	defer cmdStdoutPipe.Close() // 保证关闭输出流
	defer cmdStderrPipe.Close() // 保证关闭输出流
	if err := cmd.Start(); err != nil {
		return nil, err
	}
	// err := cmd.Wait()
	// if err != nil {
	// 	return nil, err
	// } else
	{
		var allBytes []byte
		for {
			buf := make([]byte, 1024)
			index, err := cmdStdoutPipe.Read(buf)
			if index < 1 {
				break
			}
			if err != nil {
				return nil, err
			}
			allBytes = append(allBytes, buf[:index]...)
		}
		return allBytes, nil
	}
}
