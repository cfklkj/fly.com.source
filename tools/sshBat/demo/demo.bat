
    
:test
root ff123456..     web.me:22 
cd /tmp && pwd   
exit

:get
-- go get info
root ff123456..     web.me:22
source /etc/profile && go get -v "github.com/nfnt/resize"
exit

:nfnt
-- down to local
root ff123456.. web.me:22
rm -rf /home/im/go/src/src/github.com/nfnt/resize/.git
cd /tmp && 7zr a resize.7z /home/im/go/src/src/github.com/nfnt 
down /tmp/resize.7z C:\Users\fly\AppData\Local\Temp
cmd 7zr x C:\Users\fly\AppData\Local\Temp\resize.7z -oC:\Users\fly\AppData\Local\Temp
exit
