
 
cd /d E:\gits\fly.com.build\tools
call:windows %1
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

:end