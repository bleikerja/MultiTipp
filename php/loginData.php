<?php

session_start();

require_once("dbh.php");

$username = $_SESSION["user_data"]["username"];
$password = $_SESSION["user_data"]["user_password"];

$login_query = "SELECT * FROM users WHERE username = :username AND user_password = :user_password;";
$login_stmt = $pdo->prepare($login_query);

$login_stmt->bindParam(":username", $username);
$login_stmt->bindParam(":user_password", $password);

$login_stmt->execute();
$login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($login_result);


