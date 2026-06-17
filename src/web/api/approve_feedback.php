<?php
session_start();
require __DIR__ . '/../../app/api_helpers.php';
requireAdminApi();
verifyCsrfToken();

require __DIR__ . '/../../config/database.php';
jsonHeader();

$data       = json_decode(file_get_contents("php://input"), true);
$feedbackId = isset($data['feedbackId']) ? (int) $data['feedbackId'] : 0;

if ($feedbackId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "No feedback ID provided."]);
    exit;
}

$stmt = $conn->prepare("UPDATE feedback SET approved = 1 WHERE id = ?");
$stmt->bind_param("i", $feedbackId);

if ($stmt->execute()) {
    echo json_encode(["message" => "Feedback approved."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database error — please try again."]);
}

$stmt->close();
$conn->close();
