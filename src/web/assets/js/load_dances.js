function toSlug(name) {
    return name.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeHtml(text) {
    if (typeof text !== 'string') return text ?? '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function resolveImgUrl(url) {
    if (!url) return '';
    return /^(https?:\/\/|\/)/.test(url) ? url : (window.API_BASE || '') + url;
}

function imgOrPlaceholder(dance) {
    return dance.media_url
        ? `<div class="dance-img-wrap"><img src="${escapeHtml(resolveImgUrl(dance.media_url))}" alt="${escapeHtml(dance.alttext)}"></div>`
        : `<div class="dance-no-img"></div>`;
}

const SPINNER = `<div style="display:flex;justify-content:center;align-items:center;padding:60px 0">
  <div class="spinner-border" role="status" style="color:#0a7a52;width:2.5rem;height:2.5rem">
    <span class="visually-hidden">Loading…</span>
  </div>
</div>`;

function loadDances(region = null, category = null) {
    const danceContainer = document.getElementById("danceContainer");
    danceContainer.innerHTML = SPINNER;

    fetch((window.API_BASE||'') + "api/fetch_dances.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, category })
    })
    .then(r => r.json())
    .then(data => {
        if (danceContainer.classList.contains("scrolling")) {
            danceContainer.innerHTML = "<div class='dance-wrapper'></div>";
            const wrapper = danceContainer.querySelector(".dance-wrapper");
            if (data.length) {
                data.forEach(dance => {
                    const slug = dance.slug || toSlug(dance.dance_name);
                    wrapper.insertAdjacentHTML("beforeend", `
                        <div class="dance" data-dance-id="${dance.dance_id}" data-dance-slug="${escapeHtml(slug)}">
                            <h3 class="danceName">${escapeHtml(dance.dance_name)}</h3>
                            ${imgOrPlaceholder(dance)}
                        </div>`);
                });
            } else {
                wrapper.innerHTML = "<p>No dances found.</p>";
            }
        } else {
            danceContainer.innerHTML = "";
            if (data.length) {
                data.forEach(dance => {
                    const slug = dance.slug || toSlug(dance.dance_name);
                    danceContainer.insertAdjacentHTML("beforeend", `
                        <div class="dance" data-dance-id="${dance.dance_id}" data-dance-slug="${escapeHtml(slug)}">
                            <h3 class="danceName">${escapeHtml(dance.dance_name)}</h3>
                            ${imgOrPlaceholder(dance)}
                            <p class="danceDescription">${escapeHtml(dance.description) || "No description available."}</p>
                            <p class="danceRegion"><strong>Region:</strong> ${escapeHtml(dance.region) || "Unknown"}</p>
                            <p class="danceCategory"><strong>Category:</strong> ${escapeHtml(dance.category) || "Uncategorized"}</p>
                        </div>`);
                });
            } else {
                danceContainer.innerHTML = "<p>No dances found.</p>";
            }
        }
    })
    .catch(err => {
        console.error("Error fetching dances:", err);
        danceContainer.innerHTML = "<p>Error loading data.</p>";
    });
}

function loadSingleDance(danceId) {
    return _fetchAndRenderDance({ id: danceId });
}

function loadSingleDanceBySlug(slug) {
    return _fetchAndRenderDance({ slug });
}

function _fetchAndRenderDance(filter) {
    const danceContainer = document.getElementById("danceContainer");
    danceContainer.innerHTML = SPINNER;
    danceContainer.classList.add("dp-single-view");

    return fetch((window.API_BASE||'') + "api/fetch_dances.php", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(filter)
    })
    .then(r => r.json())
    .then(data => {
        danceContainer.innerHTML = "";
        if (Array.isArray(data) && data.length > 0) {
            danceContainer.insertAdjacentHTML("beforeend", createDancePage(data[0]));
            return data[0];
        }
        danceContainer.innerHTML = "<p>No dance found.</p>";
        return null;
    })
    .catch(err => {
        console.error("Error fetching dance:", err);
        danceContainer.innerHTML = "<p>Error loading data.</p>";
        return null;
    });
}

document.addEventListener("click", function(e) {
    const card = e.target.closest(".dance[data-dance-id]");
    if (card) {
        sessionStorage.setItem('danceFrom', window.location.pathname + window.location.search);
        const slug = card.getAttribute("data-dance-slug") || toSlug(card.querySelector(".danceName")?.textContent || '');
        window.location.href = (window.API_BASE||'') + "dances/" + slug;
    }
});

function createDancePage(dance) {
    const heroMedia = dance.media_url
        ? `<img class="dp-hero-img" src="${escapeHtml(resolveImgUrl(dance.media_url))}" alt="${escapeHtml(dance.alttext)}">`
        : `<div class="dp-hero-placeholder"></div>`;

    const adminBtns = (typeof isAdmin !== 'undefined' && isAdmin) ? `
        <div class="dp-actions">
            <button class="dp-btn dp-btn--update dance-update-btn" data-dance-id="${dance.dance_id}">Update</button>
            <button class="dp-btn dp-btn--delete dance-delete-btn" data-dance-id="${dance.dance_id}">Delete</button>
        </div>` : '';

    return `
        <div class="dance-page" data-dance-id="${dance.dance_id}">
            <div class="dp-hero">
                ${heroMedia}
            </div>
            <div class="dp-content">
                <h2 class="dp-content-title">${escapeHtml(dance.dance_name)}</h2>
                <div class="dance-details">
                    <div class="dp-meta-strip">
                        <p class="dp-meta-region">
                            <strong>Region:</strong> ${escapeHtml(dance.region)}
                        </p>
                        <p class="dp-meta-category">
                            <strong>Category:</strong> ${escapeHtml(dance.category)}
                        </p>
                    </div>
                    <h3 class="dp-desc-label">About this Dance</h3>
                    <p class="danceDescription">${escapeHtml(dance.description)}</p>
                    ${adminBtns}
                </div>
            </div>
        </div>`;
}
