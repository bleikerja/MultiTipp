<?php

$dsn = "mysql:host=localhost;dbname=u128667579_multitipp";
$dbusername = "u128667579_jascha";
$dbpassword = "Ihjbuwir9.";

try{
    $pdo = new PDO($dsn, $dbusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
    echo "". $e->getMessage();
}
