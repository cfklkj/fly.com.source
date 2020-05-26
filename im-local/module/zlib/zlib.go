package tls

/*
https://www.cnblogs.com/zhangqingping/p/4323240.html
*/
import (
	"bytes"
	"compress/gzip"
	"compress/zlib"
	"encoding/base64"
	"io"
	"net/url"
	"strings"
)

//进行zlib压缩
func DoZlibCompress(src []byte) []byte {
	var in bytes.Buffer
	w := zlib.NewWriter(&in)
	w.Write(src)
	w.Close()
	return in.Bytes()
}

//进行zlib解压缩
func DoZlibUnCompress(compressSrc []byte) ([]byte, error) {
	b := bytes.NewReader(compressSrc)
	var out bytes.Buffer
	r, err := zlib.NewReader(b)
	if err != nil {
		return nil, err
	}
	io.Copy(&out, r)
	return out.Bytes(), err
}

//进行gzip压缩
func DogzipCompress(src []byte) []byte {
	var in bytes.Buffer
	w := gzip.NewWriter(&in)
	w.Write(src)
	w.Close()
	return in.Bytes()
}

//进行gzip解压缩
func DogzipUnCompress(compressSrc []byte) ([]byte, error) {
	b := bytes.NewReader(compressSrc)
	var out bytes.Buffer
	r, err := gzip.NewReader(b)
	if err != nil {
		return nil, err
	}
	io.Copy(&out, r)
	return out.Bytes(), err
}

func encodeURIComponent(str string) string {
	encodeurl := url.QueryEscape(str)
	encodeurl = strings.Replace(encodeurl, "+", "%20", -1)
	return encodeurl
}
func decodeURIComponent(encodeurl string) string {
	decodeurl, err := url.QueryUnescape(encodeurl)
	if err != nil {
		return ""
	}
	//	encodeurl = strings.Replace(encodeurl, "%20", "+", -1)
	return decodeurl
}

//js zip
func Jszip(jsonStr string) string {
	en := encodeURIComponent(jsonStr)
	tmps := DogzipCompress([]byte(en))
	return base64.StdEncoding.EncodeToString(tmps)
}

func Jsunzip(encodeStr string) string {
	de, err := base64.StdEncoding.DecodeString(encodeStr)
	if err != nil {
		return ""
	}
	tmps, err2 := DogzipUnCompress(de)
	if err2 != nil {
		return ""
	}
	return decodeURIComponent(string(tmps))
}
