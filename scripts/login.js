const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

async function login(){
    let canLogin = await isValid(usernameInput.value,passwordInput.value)
    localStorage.setItem("userData",usernameInput.value);
    if(canLogin != true){
        passwordInput.value = "";
        return;
    }
    window.location.href = 'tippen';
}

async function isValid(username,password){
    const request = await fetch(new URL(`https://getpantry.cloud/apiv1/pantry/06d8db87-5874-48d6-9b37-d05a763c8926/basket/TestData`));
    const data = await request.json();

    //let json = JSON.parse(data);
    if(data.hasOwnProperty(username)){
        if(data[username].password == password){
            return true
        }
        return "username"
    }
    return false;
}

async function register(){
    let exists = await isValid(usernameInput.value,passwordInput.value);
    if(exists == false){
        let url = 'https://getpantry.cloud/apiv1/pantry/06d8db87-5874-48d6-9b37-d05a763c8926/basket/TestData'; // Die URL der API
        let data = {
            [usernameInput.value]:{
                "password":passwordInput.value,
                "bets": "[]"
            }
        }; 

        await fetch(url, {
        method: 'PUT', // oder 'PATCH'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Daten in einen JSON-String umwandeln
        })

        login()
    }
}