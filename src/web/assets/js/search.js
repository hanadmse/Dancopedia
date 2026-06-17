DancopediaBreadcrumbs.render([
    { label: 'Home', href: DancopediaBreadcrumbs.basePath },
    { label: 'Search' }
]);

document.addEventListener("DOMContentLoaded", function () {
    const urlQuery = new URLSearchParams(window.location.search).get('q');
    if (urlQuery) {
        try { sessionStorage.setItem('dancopedia.search.q', urlQuery); } catch (_) {}
        history.replaceState(null, '', window.location.pathname);
    }
    let query = '';
    try { query = sessionStorage.getItem('dancopedia.search.q') || ''; } catch (_) {}
    if (query) {
        document.getElementById("searchInput").value = query;
        searchDance();
    }

    fetch("partials/toolbar.php")
        .then(r => r.text())
        .then(data => {
            document.getElementById("toolbar-container").innerHTML = data;
            document.querySelectorAll('.dropdown-toggle').forEach(el => new bootstrap.Dropdown(el));
        });

    fetch("partials/chatbox.html")
        .then(r => r.text())
        .then(html => {
            document.getElementById("chatbox-container").innerHTML = html;
            const s = document.createElement("script");
            s.src = "assets/js/chatbox.js";
            document.body.appendChild(s);
        });
});

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function toSlug(name) {
    return (name || '').toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function searchDance() {
    const query     = document.getElementById("searchInput").value.trim();
    const container = document.getElementById("danceContainer");
    const heading   = document.getElementById("resultsHeading");
    try {
        if (query) sessionStorage.setItem('dancopedia.search.q', query);
        else sessionStorage.removeItem('dancopedia.search.q');
    } catch (_) {}
    if (!query) {
        container.innerHTML = '<p class="results-status">Please enter a search term.</p>';
        heading.style.display = "block";
        return;
    }

    container.innerHTML   = '<p class="results-status">Searching…</p>';
    heading.style.display = "block";

    fetch("api/dance_search.php?search=" + encodeURIComponent(query))
        .then(r => r.json())
        .then(data => {
            container.innerHTML = "";
            if (data && data.length) {
                data.forEach(dance => {
                    const slug = encodeURIComponent(dance.slug || toSlug(dance.dance_name));
                    container.insertAdjacentHTML("beforeend", `
                      <div class="dance" onclick="goToDancePage('${slug}')">
                        <h3 class="danceName">${escapeHtml(dance.dance_name)}</h3>
                        ${dance.media_url ? `<img src="${escapeHtml(dance.media_url)}" alt="${escapeHtml(dance.alttext)}">` : ""}
                        <p class="danceDescription">${escapeHtml(dance.description) || "No description available."}</p>
                        <p class="danceRegion"><strong>Region:</strong> ${escapeHtml(dance.region) || "Unknown"}</p>
                        <p class="danceCategory"><strong>Category:</strong> ${escapeHtml(dance.category) || "Uncategorized"}</p>
                      </div>`);
                });
            } else {
                container.innerHTML = '<p class="results-status">No dances found for that search.</p>';
            }
        })
        .catch(() => { container.innerHTML = '<p class="results-status">Error loading results. Please try again.</p>'; });
}

function goToDancePage(slug) {
    if (!slug) return;
    sessionStorage.setItem('danceFrom', window.location.pathname);
    window.location.href = 'dances/' + slug;
}

document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") searchDance();
});
