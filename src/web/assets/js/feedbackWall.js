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
        s.src = "../assets/js/chatbox.js";
        s.defer = true;
        document.body.appendChild(s);
    })
    .catch(e => console.error('Chatbox error:', e));

const CONTINENT_LABELS = {
    africa:        'Africa',
    asia:          'Asia',
    australia:     'Australia / Oceania',
    europe:        'Europe',
    north_america: 'North America',
    south_america: 'South America',
};

function escHtml(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

fetch('../api/fetch_approved_feedback.php')
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById('feedback-grid');
        if (!data.length) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-comment-alt"></i>No feedback yet — be the first to share!</div>';
            return;
        }
        grid.innerHTML = data.map(fb => {
            const initials = (escHtml(fb.fname)[0] || '?') + (escHtml(fb.lname)[0] || '');
            const date     = new Date(fb.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
            const loc      = CONTINENT_LABELS[fb.continent] || escHtml(fb.continent);
            return `
              <div class="fb-card">
                <p class="fb-quote">${escHtml(fb.feedback_text)}</p>
                <div class="fb-meta">
                  <div class="fb-avatar">${escHtml(initials)}</div>
                  <div>
                    <div class="fb-name">${escHtml(fb.fname)} ${escHtml(fb.lname)}</div>
                    <div class="fb-detail"><span class="continent-label">${escHtml(loc)}</span> &middot; ${escHtml(date)}</div>
                  </div>
                </div>
              </div>`;
        }).join('');
    })
    .catch(() => {
        document.getElementById('feedback-grid').innerHTML =
            '<div class="empty-state"><i class="fas fa-exclamation-circle"></i>Could not load feedback.</div>';
    });
