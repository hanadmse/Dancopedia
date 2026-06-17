<?php
require __DIR__ . '/../../config/database.php';
$base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';

if (isset($_POST['submit'])) {
    $name  = trim($_POST['name']);
    $email = trim($_POST['email']);

    $check = $conn->prepare("SELECT id FROM users_form WHERE username = ?");
    $check->bind_param("s", $name);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $error[] = 'Username already exists.';
    } elseif ($_POST['password'] !== $_POST['cpassword']) {
        $error[] = 'Passwords do not match.';
    } else {
        $hash = password_hash($_POST['password'], PASSWORD_BCRYPT);
        $ins  = $conn->prepare("INSERT INTO users_form (username, email, password, user_type) VALUES (?, ?, ?, 'user')");
        $ins->bind_param("sss", $name, $email, $hash);
        $ins->execute();
        $ins->close();
        header('Location: ' . $base . 'auth/login?registered=1');
        exit();
    }
    $check->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Account – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/Login.css">
</head>
<body>
<div class="auth-wrap">

  <div class="auth-panel">
    <a href="../" class="auth-panel-logo">
      <img src="../assets/images/brazil_flag.jpg" alt="Brazil flag">
      <span>Dancopedia</span>
    </a>
    <div class="auth-panel-body">
      <h2>Join the Dance Community</h2>
      <p>Create a free account and start exploring Brazil's rich dance heritage.</p>
      <ul class="auth-panel-features">
        <li>Browse dances by region &amp; category</li>
        <li>Submit and share your own dances</li>
        <li>Chat with our Brazilian dance AI</li>
      </ul>
    </div>
    <p class="auth-panel-foot">© 2026 Dancopedia Brazil</p>
  </div>

  <div class="auth-form-side">
    <div class="auth-card">

      <h2>Create account</h2>
      <p class="auth-sub">Join the archive and start contributing.</p>

      <?php if (isset($error)): foreach ($error as $e): ?>
        <span class="error-msg"><?= htmlspecialchars($e) ?></span>
      <?php endforeach; endif; ?>

      <form action="" method="post">
        <div class="auth-field">
          <label for="name">Username</label>
          <input type="text" id="name" name="name" placeholder="Choose a username" required>
        </div>
        <div class="auth-field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Your email address" required>
        </div>
        <div class="auth-field">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Create a password" required>
        </div>
        <div class="auth-field">
          <label for="cpassword">Confirm password</label>
          <input type="password" id="cpassword" name="cpassword" placeholder="Repeat your password" required>
        </div>
        <button class="auth-submit" type="submit" name="submit">Create account</button>
      </form>

      <div class="auth-links">
        <p>Already have an account? <a href="<?= $base ?>auth/login">Sign in</a></p>
        <p><a href="../">← Back to home</a></p>
      </div>

    </div>
  </div>

</div>
</body>
</html>
