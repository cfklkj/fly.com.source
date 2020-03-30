package svr_tcp

type loginInfo struct {
	Login  string `json:"login"`
	Passwd string `json:"passwd"`
}

type online struct {
	Online string `json:"online"`
}
type offline struct {
	Offline string `json:"offline"`
}

type MsgInfo struct {
	From string `json:"from"`
	To   string `json:"to"`
	Data string `json:"data"`
}
