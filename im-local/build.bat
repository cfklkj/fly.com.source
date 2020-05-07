

 
REM  cd /d  E:\gits\remote\gitMe\fly.com.webs
cd /d E:\gits\fly.com.source\fly.com.me\im-local\webs\test_rasp.im\goClient
call:linux32 %1
goto end

:windows
echo off
for /F %%i in ('c:\users\fly\bin\pathIndex.exe %1 -2') do ( set name=%%i)
go build -o %name%.exe %1 
echo build over -- %name%
goto end

:linux
echo off
set GORACH=amd64
set GOOS=linux
for /F %%i in ('c:\users\fly\bin\pathIndex.exe %1 -2') do ( set name=%%i)
go build -o %name% %1 
echo build over -- %name%
goto end


:linux32
echo off
set GOARCH=arm
set GOOS=linux
for /F %%i in ('c:\users\fly\bin\pathIndex.exe %1 -2') do ( set name=%%i)
go build -o %name% %1 
echo build over -- %name% 
goto end
 
:ssh
    mv test_rasp.im/goClient/goClient test_rasp.im/goClient/goClientRun 
    chmod 777 test_rasp.im/goClient/goClientRun 
    test_rasp.im/goClient/goClientRun
goto end
  

:end
 
rem  git add . & git commit -m 's' & git push rasp localim &
