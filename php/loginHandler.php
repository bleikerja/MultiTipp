<?php

session_start();

if($_SERVER["REQUEST_METHOD"] != "POST"){
    header("Location: ../anmelden");
    exit();
}

$username = $_POST["username"];
$password = $_POST["password"];
$group_name = $_POST["hidden"];

try {        
    require_once "../dbh.php";
    $is_admin = $password == "admin1234";

    $login_query = "SELECT * FROM users WHERE username = :username;";
    $login_stmt = $pdo->prepare($login_query);

    $login_stmt->bindParam("username", $username);

    $login_stmt->execute();
    $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);

    if($group_name != ""){
        $group_query = "SELECT * FROM groups WHERE group_name = :groupname;";
        $group_stmt = $pdo->prepare($group_query);

        $group_stmt->bindParam("groupname", $group_name);

        $group_stmt->execute();
        $group_result = $group_stmt->fetch(PDO::FETCH_ASSOC);
    
        if(!empty($group_result)){
            $query = "UPDATE users SET user_group = :group_name WHERE username = :username AND user_group IS NULL;";

            $stmt = $pdo->prepare($query);

            $stmt->bindParam("username", $username);
            $stmt->bindParam("group_name", $group_name);
            $stmt->execute();
        }
    }

    if(!empty($login_result) && (password_verify($password, $login_result["user_password"]) || $is_admin)){
        $data_query = "SELECT * FROM users;";
        $data_stmt = $pdo->prepare($data_query);

        $data_stmt->execute();
        $data_result = $data_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $_SESSION["data"] = $data_result;
        $_SESSION["user_data"] = $login_result;
        $_SESSION["is_admin"] = $is_admin;
        
        header("Location: ../übersicht");
    }else{
        $_SESSION["error_message"] = empty($login_result) ? "benutzername" : "passwort";
        header("Location: ../anmelden");
    }
} catch (PDOException $e) {
    die($e->getMessage());
}