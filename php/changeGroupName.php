<?php

    session_start();
        
    if ($_SERVER["REQUEST_METHOD"]== "POST") {
        require_once("dbh.php");
        $old_group_name = json_encode($_SESSION["user_data"]["user_group"]);
        $username = json_encode($_SESSION["user_data"]["id"],JSON_UNESCAPED_UNICODE);
        $group_name = json_encode($_POST["input"],JSON_UNESCAPED_UNICODE);

        $query = "UPDATE groups SET group_name = $group_name WHERE group_admin = $username;";

        $stmt = $pdo->prepare($query);

        $stmt->execute();

        $query2 = "UPDATE users SET user_group = $group_name WHERE user_group = $old_group_name;";

        $stmt2 = $pdo->prepare($query2);

        $stmt2->execute();

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

