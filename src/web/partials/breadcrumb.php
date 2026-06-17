<div class="bc-wrap">
  <nav class="bc-inner" aria-label="Breadcrumb">
    <ol class="bc-list">
      <?php foreach ($crumbs as $i => $crumb):
        $isLast = ($i === count($crumbs) - 1); ?>
        <li class="bc-item<?= $isLast ? ' bc-item--current' : '' ?>">
          <?php if (!$isLast && !empty($crumb[1])): ?>
            <a href="<?= htmlspecialchars($crumb[1]) ?>"><?= htmlspecialchars($crumb[0]) ?></a>
          <?php else: ?>
            <span><?= htmlspecialchars($crumb[0]) ?></span>
          <?php endif; ?>
          <?php if (!$isLast): ?><span class="bc-sep" aria-hidden="true">/</span><?php endif; ?>
        </li>
      <?php endforeach; ?>
    </ol>
  </nav>
</div>
