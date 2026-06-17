<?php
require_once __DIR__ . '/../../app/auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Feedback – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/FeedbackWall.css">
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
    <p class="ph-label">Community</p>
    <h1>What People Are Saying</h1>
    <p>Real feedback from visitors and enthusiasts of Brazilian dance culture around the world.</p>
  </div>

  <div class="wall-wrap">
    <div class="wall-grid" id="feedback-grid">
      <div class="empty-state"><i class="fas fa-comment-alt"></i>Loading feedback…</div>
    </div>

    <div class="cta-wrap">
      <h2>Have Something to Share?</h2>
      <p>Your thoughts help us improve the archive for everyone.</p>
      <a href="<?= $base ?>user/feedback" class="cta-btn">
        <i class="fas fa-pen"></i> Share Your Feedback
      </a>
    </div>
  </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/feedbackWall.js"></script>
</body>
</html>
