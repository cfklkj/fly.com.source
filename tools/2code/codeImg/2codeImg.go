//--https://www.jb51.net/article/179317.htm
package codeImg

import (
	"errors"
	"image"
	"image/draw"
	"image/png"
	"os"

	"github.com/nfnt/resize"
	"github.com/skip2/go-qrcode"
)

var err error

func CreateAvatar(content, pngPath string) (image.Image, error) {
	var (
		bgImg      image.Image
		offset     image.Point
		avatarFile *os.File
		avatarImg  image.Image
	)

	bgImg, err = createQrCode(content)

	if err != nil {
		return nil, err
	}
	avatarFile, err = os.Open(pngPath)
	if err != nil {
		return nil, err
	}
	avatarImg, err = png.Decode(avatarFile)
	if err != nil {
		return nil, err
	}
	avatarImg = ImageResize(avatarImg, 40, 40)
	b := bgImg.Bounds()

	// 设置为居中
	offset = image.Pt((b.Max.X-avatarImg.Bounds().Max.X)/2, (b.Max.Y-avatarImg.Bounds().Max.Y)/2)

	m := image.NewRGBA(b)

	draw.Draw(m, b, bgImg, image.Point{X: 0, Y: 0}, draw.Src)

	draw.Draw(m, avatarImg.Bounds().Add(offset), avatarImg, image.Point{X: 0, Y: 0}, draw.Over)

	return m, err
}

func createQrCode(content string) (img image.Image, err error) {
	var qrCode *qrcode.QRCode

	qrCode, err = qrcode.New(content, qrcode.Highest)

	if err != nil {
		return nil, errors.New("创建二维码失败")
	}
	qrCode.DisableBorder = true

	img = qrCode.Image(150)

	return img, nil
}

func ImageResize(src image.Image, w, h int) image.Image {
	return resize.Resize(uint(w), uint(h), src, resize.Lanczos3)
}

// func main() {
// 	var (
// 		bgFile    *os.File
// 		bgImg     image.Image
// 		qrCodeImg image.Image
// 		offset    image.Point
// 	)

// 	// 01: 打开背景图片
// 	bgFile, err = os.Open("C:\\Users\\fly\\Pictures\\im.png")
// 	if err != nil {
// 		fmt.Println("打开背景图片失败", err)
// 		return
// 	}

// 	defer bgFile.Close()

// 	// 02: 编码为图片格式
// 	bgImg, err = png.Decode(bgFile)
// 	if err != nil {
// 		fmt.Println("背景图片编码失败:", err)
// 		return
// 	}

// 	// 03: 生成二维码
// 	qrCodeImg, err = createAvatar()
// 	if err != nil {
// 		fmt.Println("生成二维码失败:", err)
// 		return
// 	}

// 	offset = image.Pt(426, 475)

// 	b := bgImg.Bounds()

// 	m := image.NewRGBA(b)

// 	draw.Draw(m, b, bgImg, image.Point{X: 0, Y: 0}, draw.Src)

// 	draw.Draw(m, qrCodeImg.Bounds().Add(offset), qrCodeImg, image.Point{X: 0, Y: 0}, draw.Over)

// 	// 上传至oss时这段要改
// 	i, _ := os.Create(path.Base("a2.png"))

// 	_ = png.Encode(i, m)

// 	defer i.Close()

// }
