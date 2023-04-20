document.addEventListener('DOMContentLoaded', function () {
    syncBtn = document.querySelector('#syncBtn');
    syncBtn.addEventListener('click', function () {
        getInformationLocalApi();
    })

    var deleteStorage = document.querySelector('#deleteStorage');
    deleteStorage.addEventListener('click', function(){
        chrome.storage.local.clear()
        .then(function(){
            console.log('Local Stoage Deleted');
        })
    });

}, false);

function getInformationLocalApi() {
    fetch(`http://localhost:8081/credentials`, {
        method: 'GET',
    })
        .then(resp => resp.json())
        .then(function(json){
            let arrayManagementIP = new Array();
            json.credentials.forEach(element => {
                arrayManagementIP.push(element.management_ip);
            });
            chrome.storage.local.set({'credentials':arrayManagementIP})
            .then(function(){
                console.log('Management IPs Save');
            })
            .catch(function(err){
                console.log('Error guardando Management IPs Save')
            })
        })
        .catch(function (err) {
            alert("A2A API Senhasegura no disponible para obtener credenciales");
        });
}