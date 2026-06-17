<?php
require __DIR__ . '/../../config/database.php';
session_start();
$base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';

if (isset($_POST['submit'])) {
    $name        = trim($_POST['username']);
    $rawPassword = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users_form WHERE username = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $valid = false;
    if ($row) {
        if (password_verify($rawPassword, $row['password'])) {
            $valid = true;
        } elseif ($row['password'] === md5($rawPassword)) {
            $newHash = password_hash($rawPassword, PASSWORD_BCRYPT);
            $upd = $conn->prepare("UPDATE users_form SET password = ? WHERE id = ?");
            $upd->bind_param("si", $newHash, $row['id']);
            $upd->execute();
            $upd->close();
            $valid = true;
        }
    }

    if ($valid) {
        session_regenerate_id(true);
        $_SESSION['user_type'] = $row['user_type'];
        $_SESSION['username']  = $row['username'];
        if ($row['user_type'] == 'admin') {
            $_SESSION['admin_name'] = $row['username'];
            header('Location: ' . $base . 'admin');
        } else {
            $_SESSION['user_name'] = $row['username'];
            header('Location: ' . $base . 'user/home');
        }
        exit();
    } else {
        $error[] = 'Incorrect username or password.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login – Dancopedia Brazil</title>
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
    <a href="<?= $base ?>" class="auth-panel-logo">
      <img src="../assets/images/brazil_flag.jpg" alt="Brazil flag">
      <span>Dancopedia</span>
    </a>
    <div class="auth-panel-body">
      <h2>Brazil's Living Dance Archive</h2>
      <p>Discover, explore, and contribute to the rhythms that define a nation.</p>
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

      <h2>Welcome back</h2>
      <p class="auth-sub">Sign in to your account to continue.</p>

      <?php if (isset($error)): foreach ($error as $e): ?>
        <span class="error-msg"><?= htmlspecialchars($e) ?></span>
      <?php endforeach; endif; ?>
      <?php if (isset($_GET['registered']) && $_GET['registered'] === '1'): ?>
        <span class="success-msg">Account created successfully. Please sign in.</span>
      <?php endif; ?>

      <form action="" method="post">
        <div class="auth-field">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Your username" required>
        </div>
        <div class="auth-field">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Your password" required>
        </div>
        <button class="auth-submit" type="submit" name="submit">Sign in</button>
      </form>

      <div class="auth-links">
        <p>No account? <a href="<?= $base ?>auth/register">Create one</a></p>
        <p><a href="<?= $base ?>">← Back to home</a></p>
      </div>

    </div>
  </div>

</div>
</body>
</html>
