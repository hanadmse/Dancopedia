document.addEventListener("DOMContentLoaded", function () {
    fetch("partials/toolbar.php")
        .then(r => r.text())
        .then(data => {
            document.getElementById("toolbar-container").innerHTML = data;
            document.querySelectorAll('.dropdown-toggle').forEach(el => new bootstrap.Dropdown(el));
        });

    loadDances(null, null);
});

function loadDancopediaChatbox() {
    fetch('partials/chatbox.html')
        .then(r => r.text())
        .then(html => {
            document.getElementById('chatbox-container').innerHTML = html;
            window.dancopediaChatAutoOpen = true;
            const s = document.createElement('script');
            s.src   = "assets/js/chatbox.js";
            s.defer = true;
            document.body.appendChild(s);
        })
        .catch(e => console.error('Chatbox error:', e));
}

document.addEventListener('DOMContentLoaded', loadDancopediaChatbox);
