<?php

    session_start();

    require_once "../dbh.php";

    $data_query = "SELECT * FROM users;";
    $data_stmt = $pdo->prepare($data_query);

    $data_stmt->execute();
    $data_result = $data_stmt->fetchAll(PDO::FETCH_ASSOC);

    $_SESSION["data"] = $data_result;

    echo json_encode($data_result);