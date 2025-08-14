<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: anmelden");
    exit();
}

try {
    require_once "../dbh.php";
    
    $old_password = $_SESSION["user_data"]["user_password"];
    $data = json_decode(file_get_contents("php://input"), true);
    $password = password_hash($data["input"], PASSWORD_DEFAULT);

    $query = "UPDATE users SET user_password = :new_password WHERE user_password = :old_password;";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':new_password', $password, PDO::PARAM_STR);
    $stmt->bindParam(':old_password', $old_password, PDO::PARAM_STR);
    $stmt->execute();

    $login_query = "SELECT * FROM users WHERE user_password = :user_password;";
    $login_stmt = $pdo->prepare($login_query);
    $login_stmt->bindParam(':user_password', $password, PDO::PARAM_STR);
    $login_stmt->execute();
    $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);

    $_SESSION["user_data"] = $login_result;

    $previousPage = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'anmelden';
    header("Location: $previousPage");
    exit();
} catch (Exception $e) {
    error_log($e->getMessage());
    header("Location: anmelden");
    exit();
}