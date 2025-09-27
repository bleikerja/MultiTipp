<?php
session_start();

if (isset($_GET['enabled'])) {
    save($_GET['enabled']);
}

function save($enabled) {
    require_once "../dbh.php";

    $userId = $_SESSION['user_data']['id'];

    $stmt = $pdo->prepare(query: "
        UPDATE users
        SET notifications = ?
        WHERE id = ?
    ");
    
    $stmt->execute([
        $enabled,
        $userId
    ]);

    $_SESSION['user_data']['notifications'] = $enabled;
    echo json_encode($enabled);
}