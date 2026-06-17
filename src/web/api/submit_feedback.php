<?php
require __DIR__ . '/../../config/database.php';
require __DIR__ . '/../../app/api_helpers.php';
session_start();

jsonHeader();

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'You must be logged in to submit feedback.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request.']);
    exit();
}

$username  = $_SESSION['username'];
$fname     = trim($_POST['fname']      ?? '');
$lname     = trim($_POST['lname']      ?? '');
$continent = trim($_POST['continent']  ?? '');
$feedback  = trim($_POST['feedback']   ?? '');

$allowed_continents = ['africa', 'asia', 'australia', 'europe', 'north_america', 'south_america'];

if (empty($fname) || strlen($fname) < 2 || strlen($fname) > 50) {
    echo json_encode(['success' => false, 'error' => 'First name must be between 2 and 50 characters.']);
    exit();
}
if (empty($lname) || strlen($lname) < 2 || strlen($lname) > 50) {
    echo json_encode(['success' => false, 'error' => 'Last name must be between 2 and 50 characters.']);
    exit();
}
if (!in_array($continent, $allowed_continents, true)) {
    echo json_encode(['success' => false, 'error' => 'Please select a valid location.']);
    exit();
}
if (strlen($feedback) < 10) {
    echo json_encode(['success' => false, 'error' => 'Feedback must be at least 10 characters.']);
    exit();
}
if (strlen($feedback) > 300) {
    echo json_encode(['success' => false, 'error' => 'Feedback must be 300 characters or less.']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO feedback (username, fname, lname, continent, feedback_text, approved, created_at) VALUES (?, ?, ?, ?, ?, 0, NOW())");
$stmt->bind_param("sssss", $username, $fname, $lname, $continent, $feedback);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Database error — please try again.']);
}
$stmt->close();
?>
