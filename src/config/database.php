<?php
function dancopediaLoadLocalEnv(string $path): void {
    if (!is_readable($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = array_map('trim', explode('=', $line, 2));
        $value = trim($value, "\"'");
        $currentValue = getenv($key);
        if ($currentValue === false || $currentValue === '') {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

dancopediaLoadLocalEnv(__DIR__ . '/.env');

$host = getenv('DANCOPEDIA_DB_HOST');
$port = (int)getenv('DANCOPEDIA_DB_PORT');
$username = getenv('DANCOPEDIA_DB_USER');
$password = getenv('DANCOPEDIA_DB_PASSWORD');
$database = getenv('DANCOPEDIA_DB_NAME');

mysqli_report(MYSQLI_REPORT_OFF);
$conn = new mysqli($host, $username, $password, $database, $port);
$conn->set_charset("utf8mb4");


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
