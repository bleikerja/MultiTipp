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

    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: gray
        }

        .content {
            width: 300px;
            min-width: 300px;
            padding: 16px;
            background-color: white;
            border: 5px solid black;
            background-color: lightgray;
            border-radius: 25px;
            margin: 0 auto;
            margin-top: 50px;
            box-shadow: 0px 0px 20px grey;
            text-align: center;
        }

        h1 {
            color: black;
        }

        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #ccc;
            box-sizing: border-box;
        }

        input[type="button"] {
            background-color: #4CAF50;
            color: white;
            padding: 14px 20px;
            margin: 8px 0;
            border: none;
            cursor: pointer;
            width: 100%;
        }

        input[type="button"]:hover {
            opacity: 0.8;
        }

        input[type="submit"] {
            background-color: #4CAF50;
            color: white;
            padding: 14px 20px;
            margin: 8px 0;
            border: none;
            cursor: pointer;
            width: 100%;
        }

        input[type="submit"]:hover {
            opacity: 0.8;
        }

        input[type="checkbox"] {
            margin-right: 5px;
            transform: scale(1.5);
        }

        input{
            border-radius: 25px;
        }

        label {
            font-size: 14px;
        }

        .title{
            box-shadow: 0px 0px 20px grey;
            margin: auto;
            border: 5px solid black;
            margin-top: 20px;
            display: flex;
            justify-content:center;
            vertical-align: middle;
            width: fit-content;
            padding: 5px;
            border-radius: 25px;
            background-color: lightgray;
        }

        .titleText{
            text-align: center;
            margin: 0 20px;
            align-items: center;
            display: flex;
        }

        .main{
            font-size: xx-large;
            font-family: sans-serif;
            text-shadow: 2px 2px 3px #949494;
        }        

        #error{
            margin: 0;
            font-weight: bold;
            color: red;
            font-size: 14px;
        }

    </style>
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
        console.log(localStorage.getItem("userData"),document.referrer,localStorage.getItem("userData") && !document.referrer)
        if(localStorage.getItem("userData") && !document.referrer){
            console.log("setting")
            let userData = JSON.parse(localStorage.getItem("userData"))
            document.getElementById("username").value = userData.username
            document.getElementById("password").value = userData.password
            if(userData.autoLogin) document.getElementById("form").submit();
        }
        let errorText = document.getElementById("error")
        errorText.style.display = "none"
        if(document.referrer == document.URL){
            let errormessage =  '<?php echo isset($_SESSION["error_message"]) ? $_SESSION["error_message"]:""; ?>';
            console.log(errormessage)
            errorText.style.display = ""
            if(errormessage == "benutzername"){
                errorText.innerText = "falscher Benutzername"
            }else if(errormessage == "passwort"){
                errorText.innerText = "falsches Passwort"
            }else{
                errorText.style.display = "none"
            }
        }
    </script>    
</body>
</html>
