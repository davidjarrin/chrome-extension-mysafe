document.addEventListener('DOMContentLoaded', function () {
    showConfigurationLocalStorage();

    var form = document.querySelector('#formulario');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('submit');
        saveConfigurationLocalStorage();
    })

}, false);

function showConfigurationLocalStorage() {
    console.log("mostrando local configuration");
    chrome.storage.local.get(['ip', 'clientID', 'clientSecret'])
        .then(function (data) {
            if (data.ip === undefined || data.clientID === undefined || data.clientSecret === undefined) {
                confirm('Please fill the next values of A2A senhasegura');
            } else {
                document.querySelector("input[name='senhaseguraIP']").value = data.ip;
                document.querySelector("input[name='clientID']").value = data.clientID;
                document.querySelector("input[name='clientSecret']").value = data.clientSecret;
            }
        })
        .catch(function (err) {
            alert("Error getting values of Local Storage, Refresh the page, please");
            return;
        });
}

function saveConfigurationLocalStorage() {
    chrome.storage.local.set({
        ip: document.querySelector("input[name='senhaseguraIP']").value,
        clientID: document.querySelector("input[name='clientID']").value,
        clientSecret: document.querySelector("input[name='clientSecret']").value
    })
        .then(function () {
            getInformationLocalApi();
            alert("Configuration stored successfully")
            console.log("IP, ClientID, Client Secret stored in LocalStorage");
        })
        .catch(function (err) {
            console.log("Error satoring IP, ClientID, Client Secret in LocalStorage");
        });
}

// function getInformationA2A() {
//     //todo
//     // get json of api and save the ip/hostname in a temp file
//     const dataLocalStorage = chrome.storage.local.get(['ip', 'clientID', 'clientSecret']).then(data => { return data }).catch(err => { alert("Eror datos local storage") });

//     const fetchCredentials = dataLocalStorage.then(data => {
//         return fetch(`https://${data.ip}/iso/oauth2/token`, {
//             method: 'POST',
//             body: 'grant_type=client_credentials&client_id=' + data.clientID + '&client_secret=' + data.clientSecret,
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             }
//         }).then(function (resp) {
//             return resp.json();
//         }).then(function (data1) {
//             return data1.access_token;
//         })
//             // .then(function(access_token){

//             //     // return fetch(`https://${data.ip}/iso/pam/credential/12`, {
//             //     //     method: 'GET',
//             //     //     credentials: 'include',
//             //     //     headers: {
//             //     //         Authorization: 'Bearer ' + access_token,
//             //     //     }
//             //     // })
//             //     //     .then(resp => resp.json())
//             //     //     .then(json => JSON.stringify(json))
//             //     //     .catch(function (err) {
//             //     //         alert("A2A API Senhasegura no disponible para obtener credenciales");
//             //     //     });
//             // })
//             .catch(function (err) {
//                 alert("A2A API Senhasegura no disponible");
//             });
//     });

//     fetchCredentials.then(data => console.log(data));
// }


function getInformationLocalApi() {
    fetch(`http://localhost:8081/credentials`, {
        method: 'GET',
    })
        .then(resp => resp.json())
        .then(function (json) {
            let arrayManagementIP = new Array();
            json.credentials.forEach(element => {
                arrayManagementIP.push([element.id, element.management_ip]);
            });
            chrome.storage.local.set({ 'credentials': arrayManagementIP })
                .then(function () {
                    console.log('Management IPs Save');
                })
                .catch(function (err) {
                    console.log('Error guardando Management IPs Save')
                })
        })
        .catch(function (err) {
            alert("API not available, please verified connection");
        });
}