package main

import (
	"./wss"
	"golang.org/x/net/websocket"
)

func main() {
	var wsurl = "ws://localhost:802/wss"
	var origin = "http://localhost:802/"
	ws, err := websocket.Dial(wsurl, "", origin)
	if err != nil {
		panic(err)
	}
	ws.Write(wss.MkLoginStr("admin@rasp", ""))
	wss.Read(ws)
}
