<?php
    session_start();
    if (isset($_GET['data']) && isset($_GET['user'])) {
        save($_GET['data'], $_GET['user']);
    }

    function save($data,$user){
        require_once("dbh.php");
        $user_data = json_encode($data,JSON_UNESCAPED_UNICODE);
        $username = json_encode($user,JSON_UNESCAPED_UNICODE);

        $query = "UPDATE users SET user_points = $user_data WHERE username = $username;";
        $stmt = $pdo->prepare($query);

        //$stmt->bindParam("user_data", "data");

        $stmt->execute();

        echo $query;
    }
    

