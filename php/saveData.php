<?php

    session_start();
    if (isset($_GET['data']) && isset($_GET['index'])) {
        save($_GET['data'], $_GET['index']);
    }

    function save($data, $index){
        require_once "../dbh.php";
        $username = $_SESSION["user_data"]["username"];
        $password = $_SESSION["user_data"]["user_password"];
        
        $login_query = "SELECT * FROM users WHERE username = :username AND user_password = :user_password;";
        $login_stmt = $pdo->prepare($login_query);
        
        $login_stmt->bindParam(":username", $username);
        $login_stmt->bindParam(":user_password", $password);
        
        $login_stmt->execute();
        $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);
        
        $decodedIndex = (int)$index;
        $bet_data = json_decode($login_result["user_data"],associative: true);
        $bet_data[$decodedIndex] = json_decode($data,true);

        $user_data = json_encode($bet_data,JSON_UNESCAPED_UNICODE);

        $query = "UPDATE users SET user_data = ? WHERE username = ? AND user_password = ?;";
        $stmt = $pdo->prepare($query);

        $stmt->execute([$user_data, $username, $password]);

        echo json_encode($bet_data[$decodedIndex]);
    }
    

