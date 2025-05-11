<?php
    session_start();

?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="x-icon" href="logo.png">
    <title>Multi Tipp</title>
    <link rel="stylesheet" href="styles/login.css">
</head>
<body>
    <div class="title">
        <img class="logo" src="logo.png" alt="logo" width="80" height="80">
        <div class="titleText">
            <div class="main">MultiTipp</div>
        </div>
        <img class="logo" src="logo.png" alt="logo" width="80" height="80">
    </div>

    <div class="content">
        <form action="php/loginHandler.php" method="post" id="form">
            <h1>Anmelden</h1>
            <input type="text" id="username" name="username" placeholder="Benutzername" autocomplete="off" required><br><br>
            <input type="password" id="password" name="password" placeholder="Passwort" autocomplete="off" required><br>
            <input type="text" id="hidden" name="hidden" style="display:none" placeholder="" value="<?php echo isset($_GET['invite']) ? htmlspecialchars($_GET['invite']):"";?>">
            <p id="error">falscher Benutzername</p>
            <input type="submit" value="Anmelden">
        </form>
        
    </div>

    <div class="content" style="margin-top:20px">
        <form action="registrieren">
            <input type="submit" value="Registrieren">
        </form>
    </div>

    <script>
        let errormessage = '<?php echo isset($_SESSION["error_message"]) ? $_SESSION["error_message"]:""; ?>';
        let errorText = document.getElementById("error")
        errorText.style.display = "none"
        if(document.referrer == document.URL && errormessage != ""){
            errorText.style.display = ""
            if(errormessage == "benutzername"){
                errorText.innerText = "falscher Benutzername"
            }else if(errormessage == "passwort"){
                errorText.innerText = "falsches Passwort"
            }else{
                errorText.style.display = "none"
            }
        }else{
            if(localStorage.getItem("userData") && (!document.referrer || JSON.parse(localStorage.getItem("userData")).forceLogin) ){
                let userData = JSON.parse(localStorage.getItem("userData"))
                document.getElementById("username").value = userData.username
                document.getElementById("password").value = userData.password
                if(userData.autoLogin) document.getElementById("form").submit();
            }   
        }
    </script>    
</body>
</html>
