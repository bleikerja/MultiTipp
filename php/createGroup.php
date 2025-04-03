<?php

session_start();

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $group_name = json_encode($_POST["input"],JSON_UNESCAPED_UNICODE);
    $input = $_POST["input"];
    $userId = json_encode($_SESSION["user_data"]["id"],JSON_UNESCAPED_UNICODE);

    try {
        require_once "../dbh.php";

        $group_query = "INSERT INTO groups (group_name,group_admin) VALUES ($group_name,$userId);";
        $group_stmt = $pdo->prepare($group_query);

        $group_stmt->execute();

        $username = $_SESSION["user_data"]["username"];

        $query = "UPDATE users SET user_group = :group_name WHERE username = :username";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam("username", $username);
        $stmt->bindParam("group_name", $input);

        $stmt->execute();


        $login_query = "SELECT * FROM users WHERE username = :username;";
        $login_stmt = $pdo->prepare($login_query);

        $login_stmt->bindParam("username", $username);

        $login_stmt->execute();
        $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);

        $_SESSION["user_data"] = $login_result;

        header("Location: ../gruppe");
    } catch (PDOException $e) {
        die($e->getMessage());
    }
}else{
    header("Location: anmelden");
}