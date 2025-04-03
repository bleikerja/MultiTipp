<?php

    session_start();

    require_once "../dbh.php";

    $data_query = "SELECT * FROM fixes;";
    $data_stmt = $pdo->prepare($data_query);

    $data_stmt->execute();
    $data_result = $data_stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data_result);