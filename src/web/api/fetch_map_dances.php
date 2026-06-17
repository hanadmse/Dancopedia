<?php
require __DIR__ . '/../../app/api_helpers.php';
require __DIR__ . '/../../config/database.php';

jsonHeader();

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$sql = "
    SELECT
        dances.dance_id,
        dances.dance_name,
        dances.slug,
        dances.description,
        dances.x,
        dances.y,
        region.region_name,
        media.media_url,
        media.alttext,
        dance_categories.category_name
    FROM dances
    LEFT JOIN media            ON dances.media_id   = media.media_id
    LEFT JOIN dance_categories ON dances.category_id = dance_categories.category_id
    LEFT JOIN region           ON dances.region      = region.region_key
    WHERE dances.approved = 1
";

$result = $conn->query($sql);
$dances = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dances[] = array_merge(formatDanceRow($row), [
            "x" => (int)($row['x'] ?? 0),
            "y" => (int)($row['y'] ?? 0),
        ]);
    }
}

echo json_encode($dances);
$conn->close();
