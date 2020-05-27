package main

import (
	"./email"
	"./fund"
	weather "./weaher"
)

func main() {
	// if !tickTimer.TimeTicker() {
	// 	return
	// }
	if email.SetEmailCfg() {
		return
	}
	if info := fund.GetFundInfo(); info != "" {
		email.SendMail("fund", info)
	}
	if info := weather.GetWeather(); info != "" {
		email.SendMail("weather", info)
	}
}
