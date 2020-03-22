package server

import (
	"net"
	"time"
)

type ListenError int

const (
	g_readBuffSize      = 1024 //每次读取的字节数
	ListenError_null    = 0
	ListenError_conLose = 1
	ListenError_timeout = 2
)

//心跳时间
func SetHdTime(con net.Conn, second int) error {
	err := con.SetReadDeadline(time.Now().Add(time.Second * time.Duration(second)))
	if err != nil {
		return err
	}
	return nil
}

//异步消息
func Send(con net.Conn, msg []byte) error {
	_, err := con.Write(msg)
	if err != nil {
		return err
	}
	con.Write([]byte("\n"))
	return nil
}

//读取信息
//2020/2/17 - 2020/3/4 - 3/16优化读取
func waitMsg(con net.Conn, callBack func(con net.Conn, msg []byte, errs ListenError)) {
	var allBytes []byte
	listenError := ListenError(ListenError_null)
	SetHdTime(con, 5)
	for {
		//读取连接内存
		buf := make([]byte, g_readBuffSize)
		readBytesNum, err := con.Read(buf)
		if err != nil { //读取异常
			errs, ok := err.(net.Error)
			if !ok || !errs.Temporary() {
				listenError = ListenError_conLose //端断开连接 -- 连接错误
				break
			}
			listenError = ListenError_timeout //端断开连接 -- 超时未操作
			break
		}
		if readBytesNum != 0 {
			if index := findEnd(buf); index > -1 { //找末尾 \n
				allBytes = append(allBytes, buf[:index]...)
				callBack(con, allBytes, listenError)
				preIndex := index + 1
				for {
					if index = findEnd(buf[preIndex:readBytesNum]); index > -1 { //找末尾 \n
						callBack(con, buf[preIndex:preIndex+index+1], listenError)
						preIndex += index + 1
					} else {
						break
					}
				}
				if preIndex < readBytesNum {
					allBytes = buf[preIndex:readBytesNum]
				} else {
					allBytes = nil
				}
				continue
			}
			allBytes = append(allBytes, buf[:readBytesNum]...)
		}
		if readBytesNum != g_readBuffSize { //接收的长度没满，说明已经读到最后了
			callBack(con, allBytes, listenError)
			allBytes = nil
			continue
		}
	}
	callBack(con, allBytes, listenError)
}

func findEnd(buff []byte) int {
	for index, data := range buff {
		if data == '\n' {
			return index
		}
	}
	return -1
}
