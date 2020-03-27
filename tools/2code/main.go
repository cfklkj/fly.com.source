//--https://blog.csdn.net/wangshubo1989/article/details/77897363

package main

import (
	"fmt"
	"image/png"
	"os"
	"path"
	"path/filepath"

	"./codeImg"
	encode "github.com/skip2/go-qrcode"
	"github.com/tuotoo/qrcode"
)

func main() {
	if len(os.Args) < 2 {
		goto end
	}
	switch os.Args[1] {
	case "-emg":
		if len(os.Args) < 5 {
			break
		}
		qrCodeImg, err := codeImg.CreateAvatar(os.Args[2], os.Args[3])
		if err != nil {
			fmt.Println("生成二维码失败:", err)
			return
		}

		i, err := os.Create(path.Base(os.Args[4]))
		if err != nil {
			fmt.Println("生成二维码失败:", err)
			return
		}
		defer i.Close()
		err = png.Encode(i, qrCodeImg)
		if err != nil {
			fmt.Println("生成二维码失败:", err)
			return
		}
		fmt.Println(path.Base(os.Args[4]))
		return
	case "-e":
		if len(os.Args) < 4 {
			break
		}
		err := encode.WriteFile(os.Args[2], encode.Medium, 256, os.Args[3])
		if err != nil {
			fmt.Println("err--", err.Error())
		} else {
			path, err := filepath.Abs(os.Args[3])
			if err != nil {
				fmt.Println("err--", err.Error())
			} else {
				fmt.Println(path)
			}
		}
		return
	case "-d":
		if len(os.Args) < 3 {
			break
		}
		fi, err := os.Open(os.Args[2])
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		defer fi.Close()
		qrmatrix, err := qrcode.Decode(fi)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		fmt.Println(qrmatrix.Content)
		return
	default:
	}
end:
	fmt.Println("eg: -e hello fullPath.png\n-emg hello head.png keepto.png\n-d hello.png")
}
