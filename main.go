package main

import (
	"./email"
	"./fund"
	"./tickTimer"
	weather "./weaher"
)

func main() {
	if !tickTimer.TimeTicker() {
		return
	}
	if info := fund.GetFundInfo(); info != "" {
		email.SendMail("fund", info)
	}
	if info := weather.GetWeather(); info != "" {
		email.SendMail("weather", info)
	}
}
