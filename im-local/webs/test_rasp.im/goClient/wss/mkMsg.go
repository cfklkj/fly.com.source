package wss

type LoginInfo struct {
	Login  string `json:"login"`
	Passwd string `json:"passwd"`
}

type MsgInfo struct {
	From string `json:"from"`
	To   string `json:"to"`
	Data string `json:"data"`
}

const (
	Opt_ssh       = 99
	Opt_shutdown  = 100
	Opt_playMusic = 101
)

type ActInfo struct {
	Opt  int    `json:"opt"`
	Data string `json:"data"`
}
