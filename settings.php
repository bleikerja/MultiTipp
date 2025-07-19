<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="x-icon" href="logo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <title>Multi Tipp</title>
    <link rel="stylesheet" href="styles/settings.css?v=2">
    <link rel="stylesheet" href="styles/navBar.css?v=2">
</head>
<body>
    <div class="menu">
        <div class="menu-main">
        <img id="logo" src="logo.png" alt="logo" width="44" height="44">
        <a class="menu-button" id="link" href="übersicht">
            <div class="menu-item">Übersicht</div>
        </a>
        <a class="menu-button" href="tippen">
            <div class="menu-item">Tippen</div>
        </a>
        <!-- <a class="menu-button" href="statistiken">
            <div class="menu-item">Statistiken</div>
        </a> -->
        <a class="menu-button" href="gruppe">
            <div class="menu-item">Gruppe</div>
        </a>
        <a class="menu-button" href="hilfe">
            <div class="menu-item">Hilfe</div>
        </a>
        <a class="menu-button selected" href="einstellungen">
            <span role="button" class="menu-item selected material-symbols-outlined">settings</span>
        </a>
        <a class="menu-button logout hideBig" href="anmelden">
            <div class="menu-item logout">Ausloggen</div>
        </a>
        </div>
        <div class="menu-account">
            <a class="menu-button logout" href="anmelden">
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
                </span>
                <div class="menu-item logout">Ausloggen</div>
            </a>
        </div>
    </div>
    
    <div class="main">
        <h1>Einstellungen</h1>
        <form class="inputGroup" id="editNameForm">
            <div class="label">Name: </div>
            <div>
                <label for="editName" class="visually-hidden">Name</label>
                <input name="input" type="text" class="form-control" id="editName" placeholder="Name" value="<?php echo $_SESSION["user_data"]["username"] ?>" disabled>
            </div>
            <button type="submit" id="editNameButton" class="btn btn-secondary">Ändern</button>
        </form>
        <form class="inputGroup" id="editPasswordForm">
            <div class="label">Passwort: </div>
            <div>
                <label for="editPassword" class="visually-hidden">Passwort</label>
                <input name="input" type="password" class="form-control" id="editPassword" placeholder="neues Passwort" value="<?php echo $_SESSION["user_data"]["user_password"] ?>" disabled>
            </div>
            <button type="submit" id="editPasswordButton" class="btn btn-secondary">Ändern</button>
        </form>
    </div>
    <script src="scripts/settings.js"></script>
</body>
</html>