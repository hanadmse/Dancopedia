<?php
session_start();
session_destroy();
$base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
header('Location: ' . $base);
?>
