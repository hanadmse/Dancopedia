<?php
session_start();
require __DIR__ . '/../../app/api_helpers.php';
requireAdminApi();
verifyCsrfToken();

require __DIR__ . '/../../config/database.php';
jsonHeader();

$data     = json_decode(file_get_contents("php://input"), true);
$danceIds = $data['danceIds'] ?? [];

if (!empty($danceIds)) {
    $ids          = array_map('intval', $danceIds);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $types        = str_repeat('i', count($ids));
    $stmt         = $conn->prepare("DELETE FROM dances WHERE dance_id IN ($placeholders)");
    $stmt->bind_param($types, ...$ids);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Dances deleted successfully."]);
    } else {
        echo json_encode(["error" => "Error deleting records: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "No dance IDs provided."]);
}

$conn->close();
