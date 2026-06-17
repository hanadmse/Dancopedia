<?php
session_start();
require __DIR__ . '/../../app/api_helpers.php';
require __DIR__ . '/../../config/database.php';

jsonHeader();
mb_internal_encoding("UTF-8");
mysqli_set_charset($conn, "utf8mb4");

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed."]);
    exit;
}

$filters  = json_decode(file_get_contents("php://input"), true);
$id       = isset($filters['id'])       ? (int)$filters['id']       : null;
$slug     = isset($filters['slug'])     ? trim($filters['slug'])     : null;
$region   = isset($filters['region'])   ? trim($filters['region'])   : null;
$category = isset($filters['category']) ? trim($filters['category']) : null;
$approved = isset($filters['approved']) ? (int)$filters['approved']  : 1;

if ($approved !== 1 && !isset($_SESSION['admin_name'])) {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized."]);
    exit;
}

$baseSql = "
    SELECT
        dances.dance_id,
        dances.dance_name,
        dances.slug,
        dances.description,
        dances.x,
        dances.y,
        dances.region AS region_id,
        dances.category_id,
        region.region_name,
        media.media_url,
        media.alttext,
        dance_categories.category_name
    FROM dances
    LEFT JOIN media             ON dances.media_id   = media.media_id
    LEFT JOIN dance_categories  ON dances.category_id = dance_categories.category_id
    LEFT JOIN region            ON dances.region      = region.region_key
";

$conditions = ["dances.approved = ?"];
$types      = "i";
$params     = [$approved];

if (!empty($id)) {
    $conditions[] = "dances.dance_id = ?";
    $types .= "i";
    $params[] = $id;
}
if (!empty($slug)) {
    $conditions[] = "dances.slug = ?";
    $types .= "s";
    $params[] = $slug;
}
if (!empty($region)) {
    $conditions[] = "region.region_name = ?";
    $types .= "s";
    $params[] = $region;
}
if (!empty($category)) {
    $conditions[] = "dance_categories.category_name = ?";
    $types .= "s";
    $params[] = $category;
}

$sql  = $baseSql . " WHERE " . implode(" AND ", $conditions);
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$dances = [];
while ($row = $result->fetch_assoc()) {
    $dances[] = array_merge(formatDanceRow($row), [
        "x"           => (int)($row['x'] ?? 0),
        "y"           => (int)($row['y'] ?? 0),
        "region_id"   => (int)($row['region_id'] ?? 0),
        "category_id" => (int)($row['category_id'] ?? 0),
    ]);
}

$stmt->close();
echo json_encode($dances, JSON_UNESCAPED_UNICODE);
$conn->close();
