<?php
require_once __DIR__ . '/../../app/auth.php';
requireAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
  <title>User Feedback – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/UserFeedback.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="preload" href="../assets/js/chatbox.js" as="script">
  <link rel="preload" href="../assets/images/chatbox_face.jpg" as="image">
</head>
<body>
<div id="toolbar-container"></div>
<div id="chatbox-container"></div>

<main>
  <div class="page-hero">
    <p class="ph-label">Admin</p>
    <h1>User Feedback</h1>
    <p>Review and approve feedback submitted by registered users of the archive.</p>
  </div>

  <div class="feedback-wrap">
    <div class="feedback-card">
      <div id="feedback-table-container">
        <div class="empty-state">Loading feedback…</div>
      </div>
    </div>
  </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/userFeedback.js"></script>
</body>
</html>
