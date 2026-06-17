<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dance Categories – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/fonts.css">
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="stylesheet" href="../assets/css/Categories.css">
  <link rel="stylesheet" href="../assets/css/Breadcrumb.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
</head>
<body>
<?php include __DIR__ . '/../partials/toolbar.php'; ?>
<?php include __DIR__ . '/../partials/chatbox.html'; ?>
<?php
$crumbs = [['Home', $base], ['Categories', null]];
include __DIR__ . '/../partials/breadcrumb.php';
?>

  <main>
    <div class="page-hero">
      <p class="ph-label">Browse the collection</p>
      <h1>Dance Categories</h1>
      <p>Explore Brazilian dance traditions organized by style — from classical forms to contemporary expressions.</p>
    </div>

    <div class="cat-wrap">
      <div class="cat-grid">

        <a class="cat-card" href="<?= $base ?>categories/traditional">
          <div class="cat-icon"></div>
          <h2>Traditional</h2>
          <p>Classic forms rooted in African, indigenous, and European heritage — Brazil's most enduring dance expressions.</p>
          <span class="cat-arrow">Explore</span>
        </a>

        <a class="cat-card" href="<?= $base ?>categories/festival">
          <div class="cat-icon"></div>
          <h2>Festival</h2>
          <p>Vibrant, acrobatic carnival dances born from Brazil's legendary street celebrations and communal joy.</p>
          <span class="cat-arrow">Explore</span>
        </a>

        <a class="cat-card" href="<?= $base ?>categories/partner">
          <div class="cat-icon"></div>
          <h2>Partner</h2>
          <p>Intimate couple dances shaped by northeastern rhythms and the close energy of social dance halls.</p>
          <span class="cat-arrow">Explore</span>
        </a>

        <a class="cat-card" href="<?= $base ?>categories/pop">
          <div class="cat-icon"></div>
          <h2>Pop</h2>
          <p>Contemporary styles blending modern global influences with Brazil's rich movement vocabulary.</p>
          <span class="cat-arrow">Explore</span>
        </a>

      </div>
    </div>
  </main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/chatbox.js"></script>
</body>
</html>
