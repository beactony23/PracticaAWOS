<?php
session_start();
require_once "conexion.php";

/* ===== REGISTRAR ===== */
function registrar($nombre, $email, $password) {
    global $pdo;

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nombre, email, password)
            VALUES (?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    return $stmt->execute([$nombre, $email, $hash]);
}

/* ===== LOGIN ===== */
function login($email, $password) {
    global $pdo;

    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["user_name"] = $user["nombre"];
        return true;
    }

    return false;
}

/* ===== PROTEGER ===== */
function protegido() {
    if (!isset($_SESSION["user_id"])) {
        header("Location: login.php");
        exit;
    }
}
