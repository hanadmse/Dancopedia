<?php
require __DIR__ . '/../../app/api_helpers.php';
require __DIR__ . '/../../config/database.php';

jsonHeader();

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$like   = '%' . $search . '%';

$stmt = $conn->prepare("
    SELECT
        dances.dance_id,
        dances.dance_name,
        dances.slug,
        dances.description,
        region.region_name,
        media.media_url,
        media.alttext,
        dance_categories.category_name
    FROM dances
    LEFT JOIN media            ON dances.media_id   = media.media_id
    LEFT JOIN dance_categories ON dances.category_id = dance_categories.category_id
    LEFT JOIN region           ON dances.region      = region.region_key
    WHERE dances.approved = 1
      AND (
            dances.dance_name              LIKE ?
         OR region.region_name             LIKE ?
         OR dance_categories.category_name LIKE ?
      )
");
$stmt->bind_param("sss", $like, $like, $like);
$stmt->execute();
$result = $stmt->get_result();

$dances = [];
while ($row = $result->fetch_assoc()) {
    $dances[] = formatDanceRow($row);
}

$stmt->close();
echo json_encode($dances);
$conn->close();
