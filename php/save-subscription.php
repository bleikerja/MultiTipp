<?php
session_start();

require_once("dbh.php");

// Get subscription data
$subscription = json_decode(file_get_contents("php://input"), true);
$userId = $_SESSION['user_data']['id'];

$stmt = $pdo->prepare(query: "
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) 
    VALUES (?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE last_active = CURRENT_TIMESTAMP
");
$stmt->execute([
    $userId,
    $subscription["endpoint"],
    $subscription["keys"]["p256dh"],
    $subscription["keys"]["auth"]
]);

