package wss

import (
	"fmt"
	"net"
	"time"
)

const (
	g_readBuffSize     = 1024 //每次读取的字节数
	TcpWaitRst_null    = 0
	TcpWaitRst_conLose = 1
	TcpWaitRst_timeout = 2
)

type Tcp int

type TcpWaitRst int

//心跳时间
func (c Tcp) SetHdTime(con net.Conn, second int) {
	err := con.SetReadDeadline(time.Now().Add(time.Second * time.Duration(second)))
	if err != nil {
		fmt.Println("SetHdTime", err)
	}
}

//异步消息
func (c Tcp) SendMsg(con net.Conn, msg []byte) bool {
	_, err := con.Write(msg)
	if err != nil {
		return false
	}
	con.Write([]byte("\n"))
	return true
}

//读取信息
//2020/2/17 - 2020/3/4 优化读取
func (c Tcp) WaitMsg(con net.Conn, callBack func(con net.Conn, msg []byte)) (rst TcpWaitRst) {
	var allBytes []byte
	rst = TcpWaitRst_null
	for {
		//读取连接内存
		buf := make([]byte, g_readBuffSize)
		readBytesNum, err := con.Read(buf)
		if err != nil { //读取异常
			fmt.Println("WaitMsg-err", err)
			errs, ok := err.(net.Error)
			if !ok || !errs.Temporary() {
				rst = TcpWaitRst_conLose //端断开连接 -- 连接错误
				break
			}
			rst = TcpWaitRst_timeout //端断开连接 -- 超时未操作
			break
		}
		if readBytesNum != 0 {
			if index := c.findEnd(buf); index > -1 { //找末尾 \n
				allBytes = append(allBytes, buf[:index]...)
				callBack(con, allBytes)
				preIndex := index + 1
				for {
					if index = c.findEnd(buf[preIndex:readBytesNum]); index > -1 { //找末尾 \n
						callBack(con, buf[preIndex:preIndex+index+1])
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
			callBack(con, allBytes)
			allBytes = nil
			continue
		}
	}
	return rst
}

func (c Tcp) findEnd(buff []byte) int {
	for index, data := range buff {
		if data == '\n' {
			return index
		}
	}
	return -1
}

// func (c *TcpClient) printMsg(msg []byte) {
// 	fmt.Println("print", c.isLogin, string(msg))
// 	if c.isLogin {
// 		c.PrintMsg(c, msg)
// 		c.canUpHdTime()
// 	} else {
// 		c.Login(c, msg)
// 	}
// }
