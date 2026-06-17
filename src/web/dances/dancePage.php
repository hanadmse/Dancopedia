<?php
session_start();


if (!isset($_GET['slug'])) {
    $base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
    if (isset($_GET['danceId'])) {
        require __DIR__ . '/../../config/database.php';
        $id = max(0, (int)$_GET['danceId']);
        if ($id > 0) {
            $stmt = $conn->prepare("SELECT slug FROM dances WHERE dance_id = ? AND approved = 1");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            if ($row && !empty($row['slug'])) {
                header('Location: ' . $base . 'dances/' . rawurlencode($row['slug']), true, 301);
                exit();
            }
        }
    }
    header('Location: ' . $base . 'categories', true, 302);
    exit();
}

$isAdmin = isset($_SESSION["admin_name"]);
if ($isAdmin && empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php if ($isAdmin): ?>
  <meta name="csrf-token" content="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
  <?php endif; ?>
  <title>Dance – Dancopedia Brazil</title>
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
<?php include __DIR__ . '/../partials/toolbar.php'; ?>
<?php include __DIR__ . '/../partials/chatbox.html'; ?>
<?php
$crumbs = [['Home', $base]];
include __DIR__ . '/../partials/breadcrumb.php';
?>

<main>
  <div id="danceContainer"></div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script>
  const isAdmin = <?php echo json_encode($isAdmin); ?>;
  const PAGE_SLUG = <?php echo json_encode($_GET['slug'] ?? ''); ?>;
  window.API_BASE = '../';
  const csrfToken = isAdmin ? (document.querySelector('meta[name="csrf-token"]')?.content ?? '') : '';
</script>

<script src="../assets/js/load_dances.js?v=2"></script>
<script src="../assets/js/chatbox.js"></script>
<script src="../assets/js/dancePage.js"></script>
</body>
</html>
