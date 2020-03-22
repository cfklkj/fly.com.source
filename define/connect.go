package define

const (
	C_connect_login = 1
	C_connect_err   = -1
)

type C_connect struct {
	Userid string
	Rst    int
}
