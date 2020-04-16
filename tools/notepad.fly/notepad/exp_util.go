package notepad

import (
	"fmt"
	"path/filepath"
	"strings"
)

func (c *explorer) showMore(step *int) {
	if *step > 7 {
		fmt.Println("More ...")
		temp := ""
		fmt.Scanln(&temp)
		*step = 0
	}
	*step += 1
}

func (c *explorer) printPwd(pwd string, nodeName string, node *PathNameAttribute) {
	path := ""
	if node.Next != nil {
		path = pwd
		if nodeName != "" {
			path += nodeName + "/"
		}
		if strings.Contains(node.Guid, Ln_dir) {
			guid := strings.Replace(node.Guid, Ln_dir, "", -1)
			dirs, _ := c.getDBdir()
			pwdStr, _, _ := c.getPathNodeByGuid("", dirs, &guid)
			if pwdStr != "" {
				path += "\t--lnk--> " + pwdStr
			}
		}
	} else {
		path = pwd + nodeName
		guid := node.Guid
		if strings.Contains(node.Guid, Ln_file) {
			guid = strings.Replace(guid, Ln_file, "", -1)
			path += "\t--lnk--> "
		} else {
			path += "\t--> "
		}
		file := c.db.GetWorkPath() + "/" + guid
		file, _ = filepath.Abs(file)
		path += file
	}
	fmt.Println(path)

}
