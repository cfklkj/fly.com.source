package util

import (
	"encoding/json"
	"errors"
)

//解析数据
func DecodeStruct(req interface{}, res interface{}) error {
	data, err := json.Marshal(req)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &res)
}

//消息体解析第一层
func DecodeBytes(req interface{}, res interface{}) error {
	switch req.(type) {
	case []byte:
		break
	default:
		return errors.New("req type error")
	}
	return json.Unmarshal(req.([]byte), &res)
}
