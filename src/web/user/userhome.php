<?php
require_once __DIR__ . '/../../app/auth.php';
requireUser();
$username = htmlspecialchars($_SESSION['username'] ?? $_SESSION['user_name'] ?? 'User');
$base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Account – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/Userhome.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
</head>
<body>
<div id="toolbar-container"></div>

<main>
  <div class="page-hero">
    <p class="ph-label">Your account</p>
    <h1>Welcome, <?= $username ?>!</h1>
    <p>Manage your contributions and share your thoughts about the archive.</p>
  </div>

  <div class="dash-wrap">
    <div class="dash-grid">
      <a class="dash-card" href="<?= $base ?>community/feedback">
        <div class="dash-icon"></div>
        <h3>Give Feedback</h3>
        <p>Share your thoughts, suggestions, or experience with the Dancopedia archive.</p>
      </a>
      <a class="dash-card" href="<?= $base ?>user/contribute">
        <div class="dash-icon"></div>
        <h3>Add a Dance</h3>
        <p>Submit a new dance to the archive for admin review and approval.</p>
      </a>
      <a class="dash-card" href="<?= $base ?>categories">
        <div class="dash-icon"></div>
        <h3>Browse Categories</h3>
        <p>Explore dances by style — traditional, festival, partner, and pop.</p>
      </a>
      <a class="dash-card" href="<?= $base ?>regions">
        <div class="dash-icon"></div>
        <h3>Explore Regions</h3>
        <p>Discover dances from Rio, Bahia, Pernambuco, and the Northeast.</p>
      </a>
    </div>

    <a href="<?= $base ?>auth/logout" class="btn-logout">Sign out</a>
  </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/userhome.js"></script>
</body>
</html>
