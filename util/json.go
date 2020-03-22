package util

import (
	"encoding/json"
)

func Str2Map(jsonData string) (result map[string]interface{}, err error) {
	err = json.Unmarshal([]byte(jsonData), &result)
	return result, err
}
func Map2Str(mapData map[string]interface{}) (result string, err error) {
	resultByte, errError := json.Marshal(mapData)
	result = string(resultByte)
	err = errError
	return result, err
}

func Str2Interface(jsonData string, res interface{}) bool {
	err := json.Unmarshal([]byte(jsonData), res)
	return err == nil
}
func Interface2Str(req interface{}) string {
	res, err := json.Marshal(req)
	if err == nil {
		return string(res)
	}
	return ""
}
