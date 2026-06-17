<?php
if (session_status() === PHP_SESSION_NONE) session_start();
$isLoggedIn = isset($_SESSION['user_name']) || isset($_SESSION['admin_name']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feedback – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/Feedback.css">
  <link rel="stylesheet" href="../assets/css/Breadcrumb.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
</head>
<body>
<?php include __DIR__ . '/../partials/toolbar.php'; ?>
<?php include __DIR__ . '/../partials/chatbox.html'; ?>
<?php
$crumbs = [['Home', $base], ['Feedback', null]];
include __DIR__ . '/../partials/breadcrumb.php';
?>

<main>

  <div class="page-hero">
    <p class="ph-label">Community</p>
    <h1>Feedback</h1>
    <p>Share your thoughts about the archive — then read what others from around the world have said.</p>
  </div>

  <div class="fb-toast fb-toast--success" id="toastSuccess" role="alert">
    <span>Feedback submitted — thank you! It will appear publicly after review.</span>
    <button class="fb-toast-close" onclick="hideToast('toastSuccess')" aria-label="Dismiss">&times;</button>
  </div>
  <div class="fb-toast fb-toast--error" id="toastError" role="alert">
    <span id="toastErrorMsg">Something went wrong. Please try again.</span>
    <button class="fb-toast-close" onclick="hideToast('toastError')" aria-label="Dismiss">&times;</button>
  </div>

  <div class="wall-section">
    <div class="wall-wrap">
      <h2 class="wall-heading">What People Are Saying</h2>
      <p class="wall-sub">Real feedback from visitors and enthusiasts of Brazilian dance culture around the world.</p>
      <div class="wall-grid" id="feedback-grid">
        <div class="empty-state"><i class="fas fa-comment-alt"></i>Loading feedback…</div>
      </div>
    </div>
  </div>

  <?php if ($isLoggedIn): ?>
  <div class="form-wrap" style="padding-top:16px;padding-bottom:48px;">
    <div class="form-card">
      <form id="feedbackForm" novalidate>

        <div class="form-row">
          <div class="form-field">
            <label for="fname">First name</label>
            <input type="text" id="fname" name="fname" placeholder="Jane" required autocomplete="given-name">
            <span class="field-error" id="fname-error"></span>
          </div>
          <div class="form-field">
            <label for="lname">Last name</label>
            <input type="text" id="lname" name="lname" placeholder="Doe" required autocomplete="family-name">
            <span class="field-error" id="lname-error"></span>
          </div>
        </div>

        <div class="form-field">
          <label for="continent">Where are you from?</label>
          <select id="continent" name="continent">
            <option value="" disabled selected>Select a region…</option>
            <option value="africa">Africa</option>
            <option value="asia">Asia</option>
            <option value="australia">Australia / Oceania</option>
            <option value="europe">Europe</option>
            <option value="north_america">North America</option>
            <option value="south_america">South America</option>
          </select>
          <span class="field-error" id="continent-error"></span>
        </div>

        <div class="form-field">
          <label for="feedback">Your feedback</label>
          <textarea id="feedback" name="feedback" placeholder="Share your thoughts… (min 10 characters)" maxlength="300" required></textarea>
          <span class="char-count" id="feedback-count">0 / 300</span>
          <span class="field-error" id="feedback-error"></span>
        </div>

        <button class="form-submit" type="submit">Submit feedback</button>
      </form>
    </div>
  </div>
  <?php else: ?>

  <div class="login-prompt" style="padding-top:16px;padding-bottom:48px;">
    <div class="login-prompt-card">
      <div class="login-prompt-icon"><i class="fas fa-comment-dots"></i></div>
      <h2>Share Your Thoughts</h2>
      <p>Sign in or create a free account to leave feedback about the Dancopedia archive.</p>
      <div class="login-prompt-btns">
        <a href="<?= $base ?>auth/login" class="lp-btn-solid">Sign in</a>
        <a href="<?= $base ?>auth/register" class="lp-btn-ghost">Create account</a>
      </div>
    </div>
  </div>
  <?php endif; ?>

</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/chatbox.js"></script>
<script src="../assets/js/feedback.js"></script>
</body>
</html>
