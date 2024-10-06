<?php

    session_start();
    if (isset($_GET['data'])) {
        save($_GET['data']);
    }

    function save($data){
        require_once("dbh.php");
        $username = json_encode($_SESSION["user_data"]["username"],JSON_UNESCAPED_UNICODE);
        $password = json_encode($_SESSION["user_data"]["user_password"],JSON_UNESCAPED_UNICODE);
        $user_data = json_encode($data,JSON_UNESCAPED_UNICODE);

        $query = "UPDATE users SET user_data = $user_data WHERE username = $username AND user_password = $password;";
        $stmt = $pdo->prepare($query);

        //$stmt->bindParam("user_data", "data");

        $stmt->execute();

        echo $user_data;
    }
    

