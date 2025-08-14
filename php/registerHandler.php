<?php

session_start();

if($_SERVER["REQUEST_METHOD"] == "POST"){
    header("Location: anmelden");
    exit();
}

$username = $_POST["username"];
$password = $_POST["password"];
$group_name = $_POST["hidden"] != "" ? $_POST["hidden"]: null;
try {
    require_once "../dbh.php";
    $test_query = "SELECT * FROM users WHERE username = :username;";
    $test_stmt = $pdo->prepare($test_query);

    $test_stmt->bindParam("username", $username);

    $test_stmt->execute();
    $test_result = $test_stmt->fetch(PDO::FETCH_ASSOC);

    if(empty($test_result)){
        $register_query = "INSERT INTO users (username,user_password,user_group) VALUES (:username,:user_password,:groupname);";
        $register_stmt = $pdo->prepare($register_query);

        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $register_stmt->bindParam("username", $username);
        $register_stmt->bindParam("user_password", $password_hash);
        $register_stmt->bindParam("groupname", $group_name);
        
        $register_stmt->execute();

        $data_query = "SELECT * FROM users;";
        $data_stmt = $pdo->prepare($data_query);

        $login_query = "SELECT * FROM users WHERE username = :username AND user_password = :user_password;";
        $login_stmt = $pdo->prepare($login_query);

        $login_stmt->bindParam("username", $username);
        $login_stmt->bindParam("user_password", $password_hash);

        $login_stmt->execute();
        $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);

        $data_stmt->execute();
        $data_result = $data_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $_SESSION["data"] = $data_result;
        $_SESSION["user_data"] = $login_result;
        
        header("Location: ../tippen");
    }else{
        header("Location: ../registrieren");
    }
} catch (PDOException $e) {
    die($e->getMessage());
}