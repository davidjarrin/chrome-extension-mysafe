chrome.storage.local.get(['credentials'])
    .then((result) => {
        let arrayCredentials = result.credentials;
        for(let i = 0; i < arrayCredentials.length; i++){
            // console.log(arrayCredentials[i]);
            var urlElement = new URL(arrayCredentials[i][1]);
            var urlActualTab = new URL(document.URL);
            // console.log(urlElement);
            // console.log(urlActualTab);
            if (urlElement.href === urlActualTab.href) {
                let ingresoCredencial = confirm("Detected stored credential in his vault, Do you want to enter it in this web page?");
                if (ingresoCredencial) {
                    // console.log(arrayCredentials[i][0]);
                    getInformationCredentialsLocalApi(arrayCredentials[i][0])
                        .then(function (data) {
                            return data;
                        }).then(function (result) {
                            let confirmUsername = confirm("Please, clic on the Username and Password fields, respectively");
                            if (confirmUsername) {
                                waitClick()
                                    .then(function (ev) {
                                        let confirmeInputUsername = confirm('Do you want to enter here the Username?')
                                        if (confirmeInputUsername) {
                                            ev.target.value = result[0];
                                        }
                                        waitClick()
                                            .then(function (ev) {
                                                let confirmeInputPassword = confirm('Do you want to enter here the Password?')
                                                if (confirmeInputPassword && ev.target.type.toLowerCase() ==='password') {
                                                    ev.target.value = result[1];
                                                }
                                                else{
                                                    alert('It is not possible enter a password in this field, please, refresh the page and try again.')
                                                }
                                            })
                                    })
                                    .catch(function (err) {
                                        console.log('error clic username ' + err);
                                    })
                            }
                        })
                        .catch(function (err) {
                            alert('Error getting credentials values from API');
                        });
                }
                break;
            }
        }
    }).catch((err) => {
        alert('Error getting information from Local Storage');
    });

function getInformationCredentialsLocalApi(id) {
    return fetch(`http://localhost:8081/credentials/${id}`, {
        method: 'GET',
    })
        .then(resp => resp.json())
        .then(function (json) {
            return [json.credential.username, json.credential.password]
        });
}

async function waitClick() {
    let elementoBody = document.querySelector('body');
    const promise = new Promise((resolve, reject) => {
        elementoBody.addEventListener('click', resolve)
        // cancel.addEventListener('click', reject)
    })

    return promise;
}


