<?php
    include_once 'conection.php';

    $fname = $_POST["fname"];
    $lname = $_POST["lname"];
    $genre = $_POST["genre"];

    $stmt = $con->prepare("INSERT INTO aluno(name, lastname, genre) VALUE(:fname, :lname, :genre)");

    $stmt->bindParam(":fname", $fname);
    $stmt->bindParam(":lname", $lname);
    $stmt->bindParam(":genre", $genre);

    $stmt->execute();

    header("Location:../index.html",true);
    exit();