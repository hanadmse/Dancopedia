let toastTimer = null;

function showToast(id, message) {
    if (id === 'toastError' && message) {
        const el = document.getElementById('toastErrorMsg');
        if (el) el.textContent = message;
    }
    const toast = document.getElementById(id);
    if (!toast) return;
    toast.classList.add('fb-toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => hideToast(id), 5000);
}

function hideToast(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('fb-toast--visible');
}

if (document.getElementById('feedbackForm')) {
    const ALLOWED_CONTINENTS = ['africa', 'asia', 'australia', 'europe', 'north_america', 'south_america'];
    const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ'\- ]{2,50}$/;

    function setError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        error.textContent = message;
        field.classList.toggle('invalid', !!message);
    }
    function clearError(fieldId, errorId) { setError(fieldId, errorId, ''); }

    function validateForm() {
        let valid = true, firstInvalid = null;

        const fname = document.getElementById('fname').value.trim();
        if (!fname || !NAME_PATTERN.test(fname)) {
            setError('fname', 'fname-error', 'First name must be 2–50 characters (letters only).');
            if (!firstInvalid) firstInvalid = document.getElementById('fname');
            valid = false;
        } else clearError('fname', 'fname-error');

        const lname = document.getElementById('lname').value.trim();
        if (!lname || !NAME_PATTERN.test(lname)) {
            setError('lname', 'lname-error', 'Last name must be 2–50 characters (letters only).');
            if (!firstInvalid) firstInvalid = document.getElementById('lname');
            valid = false;
        } else clearError('lname', 'lname-error');

        const continent = document.getElementById('continent').value;
        if (!ALLOWED_CONTINENTS.includes(continent)) {
            setError('continent', 'continent-error', 'Please select where you are from.');
            if (!firstInvalid) firstInvalid = document.getElementById('continent');
            valid = false;
        } else clearError('continent', 'continent-error');

        const fb = document.getElementById('feedback').value.trim();
        if (fb.length < 10) {
            setError('feedback', 'feedback-error', 'Feedback must be at least 10 characters.');
            if (!firstInvalid) firstInvalid = document.getElementById('feedback');
            valid = false;
        } else if (fb.length > 300) {
            setError('feedback', 'feedback-error', 'Feedback must be 300 characters or less.');
            if (!firstInvalid) firstInvalid = document.getElementById('feedback');
            valid = false;
        } else clearError('feedback', 'feedback-error');

        if (firstInvalid) firstInvalid.focus();
        return valid;
    }

    ['fname', 'lname'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => clearError(id, id + '-error'));
    });
    document.getElementById('continent').addEventListener('change', () => clearError('continent', 'continent-error'));
    document.getElementById('feedback').addEventListener('input', function () {
        clearError('feedback', 'feedback-error');
        const len     = this.value.length;
        const counter = document.getElementById('feedback-count');
        counter.textContent = len + ' / 300';
        counter.classList.toggle('char-count--warn', len > 270);
    });

    document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!validateForm()) return;
        const btn      = this.querySelector('.form-submit');
        const original = btn.textContent;
        btn.disabled    = true;
        btn.textContent = 'Submitting…';
        try {
            const res  = await fetch('../api/submit_feedback.php', { method: 'POST', body: new FormData(this) });
            const data = await res.json();
            if (data.success) {
                showToast('toastSuccess');
                this.reset();
                document.getElementById('feedback-count').textContent = '0 / 300';
                document.getElementById('feedback-count').classList.remove('char-count--warn');
            } else {
                showToast('toastError', data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            showToast('toastError', 'Connection error — please try again.');
        } finally {
            btn.disabled    = false;
            btn.textContent = original;
        }
    });
}

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
            return `<div class="fb-card">
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
