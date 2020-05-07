package define

const (
	TIMBody_heart     = 110    //心跳
	TIMBody_login     = 110001 //登入
	TIMBody_loginOut  = 110002 //退出
	TIMBody_singleMsg = 110003 //发送私聊消息
	TIMBody_tipsMsg   = 110004
	//TIMBody_logLen          = 110004 //获取未读消息数量
	TIMBody_logSingleDetail = 110005 //获取私聊未读消息详情
	TIMBody_mucCreate       = 120001 //创建群
	TIMBody_mucDel          = 120002 //删除群
	TIMBody_mucJoin         = 120003 //加入群
	TIMBody_mucLeave        = 120004 //离开群
	TIMBody_mucMsg          = 120005 //发送群聊消息
	//TIMBody_logMucLen       = 120006 //获取群未读消息数量
	TIMBody_logMucDetail = 120006 //获取群聊未读消息详情
	TIMBody_bigCreate    = 130001 //创建大群
	TIMBody_bigDel       = 130002 //删除大群
	TIMBody_bigJoin      = 130003 //加入大群
	TIMBody_bigLeave     = 130004 //离开大群
	TIMBody_bigMsg       = 130005 //发送大群聊消息
)

type ChileBody map[string]interface{}

type BodyReq struct {
	Userid string
	Url    string
	Body   interface{}
}
type BodyRes struct {
	Userid string
	Body   interface{}
}
type BodyBigRes struct {
	Member GroupMember
	Body   interface{}
}
type BodyCallback struct {
	Token string
	Body  string
}
type TIMBody struct {
	Opt  int         `json:"opt"`
	Data interface{} `json:"data"`
}

type BodyLogin struct {
	Sign string `json:"sign"`
}

type ReadyLogin struct {
	Userid string `json:"userid"`
	Url    string `json:"url"`
	Sign   string `json:"sign"`
}

type CallBack struct {
	Opt    int
	Userid string
	Url    string
}

type BodyMsg struct {
	From string `json:"from"`
	To   string `json:"to"`
	Data string `json:"data"`
}

type BodyLogLen struct {
	From string `json:"from"`
}

type BodyLogDetail struct {
	From  string `json:"from"`
	Index int    `json:"index"`
}

type LogLen struct {
	From   string `json:"from"`
	Length int    `json:"length"`
}

type LogDetail struct {
	From  string `json:"from"`
	To    string `json:"to"`
	Data  string `json:"data"`
	Index int    `json:"index"`
}

type SingleTip struct {
	From string `json:"from"`
	Len  int    `json:"len"`
}
type GroupTip struct {
	Group string `json:"group"`
	Len   int    `json:"len"`
}
