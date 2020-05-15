package email

import (
	"fmt"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

func getArg(tag string) string {
	L := len(os.Args)
	for i := 1; i < L; i++ {
		if os.Args[i] == tag {
			if i+1 < L {
				return os.Args[i+1]
			}
			return ""
		}
	}
	return ""
}
func help() {
	fmt.Println("eg:-ef fromQQemail -epwd fromQQpwd -et toEmail \n ")
}

func sendMail(from, pwd string, to string, asial, subject string, body string) error {
	//定义邮箱服务器连接信息，如果是阿里邮箱 pass填密码，qq邮箱填授权码
	mailConn := map[string]string{
		// "user": "xx@qq.com",
		"user": from,
		"pass": pwd,
		"host": "smtp.qq.com",
		"port": "465",
	}

	//定义收件人
	mailTo := []string{
		to,
	}

	port, _ := strconv.Atoi(mailConn["port"]) //转换端口类型为int

	m := gomail.NewMessage()
	m.SetHeader("From", asial+"<"+mailConn["user"]+">") //这种方式可以添加别名，即“XD Game”， 也可以直接用<code>m.SetHeader("From",mailConn["user"])</code> 读者可以自行实验下效果
	m.SetHeader("To", mailTo...)                        //发送给多个用户
	m.SetHeader("Subject", subject)                     //设置邮件主题
	m.SetBody("text/html", body)                        //设置邮件正文

	d := gomail.NewDialer(mailConn["host"], port, mailConn["user"], mailConn["pass"])

	err := d.DialAndSend(m)
	return err

}

func SendMail(sub, body string) {
	from := getArg("-ef")
	pwd := getArg("-epwd")
	to := getArg("-et")
	if from == "" || to == "" || pwd == "" {
		help()
		return
	}
	err := sendMail(from, pwd, to, "Tips", sub, body)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("send " + sub + " tips")
	}
}
