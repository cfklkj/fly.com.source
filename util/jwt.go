package util

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func GenerateToken(userid, key string) (string, error) {
	mapClaims := make(jwt.MapClaims)
	mapClaims["userid"] = userid

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, mapClaims)
	return token.SignedString([]byte(key))
}
func GenerateAppToken(appid, key string) (string, error) {
	mapClaims := make(jwt.MapClaims)
	mapClaims["appid"] = appid
	mapClaims["exp"] = time.Now().Add(24 * time.Hour).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, mapClaims)
	return token.SignedString([]byte(key))
}

func GetTokenMapClaims(tokenStr, key string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(key), nil
	})

	if err != nil {
		return "", err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["userid"].(string), nil
	}
	return "", errors.New("no find value")
}

func GetUserSplit(userid string) (head string, tail string, err error) {
	data := strings.Split(userid, "@")
	if len(data) < 2 {
		return "", "", errors.New("err userid format: eg--x@x")
	}
	head = data[0]
	tail = data[1]
	return head, tail, nil
}

func GetGroupSplit(group string) (head string, tail string, err error) {
	data := strings.Split(group, "@")
	if len(data) < 2 {
		return "", "", errors.New("err group format: eg--x@x.muc")
	}
	head = data[0]
	tail = data[1]
	if !strings.Contains(tail, ".muc") {
		return "", "", errors.New("err group format: eg--x@x.muc")
	}
	return head, tail, nil
}

func GetBigGroupSplit(group string) (head string, tail string, err error) {
	data := strings.Split(group, "@")
	if len(data) < 2 {
		return "", "", errors.New("err group format: eg--x@x.L.muc")
	}
	head = data[0]
	tail = data[1]
	if !strings.Contains(tail, ".L.muc") {
		return "", "", errors.New("err group format: eg--x@x.L.muc")
	}
	return head, tail, nil
}
