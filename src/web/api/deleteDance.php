<?php
session_start();
require __DIR__ . '/../../app/api_helpers.php';
requireAdminApi();
verifyCsrfToken();

require __DIR__ . '/../../config/database.php';
jsonHeader();

$data    = json_decode(file_get_contents("php://input"), true);
$danceId = isset($data['id']) ? (int)$data['id'] : null;

if (!$danceId) {
    echo json_encode(["error" => "No ID provided."]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM dances WHERE dance_id = ?");
$stmt->bind_param("i", $danceId);
$result = $stmt->execute();
$stmt->close();

if ($result) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $conn->error]);
}

$conn->close();
