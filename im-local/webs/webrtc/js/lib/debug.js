
//before use console.log(xx) call setConsolePrint to html element
function setConsolePrint(elId){  
    var logger = document.getElementById(elId);
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    }
}
