<?php

    session_start();
    if (isset($_GET['data'])) {
        save($_GET['data']);
    }

    function save($data){
        require_once("dbh.php");

        $username = $_SESSION["user_data"]["username"];
        $password = $_SESSION["user_data"]["user_password"];
        $bet_date = $data;



        $query = "UPDATE users SET last_bet_date = ? WHERE username = ? AND user_password = ?;";
        $stmt = $pdo->prepare($query);

        $stmt->execute([$bet_date, $username, $password]);

        echo json_encode($stmt);
    }
    

