<?php
session_start();
require __DIR__ . '/../../config/database.php';
require __DIR__ . '/../../app/api_helpers.php';
requireAdminApi();
verifyCsrfToken();
jsonHeader();

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    echo json_encode(["success" => false, "error" => "Invalid JSON data: " . json_last_error_msg()]);
    exit;
}

$danceId     = isset($data['dance_id'])    ? (int)$data['dance_id']    : null;
$danceName   = isset($data['dance_name'])  ? $data['dance_name']        : null;
$region      = isset($data['region'])      ? (int)$data['region']       : null;
$category    = isset($data['category'])    ? (int)$data['category']     : null;
$description = isset($data['description']) ? $data['description']       : null;
$pinX        = isset($data['pin_x'])       ? (int)$data['pin_x']        : null;
$pinY        = isset($data['pin_y'])       ? (int)$data['pin_y']        : null;

if (!$danceId) {
    echo json_encode(["success" => false, "error" => "No dance ID provided."]);
    exit;
}

if (!$danceName || !$region || !$category) {
    echo json_encode(["success" => false, "error" => "Required fields missing."]);
    exit;
}

$slug = generateSlug($danceName);

if ($pinX !== null && $pinY !== null) {
    $stmt = $conn->prepare("UPDATE dances SET dance_name = ?, slug = ?, region = ?, category_id = ?, description = ?, x = ?, y = ? WHERE dance_id = ?");
    $stmt->bind_param("ssiissii", $danceName, $slug, $region, $category, $description, $pinX, $pinY, $danceId);
} else {
    $stmt = $conn->prepare("UPDATE dances SET dance_name = ?, slug = ?, region = ?, category_id = ?, description = ? WHERE dance_id = ?");
    $stmt->bind_param("ssiisi", $danceName, $slug, $region, $category, $description, $danceId);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "slug" => $slug]);
} else {
    echo json_encode(["success" => false, "error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
