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

