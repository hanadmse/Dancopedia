<?php
require __DIR__ . '/../../config/database.php';
require __DIR__ . '/../../app/api_helpers.php';

jsonHeader();

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed."]);
    exit;
}

$filters  = json_decode(file_get_contents("php://input"), true);
$dance_id = isset($filters['danceId']) ? (int)$filters['danceId'] : 0;

if (!$dance_id) {
    echo json_encode(["error" => "Dance ID not provided."]);
    exit;
}

$stmt = $conn->prepare("
    SELECT
        dances.dance_id,
        dances.dance_name,
        dances.description,
        region.region_name,
        media.media_url,
        media.alttext,
        dance_categories.category_name
    FROM dances
    LEFT JOIN media             ON dances.media_id   = media.media_id
    LEFT JOIN dance_categories  ON dances.category_id = dance_categories.category_id
    LEFT JOIN region            ON dances.region      = region.region_key
    WHERE dances.dance_id = ?
");
$stmt->bind_param("i", $dance_id);
$stmt->execute();
$result     = $stmt->get_result();
$dance_info = $result->fetch_assoc() ?? ["error" => "No dance found."];
$stmt->close();

echo json_encode($dance_info);
$conn->close();
?>
