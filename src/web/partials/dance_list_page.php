<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?> – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/fonts.css">
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="stylesheet" href="../assets/css/Traditional.css">
  <link rel="stylesheet" href="../assets/css/Breadcrumb.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
</head>
<body>
<?php include __DIR__ . '/toolbar.php'; ?>
<?php include __DIR__ . '/chatbox.html'; ?>
<?php
$crumbs = [['Home', $base]];
if (!empty($loadCategory)) {
    $crumbs[] = ['Categories', $base . 'categories'];
    $crumbs[] = [$pageHeading, null];
} elseif (!empty($loadRegion)) {
    if (($_GET['from'] ?? '') === 'map') {
        $crumbs[] = ['Map', $base . 'map'];
    } else {
        $crumbs[] = ['Regions', $base . 'regions'];
    }
    $crumbs[] = [$pageHeading, null];
}
include __DIR__ . '/breadcrumb.php';
?>

<main>
  <div class="dances-section">
    <h1 class="cat-heading"><?= htmlspecialchars($pageHeading) ?></h1>
    <div id="danceContainer"></div>
  </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script>
  window.API_BASE   = '../';
  const LOAD_REGION   = <?= json_encode($loadRegion) ?>;
  const LOAD_CATEGORY = <?= json_encode($loadCategory) ?>;
</script>
<script src="../assets/js/load_dances.js?v=2"></script>
<script src="../assets/js/chatbox.js"></script>
<script src="../assets/js/danceListPage.js"></script>
</body>
</html>
