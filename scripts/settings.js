let editingName = false;
let editNameForm = document.getElementById("editNameForm")
let editNameinput = document.getElementById("editName")
let editNameButton = document.getElementById("editNameButton")
    
let editingPassword = false
let editPasswordForm = document.getElementById("editPasswordForm")
let editPasswordinput = document.getElementById("editPassword")
let editPasswordButton = document.getElementById("editPasswordButton")

editNameForm.addEventListener("submit", editName)
editPasswordForm.addEventListener("submit", editPassword)

if(document.querySelector('.notification-toggle').checked){
    setNotificationStatus(Notification.permission);
}

document.querySelector('.notification-toggle').addEventListener('change', function() {
    if(this.checked) {
        getPermission();
    }else{
        document.getElementById("notification-status").hidden = true;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/allowNotifications.php?enabled=" + (this.checked ? 1 : 0), true);
    xhr.send();
});

function editName(e){
    e.preventDefault();
    let input = editNameinput
    let editButton = editNameButton
    if(editingName == false){
        input.focus();
        input.disabled = false;
        editButton.innerHTML = "Speichern"
    }else{
        input.disabled = true;
        editButton.innerHTML = "Ändern"
        fetch("php/changePlayerName.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"input": input.value}),
        });
    }
    editingName = !editingName
}

function editPassword(e){
    e.preventDefault();
    let input = editPasswordinput
    let editButton = editPasswordButton
    if(editingPassword == false){
        input.focus();
        input.disabled = false;
        editButton.innerHTML = "Speichern"
        editingPassword = true;
    }else if (input.value != "") {
        input.disabled = true;
        editButton.innerHTML = "Ändern"
        fetch("php/changePlayerPassword.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"input": input.value}),
        });
        editingPassword = false;
    }
    input.value = "";
}

function getPermission(){
    setNotificationStatus("waiting");
    Notification.requestPermission().then((permission) =>{
        if(permission == "granted"){
            navigator.serviceWorker.ready.then((sw) => {
                sw.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array('BGraND_bLAZEjpeTMVQcOm4ggVmyIC4btqM6QoQZyQ8kiWjipzhRO0SlRbHa318rmN4PZhCPL1iijVCEEJoe-gE')
                }).then((subscription) => {
                    fetch("php/save-subscription.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(subscription),
                    });
                })
            })
            setNotificationStatus("granted");
        }else{
            setNotificationStatus("denied");
        }
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


function setNotificationStatus(status){
    let notificationStatus = document.getElementById("notification-status");
    if(status == "granted"){
        notificationStatus.innerHTML = "aktiviert";
        notificationStatus.style.color = "green";
    }else if(status == "denied"){
        notificationStatus.innerHTML = "blockiert";
        notificationStatus.style.color = "red";
    }else{
        notificationStatus.innerHTML = "Erlaubnis ausstehend...";
        notificationStatus.style.color = "gray";
    }
    notificationStatus.hidden = false;
}