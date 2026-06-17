<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('SITE_BASE', rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/');

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY']) > 1800) {
    session_unset();
    session_destroy();
    header("Location: " . SITE_BASE . "auth/login.php?timeout=1");
    exit();
}
$_SESSION['LAST_ACTIVITY'] = time();


function requireLogin() {
    if (!isset($_SESSION['username'])) {
        header("Location: " . SITE_BASE . "auth/login.php?auth_required=1");
        exit();
    }
}


function requireAdmin() {
    requireLogin();

    if ($_SESSION['user_type'] !== 'admin') {
        header("Location: " . SITE_BASE . "user/userhome.php");
        exit();
    }
}


function requireUser() {
    requireLogin();
}
?>
