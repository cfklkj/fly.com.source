act:add|del|alt|ls
name:cmdName
tm:hh:mm | now
rate:[1|2|3] 1=once 2=alltime 3=workday
cmd:weather|funds|email
eg:list
eg:del 上杭天气
eg:add 上杭天气 6:00 2 "./weather -ww 上杭 -wu http://www.weather.com.cn/weather1d/101230705.shtml#around1 -wc 雨 -et 920667721@qq.com" 
eg:add 基金040025 14:30 3 "./funds -fn 040025 -fu http://fund.eastmoney.com/040025.html?spm=aladin -fs 3.810 -fb 3.315 -et 920667721@qq.com" 
eg:add 发送者邮件 now 1 "./email -es true -ef 812346943@qq.com -epwd irqmwxdwfernbbeb -et 920667721@qq.com"