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

const CSRF = document.querySelector('meta[name="csrf-token"]').content;

function escHtml(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function approveFeedback(id, btn) {
    btn.disabled    = true;
    btn.textContent = 'Approving…';
    try {
        const res  = await fetch('../api/approve_feedback.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': CSRF },
            body:    JSON.stringify({ feedbackId: id }),
        });
        const data = await res.json();
        if (data.message) {
            const cell = btn.closest('td');
            cell.innerHTML = '<span class="badge-approved"><i class="fas fa-check"></i> Approved</span>';
        } else {
            btn.disabled    = false;
            btn.textContent = 'Approve';
            alert(data.error || 'Something went wrong.');
        }
    } catch {
        btn.disabled    = false;
        btn.textContent = 'Approve';
        alert('Connection error — please try again.');
    }
}

fetch("../api/fetch_feedback.php")
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById("feedback-table-container");
        if (!data.length) {
            container.innerHTML = '<div class="empty-state"><i class="far fa-comment-alt"></i>No feedback submitted yet.</div>';
            return;
        }

        let table = `
          <table class="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>First name</th>
                <th>Last name</th>
                <th>From</th>
                <th>Feedback</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>`;

        data.forEach(fb => {
            const statusCell = fb.approved
                ? `<span class="badge-approved"><i class="fas fa-check"></i> Approved</span>`
                : `<button class="btn-approve" onclick="approveFeedback(${parseInt(fb.id, 10)}, this)"><i class="fas fa-check"></i> Approve</button>`;

            table += `
              <tr>
                <td>${parseInt(fb.id, 10) || 0}</td>
                <td>${escHtml(fb.username)}</td>
                <td>${escHtml(fb.fname)}</td>
                <td>${escHtml(fb.lname)}</td>
                <td>${escHtml(fb.continent)}</td>
                <td>${escHtml(fb.feedback_text)}</td>
                <td>${escHtml(new Date(fb.created_at).toLocaleDateString())}</td>
                <td>${statusCell}</td>
              </tr>`;
        });

        table += `</tbody></table>`;
        container.innerHTML = table;
    })
    .catch(err => {
        console.error("Failed to load feedback:", err);
        document.getElementById("feedback-table-container").innerHTML =
            '<div class="empty-state"><i class="fas fa-exclamation-circle"></i> Error loading feedback.</div>';
    });
