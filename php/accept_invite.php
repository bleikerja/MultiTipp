<?php 
session_start();

require_once "../dbh.php";
$username = $_SESSION["user_data"]["username"];
$group_name = $_SESSION["user_data"]["group_invite"];

$query = "UPDATE users SET group_invite = NULL, user_group = '$group_name' WHERE username = '$username';";

$stmt = $pdo->prepare($query);

$stmt->execute();


$login_query = "SELECT * FROM users WHERE username = :username;";
$login_stmt = $pdo->prepare($login_query);

$login_stmt->bindParam("username", $username);

$login_stmt->execute();
$login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);

$_SESSION["user_data"] = $login_result;

header("Location: ../gruppe");