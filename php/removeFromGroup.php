<?php
    session_start();
    
    if ($_SERVER["REQUEST_METHOD"]== "POST") {
        require_once "../dbh.php";
        $remove_user = json_encode($_POST["input"],JSON_UNESCAPED_UNICODE);

        $query = "UPDATE users SET user_group = NULL, group_invite = NULL WHERE username = $remove_user;";

        $stmt = $pdo->prepare($query);

        $stmt->execute();

        $username = $_SESSION["user_data"]["username"];

        $login_query = "SELECT * FROM users WHERE username = :username;";
        $login_stmt = $pdo->prepare($login_query);
        
        $login_stmt->bindParam("username", $username);
        
        $login_stmt->execute();
        $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);
        
        $_SESSION["user_data"] = $login_result;

        header("Location: ../gruppe");
    }else{
        header("Location: anmelden");
    }