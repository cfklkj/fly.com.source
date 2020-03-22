package util

import (
	"encoding/json"
	"fmt"
	"math/big"
	"net"
	"reflect"
)

func Typeof1(v interface{}) {
	fmt.Println("typeof", reflect.TypeOf(v).String())
}

func Encode(data interface{}) ([]byte, error) {
	buf, err := json.Marshal(data)
	return buf, err
}

func Decode(data []byte, to interface{}) error {
	err := json.Unmarshal(data, to)
	return err
}

// func Encode(data interface{}) ([]byte, error) {
// 	buf := bytes.NewBuffer(nil)
// 	enc := gob.NewEncoder(buf)
// 	err := enc.Encode(data)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return buf.Bytes(), nil
// }

// func Decode(data []byte, to interface{}) error {
// 	buf := bytes.NewBuffer(data)
// 	dec := gob.NewDecoder(buf)
// 	return dec.Decode(to)
// }

//ip地址转换
func InetNtoA(ip int64) string {
	return fmt.Sprintf("%d.%d.%d.%d",
		byte(ip>>24), byte(ip>>16), byte(ip>>8), byte(ip))
}

func InetAtoN(ip string) int64 {
	ret := big.NewInt(0)
	ret.SetBytes(net.ParseIP(ip).To4())
	return ret.Int64()
}
