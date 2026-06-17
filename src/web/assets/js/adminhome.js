document.addEventListener("DOMContentLoaded", function () {
    fetch("../partials/toolbar.php")
        .then(r => r.text())
        .then(data => {
            document.getElementById("toolbar-container").innerHTML = data;
            document.querySelectorAll('.dropdown-toggle').forEach(el => new bootstrap.Dropdown(el));
        });
});

fetch('../partials/chatbox.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('chatbox-container').innerHTML = html;
        const s = document.createElement('script');
        s.src   = "../assets/js/chatbox.js";
        s.defer = true;
        document.body.appendChild(s);
    })
    .catch(e => console.error('Chatbox error:', e));

const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

function escHtml(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function adminImgUrl(url) {
    if (!url) return '';
    return /^(https?:\/\/|\/)/.test(url) ? url : '../' + url;
}

function loadDances() {
    fetch('../api/fetch_dances.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ approved: 2 })
    })
        .then(r => r.json())
        .then(data => {
            const wrap = document.getElementById('pending-table-wrap');
            document.getElementById('pending-count').textContent = data.length;

            if (!data.length) {
                wrap.innerHTML = '<div class="empty-state">No dances pending approval.</div>';
                return;
            }

            let html = `<table class="pending-table">
              <thead><tr>
                <th style="width:44px"></th>
                <th style="width:88px">Image</th>
                <th>Dance Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Region</th>
              </tr></thead><tbody>`;

            data.forEach(dance => {
                const id      = parseInt(dance.dance_id, 10) || 0;
                const imgCell = dance.media_url
                    ? `<img class="dance-thumb" src="${escHtml(adminImgUrl(dance.media_url))}" alt="${escHtml(dance.alttext)}" data-name="${escHtml(dance.dance_name)}">`
                    : `<div class="no-thumb-cell"><i class="fas fa-image"></i></div>`;
                html += `<tr>
                  <td><input type="checkbox" class="dance-checkbox" value="${id}"></td>
                  <td>${imgCell}</td>
                  <td>${escHtml(dance.dance_name)}</td>
                  <td class="desc-cell">${escHtml(dance.description) || '—'}</td>
                  <td>${escHtml(dance.category)}</td>
                  <td>${escHtml(dance.region)}</td>
                </tr>`;
            });

            html += `</tbody></table>`;
            wrap.innerHTML = html;
        })
        .catch(() => {
            document.getElementById('pending-table-wrap').innerHTML =
                '<div class="empty-state">Error loading dances.</div>';
        });
}

loadDances();

document.getElementById('pending-table-wrap').addEventListener('click', function (e) {
    const img = e.target.closest('.dance-thumb');
    if (!img) return;
    document.getElementById('imgPreviewSrc').src               = img.src;
    document.getElementById('imgPreviewSrc').alt               = img.alt;
    document.getElementById('imgPreviewLabel').textContent     = img.dataset.name;
    new bootstrap.Modal(document.getElementById('imgPreviewModal')).show();
});

function getSelectedIds() {
    return [...document.querySelectorAll('.dance-checkbox:checked')].map(c => c.value);
}

document.getElementById('approve-button').addEventListener('click', function () {
    const ids = getSelectedIds();
    if (!ids.length) { alert('Select at least one dance to approve.'); return; }
    fetch('../api/approve_dance.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body:    JSON.stringify({ danceIds: ids })
    })
        .then(r => r.json())
        .then(result => { alert(result.message || result.error); loadDances(); })
        .catch(err => console.error('Error approving:', err));
});

document.getElementById('delete-button').addEventListener('click', function () {
    const ids = getSelectedIds();
    if (!ids.length) { alert('Select at least one dance to delete.'); return; }
    if (!confirm('Delete selected dances?')) return;
    fetch('../api/disapprove_dance.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body:    JSON.stringify({ danceIds: ids })
    })
        .then(r => r.json())
        .then(result => { alert(result.message || result.error); loadDances(); })
        .catch(err => console.error('Error deleting:', err));
});

