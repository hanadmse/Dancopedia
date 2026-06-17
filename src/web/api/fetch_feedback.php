<?php
session_start();
require __DIR__ . '/../../app/api_helpers.php';
requireAdminApi();

require __DIR__ . '/../../config/database.php';
jsonHeader();

$sql = "
    SELECT
        feedback.id,
        feedback.username,
        feedback.fname,
        feedback.lname,
        feedback.continent,
        feedback.feedback_text,
        feedback.approved,
        feedback.created_at
    FROM feedback
    ORDER BY feedback.created_at DESC
";

$result    = $conn->query($sql);
$feedbacks = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $feedbacks[] = [
            "id"            => $row['id'],
            "username"      => $row['username'],
            "fname"         => $row['fname'],
            "lname"         => $row['lname'],
            "continent"     => $row['continent'],
            "feedback_text" => $row['feedback_text'],
            "approved"      => (int) $row['approved'],
            "created_at"    => $row['created_at'],
        ];
    }
}

echo json_encode($feedbacks);
$conn->close();
