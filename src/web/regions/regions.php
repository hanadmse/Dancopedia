<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Regions – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/fonts.css">
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="stylesheet" href="../assets/css/Regions.css">
  <link rel="stylesheet" href="../assets/css/Breadcrumb.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
</head>
<body>
<?php include __DIR__ . '/../partials/toolbar.php'; ?>
<?php include __DIR__ . '/../partials/chatbox.html'; ?>
<?php
$crumbs = [['Home', $base], ['Regions', null]];
include __DIR__ . '/../partials/breadcrumb.php';
?>

  <main>
    <div class="page-hero">
      <p class="ph-label">Dance by place</p>
      <h1>Explore by Region</h1>
      <p>Each Brazilian region carries its own rhythms, instruments, and movement traditions. Choose a region to begin.</p>
    </div>

    <div class="cat-wrap">
      <div class="cat-grid">

        <a class="cat-card" href="<?= $base ?>regions/rio-de-janeiro">
          <div class="cat-icon"></div>
          <h2>Rio de Janeiro</h2>
          <p>Brazil's cultural capital — birthplace of samba, bossa nova, and the world-famous Rio Carnival.</p>
          <span class="cat-arrow">Explore</span>
        </a>

        <a class="cat-card" href="<?= $base ?>regions/northeastern-brazil">
          <div class="cat-icon"></div>
          <h2>Northeastern Brazil</h2>
          <p>The heartland of forró and maracatu, rich in Afro-Brazilian folk traditions and regional festivals.</p>
          <span class="cat-arrow">Explore</span>
        </a>

        <a class="cat-card" href="<?= $base ?>regions/pernambuco">
          <div class="cat-icon"></div>
          <h2>Pernambuco</h2>
          <p>Home of frevo — a UNESCO intangible cultural heritage — and one of Brazil's oldest carnival traditions.</p>
          <span class="cat-arrow">Explore</span>
        </a>

        <a class="cat-card" href="<?= $base ?>regions/bahia">
          <div class="cat-icon"></div>
          <h2>Bahia</h2>
          <p>A cradle of Afro-Brazilian culture — axé, capoeira, and candomblé rhythms define this vibrant state.</p>
          <span class="cat-arrow">Explore</span>
        </a>

      </div>
    </div>
  </main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/chatbox.js"></script>
</body>
</html>
