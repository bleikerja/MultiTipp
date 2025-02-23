<?php
session_start();


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        require_once("dbh.php");
        
        // Retrieve and sanitize input data
        $old_playername = $_SESSION["user_data"]["username"];
        $playername = $_POST["input"];

        // Prepare and execute the update query
        $query = "UPDATE users SET username = :playername WHERE username = :old_playername;";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':playername', $playername, PDO::PARAM_STR);
        $stmt->bindParam(':old_playername', $old_playername, PDO::PARAM_STR);
        $stmt->execute();

        // Retrieve the updated user data
        $login_query = "SELECT * FROM users WHERE username = :username;";
        $login_stmt = $pdo->prepare($login_query);
        $login_stmt->bindParam(':username', $playername, PDO::PARAM_STR);
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
        header("Location: error.php");
        exit();
    }
} else {
    header("Location: anmelden");
    exit();
}

function debug_to_console($data) {
    $output = is_array($data) ? implode(',', $data) : $data;
    echo "<script>console.log('Debug Objects: " . addslashes($output) . "');</script>";
}
