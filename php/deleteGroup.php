<?php

    session_start();
        
    if ($_SERVER["REQUEST_METHOD"]== "POST") {
        require_once("dbh.php");
        $username = json_encode($_SESSION["user_data"]["id"],JSON_UNESCAPED_UNICODE);
        $group_name = json_encode($_SESSION["user_data"]["user_group"],JSON_UNESCAPED_UNICODE);

        $query = "DELETE FROM groups WHERE group_admin = $username;";

        $stmt = $pdo->prepare($query);

        $stmt->execute();

        $query2 = "UPDATE users SET user_group = NULL,group_invite = NULL WHERE user_group = $group_name OR group_invite = $group_name;";

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