package define

type BodyMucMsg struct {
	From  string `json:"from"`
	Group string `json:"group"`
	Data  string `json:"data"`
}

type Group struct {
	Group string `json:"group"` // fmt  user@group.muc
}

type GroupMember struct {
	Group  string `json:"group"`
	Userid string `json:"userid"`
}

type BodyMucLogDetail struct {
	Group string `json:"group"`
	Index int    `json:"index"`
}

type MucLogLen struct {
	Group  string `json:"group"`
	Length int    `json:"length"`
}

type MucLogDetail struct {
	From  string `json:"from"`
	Group string `json:"group"`
	Data  string `json:"data"`
	Index int    `json:"index"`
}
