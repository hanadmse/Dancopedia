<?php
session_start();
if (!isset($_SESSION['user_name']) && !isset($_SESSION['admin_name'])) {
    $base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
    header('Location: ' . $base . 'auth/login');
    exit();
}
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
  <title>Add a Dance – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/CreateDance.css">
  <link rel="stylesheet" href="../assets/css/Breadcrumb.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="preload" href="../assets/js/chatbox.js" as="script">
  <link rel="preload" href="../assets/images/chatbox_face.jpg" as="image">
</head>
<body>
<div id="toolbar-container"></div>
<div id="chatbox-container"></div>
<?php
$crumbs = [['Home', $base], ['Contribute', null]];
include __DIR__ . '/../partials/breadcrumb.php';
?>

<main>
  <div class="page-hero">
    <p class="ph-label">Contribute</p>
    <h1>Add a Dance</h1>
    <p>Submit a new dance to the archive. It will be reviewed by an admin before going live.</p>
  </div>

  <div class="form-wrap">
    <div class="form-card">

      <div class="mb-3">
        <label for="danceName" class="form-label">Dance name</label>
        <input type="text" class="form-control" id="danceName" placeholder="e.g. Frevo" required>
      </div>

      <div class="mb-3">
        <label for="danceCategory" class="form-label">Category</label>
        <select class="form-select" id="danceCategory" required>
          <option value="" selected disabled>Choose a category</option>
          <option value="1">Traditional</option>
          <option value="2">Festival</option>
          <option value="3">Partner</option>
          <option value="4">Pop</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="danceRegion" class="form-label">Region</label>
        <select class="form-select" id="danceRegion" required>
          <option value="" selected disabled>Choose a region</option>
          <option value="Rio de Janeiro">Rio de Janeiro</option>
          <option value="Northeastern Brazil">Northeastern Brazil</option>
          <option value="Pernambuco">Pernambuco</option>
          <option value="Bahia">Bahia</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="danceDescription" class="form-label">Description</label>
        <textarea class="form-control" id="danceDescription" rows="4" placeholder="Describe the dance, its history, and cultural significance…"></textarea>
      </div>

      <div class="mb-3">
        <label for="danceImage" class="form-label">Dance image</label>
        <input type="file" class="form-control" id="danceImage" accept="image/jpeg,image/png,image/webp" required>
      </div>

      <div class="mb-3">
        <span class="map-label">Pin location on map</span>
        <p class="map-note">Click anywhere on the map to place the dance pin.</p>
        <div id="mapContainer">
          <img src="../assets/images/brazil-map.jpg" alt="Brazil Map">
        </div>
        <input type="hidden" id="pinX" name="pin_x">
        <input type="hidden" id="pinY" name="pin_y">
      </div>

      <button class="form-submit" type="button" onclick="createDance()">Submit for review</button>
      <div id="feedback"></div>

    </div>
  </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/createDance.js"></script>
</body>
</html>
