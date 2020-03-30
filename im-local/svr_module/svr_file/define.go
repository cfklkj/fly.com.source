package svr_file

type S2CBody struct {
	Code int
	Data interface{}
}

type s_logLenReq struct {
	From string `json:"from"`
	To   string `json:"to"`
}
type s_logLen struct {
	From string `json:"from"`
	To   string `json:"to"`
	Len  int    `json:"len"`
}

type s_logIndex struct {
	From  string `json:"from"`
	To    string `json:"to"`
	Index int    `json:"index"`
}
type s_logInfo struct {
	From string `json:"from"`
	To   string `json:"to"`
	Data string `json:"data"`
}

type s_friend struct {
	User   string `json:"user"`
	Group  string `json:"group"`
	Friend string `json:"friend"`
}

type s_friends struct {
	User  string `json:"user"`
	Group string `json:"group"`
}

type s_friendsInfo struct {
	User   string   `json:"user"`
	Group  string   `json:"group"`
	Friend string   `json:"friend"`
	List   []string `json:"list"`
}
