<?php
    session_start();
    
    if ($_SERVER["REQUEST_METHOD"]== "POST") {
        require_once("dbh.php");
        $user_group = json_encode($_SESSION["user_data"]["user_group"],JSON_UNESCAPED_UNICODE);
        $new_user = json_encode($_POST["input"],JSON_UNESCAPED_UNICODE);

        $query = "UPDATE users SET group_invite = $user_group WHERE username = $new_user AND user_group IS NULL;";

        $stmt = $pdo->prepare($query);

        $stmt->execute();

        //echo json_encode($stmt);
        header("Location: ../gruppe");
    }else{
        header("Location: anmelden");
    }

    

