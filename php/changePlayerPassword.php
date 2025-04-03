<?php
session_start();


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        require_once "../dbh.php";
        
        // Retrieve and sanitize input data
        $old_password = $_SESSION["user_data"]["user_password"];
        $data = json_decode(file_get_contents("php://input"), true);
        $password = $data["input"] ?? null;

        // Prepare and execute the update query
        $query = "UPDATE users SET user_password = :password WHERE user_password = :old_password;";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        $stmt->bindParam(':old_password', $old_password, PDO::PARAM_STR);
        $stmt->execute();

        // Retrieve the updated user data
        $login_query = "SELECT * FROM users WHERE user_password = :user_password;";
        $login_stmt = $pdo->prepare($login_query);
        $login_stmt->bindParam(':user_password', $password, PDO::PARAM_STR);
        $login_stmt->execute();
        $login_result = $login_stmt->fetch(PDO::FETCH_ASSOC);

        // Update session with new user data
        $_SESSION["user_data"] = $login_result;

        // Redirect to the previous page
        $previousPage = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'anmelden';
        header("Location: $previousPage");
        exit();
    } catch (Exception $e) {
        // Handle exceptions and errors
        error_log($e->getMessage());
        header("Location: anmelden");
        exit();
    }
} else {
    header("Location: anmelden");
    exit();
}