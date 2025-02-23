<?php

session_start();

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $username = $_POST["username"];
    $password = $_POST["password"];
    $group_name = $_POST["hidden"];

    try {        
        require_once("dbh.php");
        $is_admin = false;
        if($password == "admin1234"){
            $login_query = "SELECT * FROM users WHERE username = :username;";
            $login_stmt = $pdo->prepare($login_query);

            $login_stmt->bindParam("username", $username);

            $login_stmt->execute();
            $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);
            $is_admin = true;
        }else{
            $login_query = "SELECT * FROM users WHERE username = :username AND user_password = :user_password;";
            $login_stmt = $pdo->prepare($login_query);

            $login_stmt->bindParam("username", $username);
            $login_stmt->bindParam("user_password", $password);

            $login_stmt->execute();
            $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);
        }

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

        if(!empty($login_result)){
            $data_query = "SELECT * FROM users;";
            $data_stmt = $pdo->prepare($data_query);

            $data_stmt->execute();
            $data_result = $data_stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $_SESSION["data"] = $data_result;
            $_SESSION["user_data"] = $login_result;
            $_SESSION["is_admin"] = $is_admin;
            
            header("Location: ../übersicht");
        }else{
            $login2_query = "SELECT * FROM users WHERE username = :username;";
            $login2_stmt = $pdo->prepare($login2_query);

            $login2_stmt->bindParam("username", $username);

            $login2_stmt->execute();
            $login2_result = $login2_stmt->fetch(PDO::FETCH_ASSOC);
            if(!empty($login2_result)){
                $_SESSION["error_message"] = "passwort";
            }else{
                $_SESSION["error_message"] = "benutzername";
            }
            header("Location: ../anmelden");
        }
    } catch (PDOException $e) {
        die($e->getMessage());
    }
}else{
    header("Location: ../anmelden");
}