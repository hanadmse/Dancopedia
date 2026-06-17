<?php
require_once __DIR__ . '/../../app/auth.php';
requireAdmin();
$base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
  <title>Admin Dashboard – Dancopedia Brazil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
  <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
  <link rel="stylesheet" href="../assets/css/Adminhome.css">
  <link rel="stylesheet" href="../assets/css/toolbar.css">
  <script src="../assets/js/toolbar.js" defer></script>
  <link rel="stylesheet" href="../assets/css/Chatbox.css">
  <link rel="preload" href="../assets/js/chatbox.js" as="script">
  <link rel="preload" href="../assets/images/chatbox_face.jpg" as="image">
</head>
<body>
<div id="toolbar-container"></div>
<div id="chatbox-container"></div>

<main>
  <div class="admin-hero">
    <div>
      <p class="admin-hero-label">Dashboard</p>
      <h1>Admin Panel</h1>
      <p class="admin-hero-sub">Signed in as <strong><?php echo htmlspecialchars($_SESSION['admin_name']); ?></strong></p>
    </div>
    <a href="<?= $base ?>auth/logout" class="admin-logout">Sign out</a>
  </div>

  <div class="admin-content">

    <div class="admin-section">
      <div class="admin-section-header">
        <h2 class="admin-section-title">Pending Approval</h2>
        <span class="admin-badge" id="pending-count">0</span>
      </div>
      <div class="admin-card">
        <div id="pending-table-wrap">
          <div class="empty-state">Loading…</div>
        </div>
        <div class="admin-actions">
          <button id="approve-button" class="btn-approve">Approve Selected</button>
          <button id="delete-button" class="btn-reject">Delete Selected</button>
        </div>
      </div>
    </div>

    <div class="admin-section">
      <div class="admin-section-header">
        <h2 class="admin-section-title">All Dances</h2>
      </div>
      <div class="admin-card">
        <table id="all-dances-table" style="width:100%">
          <thead>
            <tr>
              <th>Dance Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Region</th>
              <th>View</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

  </div>
</main>


<div class="modal fade" id="imgPreviewModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content" style="background:#0f1c11;border:none;border-radius:12px;overflow:hidden">
      <div class="modal-header" style="background:rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.1);padding:12px 18px">
        <span class="modal-title" id="imgPreviewLabel" style="color:#fff;font-family:var(--serif);font-weight:700;font-size:1.05rem"></span>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div style="padding:20px;display:flex;align-items:center;justify-content:center;min-height:200px">
        <img id="imgPreviewSrc" src="" alt="" style="max-width:100%;max-height:68vh;border-radius:8px;display:block">
      </div>
    </div>
  </div>
</div>


<div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editModalLabel">Edit Dance</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="editDanceId">

        <div class="mb-3">
          <label class="form-label">Dance name</label>
          <input type="text" class="form-control" id="editDanceName">
        </div>

        <div class="row g-3 mb-3">
          <div class="col-sm-6">
            <label class="form-label">Category</label>
            <select class="form-select" id="editCategory">
              <option value="1">Traditional</option>
              <option value="2">Festival</option>
              <option value="3">Partner</option>
              <option value="4">Pop</option>
            </select>
          </div>
          <div class="col-sm-6">
            <label class="form-label">Region</label>
            <select class="form-select" id="editRegion">
              <option value="1">Rio de Janeiro</option>
              <option value="2">Northeastern Brazil</option>
              <option value="3">Pernambuco</option>
              <option value="4">Bahia</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" id="editDescription" rows="4"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Pin location on map</label>
          <p style="font-size:.8rem;color:var(--muted);margin-bottom:6px;">Click the map to reposition the pin.</p>
          <div id="editMapContainer">
            <img src="../assets/images/brazil-map.jpg" alt="Brazil Map">
          </div>
          <input type="hidden" id="editPinX">
          <input type="hidden" id="editPinY">
        </div>

        <div id="editFeedback"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn-approve" style="width:auto;padding:0 24px;" onclick="saveEdit()">Save changes</button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="../assets/js/adminhome.js"></script>
</body>
</html>
