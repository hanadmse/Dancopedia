<?php
if (session_status() === PHP_SESSION_NONE) session_start();
if (!headers_sent()) {
    header('Cache-Control: private, max-age=30, stale-while-revalidate=60');
}
$base    = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
$loggedIn = isset($_SESSION['username']);
$display  = '';
$initial  = 'U';
$profile  = $base . 'user/home';
if ($loggedIn) {
    $display = htmlspecialchars($_SESSION['admin_name'] ?? $_SESSION['user_name'] ?? 'User');
    $initial = strtoupper(mb_substr($display, 0, 1));
    $profile = isset($_SESSION['admin_name']) ? $base . 'admin' : $base . 'user/home';
}
?>

<div id="toolbar-container">
<input type="checkbox" id="snCheck" class="sn-check">

<nav class="site-nav" id="siteNav">

    <a href="<?= $base ?>" class="sn-logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil flag">
        <span class="sn-brand">Dancopedia</span>
    </a>

    <ul class="sn-links">
        <li><a href="<?= $base ?>">Home</a></li>
        <li><a href="<?= $base ?>categories">Categories</a></li>
        <li><a href="<?= $base ?>regions">Regions</a></li>
        <li><a href="<?= $base ?>map">Map</a></li>
        <li><a href="<?= $base ?>pages/timeline">Timeline</a></li>
        <li><a href="<?= $base ?>pages/instruments">Instruments</a></li>
        <li><a href="<?= $base ?>user/contribute">Contribute</a></li>
        <li><a href="<?= isset($_SESSION['admin_name']) ? $base . 'admin/feedback' : $base . 'community/feedback' ?>">Feedback</a></li>
        <li><a href="<?= $base ?>pages/about">About</a></li>
        <?php if (isset($_SESSION['admin_name'])): ?>
        <li><a href="<?= $base ?>admin">Admin Panel</a></li>
        <?php endif; ?>
    </ul>

    <div class="sn-right">
        <form action="<?= htmlspecialchars($base . 'search') ?>" method="get" class="sn-search">
            <input type="text" name="q" placeholder="Search dances…" required aria-label="Search">
            <button type="submit" aria-label="Search">Search</button>
        </form>

        <?php if (!$loggedIn): ?>
            <a href="<?= $base ?>auth/login" class="sn-btn sn-btn-ghost">Login</a>
            <a href="<?= $base ?>auth/register" class="sn-btn sn-btn-solid">Sign up</a>
        <?php else: ?>
            <div class="dropdown">
                <a href="#" class="sn-user dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <span class="sn-avatar"><?= $initial ?></span>
                    <?= $display ?>
                </a>
                <ul class="dropdown-menu dropdown-menu-end sn-drop">
                    <li><a class="dropdown-item" href="<?= $profile ?>">Profile</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item" href="<?= $base ?>auth/logout">Sign out</a></li>
                </ul>
            </div>
        <?php endif; ?>
    </div>

    <label for="snCheck" class="sn-toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
    </label>

</nav>

<div class="sn-drawer" id="snDrawer">
    <div class="sn-drawer-inner">
        <a href="<?= $base ?>">Home</a>
        <a href="<?= $base ?>categories">Categories</a>
        <a href="<?= $base ?>regions">Regions</a>
        <a href="<?= $base ?>map">Map</a>
        <a href="<?= $base ?>pages/timeline">Timeline</a>
        <a href="<?= $base ?>pages/instruments">Instruments</a>
        <a href="<?= $base ?>user/contribute">Contribute</a>
        <a href="<?= isset($_SESSION['admin_name']) ? $base . 'admin/feedback' : $base . 'community/feedback' ?>">Feedback</a>
        <a href="<?= $base ?>pages/about">About</a>
        <?php if (isset($_SESSION['admin_name'])): ?>
        <a href="<?= $base ?>admin">Admin Panel</a>
        <?php endif; ?>
        <hr class="sn-drawer-sep">
        <form action="<?= htmlspecialchars($base . 'search') ?>" method="get" class="sn-drawer-search">
            <input type="text" name="q" placeholder="Search dances…" required aria-label="Search">
            <button type="submit" aria-label="Search">Search</button>
        </form>
        <div class="sn-drawer-auth">
            <?php if (!$loggedIn): ?>
                <a href="<?= $base ?>auth/login" class="sn-btn sn-btn-ghost">Login</a>
                <a href="<?= $base ?>auth/register" class="sn-btn sn-btn-solid">Sign up</a>
            <?php else: ?>
                <a href="<?= $profile ?>" class="sn-btn sn-btn-ghost">Profile</a>
                <a href="<?= $base ?>auth/logout" class="sn-btn sn-btn-solid">Sign out</a>
            <?php endif; ?>
        </div>
    </div>
</div>
</div>

