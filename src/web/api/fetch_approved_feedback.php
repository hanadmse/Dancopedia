<?php
require __DIR__ . '/../../config/database.php';
require __DIR__ . '/../../app/api_helpers.php';
jsonHeader();

$sql = "
    SELECT id, fname, lname, continent, feedback_text, created_at
    FROM feedback
    WHERE approved = 1
    ORDER BY created_at DESC
";

$result    = $conn->query($sql);
$feedbacks = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $feedbacks[] = [
            "id"            => (int) $row['id'],
            "fname"         => $row['fname'],
            "lname"         => $row['lname'],
            "continent"     => $row['continent'],
            "feedback_text" => $row['feedback_text'],
            "created_at"    => $row['created_at'],
        ];
    }
}

echo json_encode($feedbacks);
$conn->close();
