<?php

require_once "../dbh.php";
$stmt = $pdo->query("SELECT id, user_password FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($users as $user) {
    $plainPassword = $user['user_password'];

    // Skip if already hashed (basic check: bcrypt hashes start with $2y$)
    if (strpos($plainPassword, '$2y$') === 0) {
        continue; 
    }

    // Hash the password
    $hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

    // Update in database
    $update = $pdo->prepare("UPDATE users SET user_password = :new_password WHERE id = :id");
    $update->execute([
        'new_password' => $hashedPassword,
        'id'       => $user['id']
    ]);
}