const allDancesTable = $('#all-dances-table').DataTable({
    ajax: {
        url:         "../api/fetch_dances.php",
        type:        "POST",
        contentType: "application/json",
        data:        function () { return JSON.stringify({}); },
        dataSrc:     ""
    },
    columns: [
        { data: "dance_name",   render: $.fn.dataTable.render.text() },
        { data: "description",  render: $.fn.dataTable.render.text(), className: "desc-cell", defaultContent: "—" },
        { data: "category",     render: $.fn.dataTable.render.text() },
        { data: "region",       render: $.fn.dataTable.render.text() },
        {
            data: "slug",
            render: function (slug) {
                return `<a class="view-link" href="../dances/${encodeURIComponent(slug)}" target="_blank">View</a>`;
            }
        },
        {
            data:     "dance_id",
            orderable: false,
            render:   function (id) {
                return `<button class="btn-edit-dance" onclick="openEditModal(${encodeURIComponent(id)})">Edit</button>`;
            }
        },
        { data: "x",           visible: false },
        { data: "y",           visible: false },
        { data: "region_id",   visible: false },
        { data: "category_id", visible: false },
    ],
    pageLength: 10,
    order:      [[0, "asc"]],
    autoWidth:  false
});

function openEditModal(danceId) {
    const rows  = allDancesTable.rows().data().toArray();
    const dance = rows.find(d => d.dance_id == danceId);
    if (!dance) return;

    document.getElementById('editDanceId').value         = dance.dance_id;
    document.getElementById('editDanceName').value       = dance.dance_name;
    document.getElementById('editDescription').value     = dance.description || '';
    document.getElementById('editCategory').value        = dance.category_id;
    document.getElementById('editRegion').value          = dance.region_id;
    document.getElementById('editPinX').value            = dance.x;
    document.getElementById('editPinY').value            = dance.y;
    document.getElementById('editFeedback').textContent  = '';
    document.getElementById('editFeedback').className    = '';

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();

    document.getElementById('editModal').addEventListener('shown.bs.modal', function onShown() {
        placeEditPin(dance.x, dance.y);
        this.removeEventListener('shown.bs.modal', onShown);
    }, { once: true });
}

function placeEditPin(x, y) {
    const container = document.getElementById('editMapContainer');
    let marker = document.getElementById('editMarker');
    if (!marker) {
        marker            = document.createElement('div');
        marker.id         = 'editMarker';
        marker.className  = 'edit-pin';
        container.appendChild(marker);
    }
    marker.style.left = (x / 600 * 100) + '%';
    marker.style.top  = (y / 600 * 100) + '%';
}

document.getElementById('editMapContainer').addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const x    = Math.round((e.clientX - rect.left) / rect.width  * 600);
    const y    = Math.round((e.clientY - rect.top)  / rect.height * 600);
    document.getElementById('editPinX').value = x;
    document.getElementById('editPinY').value = y;
    placeEditPin(x, y);
});

function saveEdit() {
    const fb = document.getElementById('editFeedback');
    fb.className    = '';
    fb.textContent  = 'Saving…';

    const payload = {
        dance_id:    parseInt(document.getElementById('editDanceId').value),
        dance_name:  document.getElementById('editDanceName').value.trim(),
        region:      parseInt(document.getElementById('editRegion').value),
        category:    parseInt(document.getElementById('editCategory').value),
        description: document.getElementById('editDescription').value.trim(),
        pin_x:       parseInt(document.getElementById('editPinX').value) || 0,
        pin_y:       parseInt(document.getElementById('editPinY').value) || 0,
    };

    if (!payload.dance_name || !payload.region || !payload.category) {
        fb.textContent = 'Name, region, and category are required.';
        fb.className   = 'err';
        return;
    }

    fetch('../api/updateDance.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body:    JSON.stringify(payload)
    })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                fb.textContent = 'Saved!';
                fb.className   = 'ok';
                allDancesTable.ajax.reload(null, false);
                setTimeout(() => bootstrap.Modal.getInstance(document.getElementById('editModal')).hide(), 900);
            } else {
                fb.textContent = result.error || 'Save failed.';
                fb.className   = 'err';
            }
        })
        .catch(() => { fb.textContent = 'Network error.'; fb.className = 'err'; });
}
