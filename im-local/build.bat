goto %1
goto end

:build
call:windows .\localIm\localIm.go
goto end
:linux
set pathT=%~dp1
cd /d %pathT%
set GOARCH=amd64
set GOOS=linux
go build -o E:\gits\fly.com.build\tools\localIm -i %1 
echo over localIm
goto end
:windows
go build -o E:\gits\fly.com.build\tools\localIm.exe -i %1 
echo over localIm.exe
goto end

:up 
set svr=flylkl@fly.lkl:/tmp
scp %2 %svr%
goto end

:upw 
set svr=im@im.guiruntang.club:/tmp
scp %2 %svr%
goto end

:end

