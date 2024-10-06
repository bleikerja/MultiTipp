<?php

session_start();
if (isset($_GET['data']) && isset($_GET['user']) && isset($_GET['match'])) {
    change($_GET['data'], $_GET['user'], $_GET['match']);
}

function change($data, $user, $match) {
    require_once("dbh.php");

    $search_query = "SELECT * FROM fixes WHERE game_id = :matchId AND user = :user;";
    $search_stmt = $pdo->prepare($search_query);

    $search_stmt->bindParam(":matchId", $match);
    $search_stmt->bindParam(":user", $user);

    $search_stmt->execute();
    $search_result = $search_stmt->fetch(PDO::FETCH_ASSOC);

    if (!empty($search_result)) {
        $query = "UPDATE fixes SET fix_data = :data WHERE user = :user AND game_id = :matchId;";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":data", $data);
        $stmt->bindParam(":user", $user);
        $stmt->bindParam(":matchId", $match);

        $stmt->execute();
    } else {
        $fix_query = "INSERT INTO fixes (game_id, user, fix_data) VALUES (:game, :user, :fix);";
        $fix_stmt = $pdo->prepare($fix_query);

        $fix_stmt->bindParam(":game", $match);
        $fix_stmt->bindParam(":user", $user);
        $fix_stmt->bindParam(":fix", $data);

        $fix_stmt->execute();
    }
    
    echo $data;
}