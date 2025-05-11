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
        <form action="php/registerHandler.php" method="post" id="form">
            <h1>Registrieren</h1>
            <input type="text" id="username" name="username" placeholder="Benutzername"><br><br>
            <input type="password" id="password" name="password" placeholder="Passwort"><br>
            <input type="text" id="hidden" name="hidden" style="display:none" placeholder="" value="<?php echo isset($_GET['invite']) ? htmlspecialchars($_GET['invite']):"";?>">
            <input type="submit" value="Registrieren">
            
        </form>
    </div>

    <div class="content" style="margin-top:20px">
        <form action="anmelden<?php echo isset($_GET['invite']) ? '?invite='.htmlspecialchars($_GET['invite']) : ''; ?>" id="form">
            <input type="submit" value="Anmelden">
        </form>
    </div>


<script src="scripts/login.js"></script>       
</body>


</html>
