<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/fonts.css">
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="stylesheet" href="../assets/css/About.css">
  <link rel="stylesheet" href="../assets/css/Breadcrumb.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
</head>
<body>
<?php include __DIR__ . '/../partials/toolbar.php'; ?>
<?php include __DIR__ . '/../partials/chatbox.html'; ?>
<?php
$crumbs = [['Home', $base], ['About', null]];
include __DIR__ . '/../partials/breadcrumb.php';
?>

<main>

  <div class="page-hero">
    <p class="ph-label">The Project</p>
    <h1>About Dancopedia</h1>
    <p>A community-built archive documenting Brazilian dance traditions, organized by style and region.</p>
  </div>

  <section class="about-section">
    <div class="about-wrap">
      <p class="sec-lbl">Our Mission</p>
      <h2>Bringing Brazilian dance culture to the world.</h2>
      <p class="about-lead">Dancopedia is an open archive dedicated to documenting and sharing the rich diversity of Brazilian dance. From the percussion-driven streets of Rio Carnival to the intimate dance halls of the Northeast, every style here carries a living cultural story — rooted in African, indigenous, and European traditions that have shaped Brazil over centuries.</p>
      <p class="about-sub">Built for curious learners, dance enthusiasts, researchers, and anyone who wants to understand Brazil beyond its most famous moves. The collection grows through community submissions and is curated by our editorial team.</p>
    </div>
  </section>

  <section class="about-section about-section--alt">
    <div class="about-wrap">
      <p class="sec-lbl">What You'll Find</p>
      <h2>Everything in one place.</h2>
      <div class="about-cards">

        <div class="about-card">
          <div class="about-card-icon"><i class="fas fa-layer-group"></i></div>
          <h3>Browse by Category</h3>
          <p>Traditional, Festival, Partner, and Pop — each category groups dances by their style and social context, from centuries-old forms to modern expressions.</p>
          <a href="<?= $base ?>categories" class="about-link">Explore Categories →</a>
        </div>

        <div class="about-card">
          <div class="about-card-icon"><i class="fas fa-map-marked-alt"></i></div>
          <h3>Explore by Region</h3>
          <p>Trace dance traditions back to their geographic roots across Rio de Janeiro, Northeastern Brazil, Pernambuco, and Bahia.</p>
          <a href="<?= $base ?>regions" class="about-link">Explore Regions →</a>
        </div>

        <div class="about-card">
          <div class="about-card-icon"><i class="fas fa-plus-circle"></i></div>
          <h3>Contribute a Dance</h3>
          <p>Know a Brazilian dance style not yet in the archive? Register, submit it for review, and help grow the collection for everyone.</p>
          <a href="<?= $base ?>user/contribute" class="about-link">Add a Dance →</a>
        </div>

      </div>
    </div>
  </section>

  <section class="about-cta">
    <div class="about-wrap">
      <h2>Start exploring.</h2>
      <p>Dive into the archive, browse the interactive map, or ask the AI dance guide anything about Brazilian culture.</p>
      <div class="about-cta-btns">
        <a href="<?= $base ?>categories" class="btn-ab-solid">Browse Categories</a>
        <a href="<?= $base ?>regions" class="btn-ab-outline">Explore Regions</a>
        <a href="<?= $base ?>map" class="btn-ab-outline">Open Map</a>
      </div>
    </div>
  </section>

</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/chatbox.js"></script>
</body>
</html>
