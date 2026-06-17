const CAT_MAP = {
    'traditional': { label: 'Traditional', path: 'categories/traditional' },
    'festival':    { label: 'Festival',    path: 'categories/festival'    },
    'partner':     { label: 'Partner',     path: 'categories/partner'     },
    'pop':         { label: 'Pop',         path: 'categories/pop'         },
};
const REGION_MAP = {
    'rio-de-janeiro':      { label: 'Rio de Janeiro',      path: 'regions/rio-de-janeiro'      },
    'riodejaneiro':        { label: 'Rio de Janeiro',      path: 'regions/rio-de-janeiro'      },
    'northeastern-brazil': { label: 'Northeastern Brazil', path: 'regions/northeastern-brazil' },
    'northeasternbrazil':  { label: 'Northeastern Brazil', path: 'regions/northeastern-brazil' },
    'pernambuco':          { label: 'Pernambuco',          path: 'regions/pernambuco'          },
    'bahia':               { label: 'Bahia',               path: 'regions/bahia'               },
};
const ORIGIN_MAP = {
    'map':    { label: 'Map',    path: 'map'    },
    'search': { label: 'Search', path: 'search' },
};
const CAT_NAME_MAP = {
    'Traditional': 'traditional',
    'Festival':    'festival',
    'Partner':     'partner',
    'Pop':         'pop',
};

function getBreadcrumbSource() {
    const storedPath  = sessionStorage.getItem('danceFrom') || '';
    const referrerPath = (() => {
        if (!document.referrer) return '';
        try {
            const referrer = new URL(document.referrer);
            return referrer.origin === window.location.origin
                ? referrer.pathname + referrer.search
                : '';
        } catch (_) {
            return '';
        }
    })();

    const sourcePath = storedPath || referrerPath;
    let sourceUrl;
    try {
        sourceUrl = new URL(sourcePath, window.location.origin);
    } catch (_) {
        sourceUrl = new URL('/', window.location.origin);
    }

    const parts    = sourceUrl.pathname.split('/').filter(Boolean);
    const pageName = (parts.pop() || '')
        .replace(/\.(php|html)$/, '')
        .toLowerCase();

    return {
        pageName,
        from:   sourceUrl.searchParams.get('from') || '',
        search: sourceUrl.search
    };
}

function updateBreadcrumb(dance) {
    const list = document.querySelector('.bc-list');
    if (!list) return;

    const base     = window.API_BASE;
    const source   = getBreadcrumbSource();
    const pageName = source.pageName;
    const sep      = '<span class="bc-sep" aria-hidden="true">/</span>';

    const items = [`<li class="bc-item"><a href="${base}">Home</a>${sep}</li>`];

    if (source.from === 'map' && REGION_MAP[pageName]) {
        const { label, path } = REGION_MAP[pageName];
        items.push(`<li class="bc-item"><a href="${base}map">Map</a>${sep}</li>`);
        items.push(`<li class="bc-item"><a href="${base}${path}?from=map">${label}</a>${sep}</li>`);
    } else if (ORIGIN_MAP[pageName]) {
        const { label, path } = ORIGIN_MAP[pageName];
        const href = pageName === 'search' ? `${base}${path}${source.search}` : `${base}${path}`;
        items.push(`<li class="bc-item"><a href="${href}">${label}</a>${sep}</li>`);
    } else if (CAT_MAP[pageName]) {
        const { label, path } = CAT_MAP[pageName];
        items.push(`<li class="bc-item"><a href="${base}categories">Categories</a>${sep}</li>`);
        items.push(`<li class="bc-item"><a href="${base}${path}">${label}</a>${sep}</li>`);
    } else if (REGION_MAP[pageName]) {
        const { label, path } = REGION_MAP[pageName];
        items.push(`<li class="bc-item"><a href="${base}regions">Regions</a>${sep}</li>`);
        items.push(`<li class="bc-item"><a href="${base}${path}">${label}</a>${sep}</li>`);
    } else if (CAT_NAME_MAP[dance.category]) {
        const catSlug = CAT_NAME_MAP[dance.category];
        items.push(`<li class="bc-item"><a href="${base}categories">Categories</a>${sep}</li>`);
        items.push(`<li class="bc-item"><a href="${base}categories/${catSlug}">${dance.category}</a>${sep}</li>`);
    }

    items.push(`<li class="bc-item bc-item--current"><span>${escapeHtml(dance.dance_name)}</span></li>`);
    list.innerHTML = items.join('');
}

document.addEventListener("DOMContentLoaded", () => {
    const slug = PAGE_SLUG || window.location.pathname.split('/').filter(Boolean).pop();
    if (!slug) return;
    loadSingleDanceBySlug(slug).then(dance => {
        if (!dance) return;
        document.title = dance.dance_name + ' – Dancopedia Brazil';
        updateBreadcrumb(dance);
    });
});

document.addEventListener("click", (e) => {
    if (e.target.matches(".dance-delete-btn")) {
        deleteDance(e.target.getAttribute("data-dance-id"));
    }
});

function deleteDance(danceId) {
    if (!confirm("Are you sure you want to delete this dance?")) return;
    fetch("../api/deleteDance.php", {
        method:  "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body:    JSON.stringify({ id: danceId })
    })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                alert("Dance deleted successfully!");
                window.location.href = "../";
            } else {
                alert(data.error || "Failed to delete dance.");
            }
        })
        .catch(err => { console.error(err); alert("Error deleting dance."); });
}

document.addEventListener("click", function (e) {
    if (!e.target.matches(".dance-update-btn")) return;

    const button    = e.target;
    const dancePage = button.closest(".dance-page");

    const danceNameEl = dancePage.querySelector(".dp-content-title");
    const regionEl    = dancePage.querySelector(".dp-meta-region");
    const categoryEl  = dancePage.querySelector(".dp-meta-category");
    const descEl      = dancePage.querySelector(".danceDescription");

    if (button.textContent === "Update") {
        const currentRegion   = regionEl.textContent.replace('Region:', '').trim();
        const currentCategory = categoryEl.textContent.replace('Category:', '').trim();

        danceNameEl.innerHTML = `<input type="text" value="${danceNameEl.textContent.trim()}" id="updateDanceName" class="form-control">`;

        regionEl.innerHTML = `
          <strong>Region:</strong>
          <select id="updateDanceRegion" class="form-select mt-1">
            <option value="1" ${currentRegion === "Rio de Janeiro"      ? "selected" : ""}>Rio de Janeiro</option>
            <option value="2" ${currentRegion === "Northeastern Brazil" ? "selected" : ""}>Northeastern Brazil</option>
            <option value="3" ${currentRegion === "Pernambuco"          ? "selected" : ""}>Pernambuco</option>
            <option value="4" ${currentRegion === "Bahia"               ? "selected" : ""}>Bahia</option>
          </select>`;

        categoryEl.innerHTML = `
          <strong>Category:</strong>
          <select id="updateDanceCategory" class="form-select mt-1">
            <option value="1" ${currentCategory === "Traditional" ? "selected" : ""}>Traditional</option>
            <option value="2" ${currentCategory === "Festival"    ? "selected" : ""}>Festival</option>
            <option value="3" ${currentCategory === "Partner"     ? "selected" : ""}>Partner</option>
            <option value="4" ${currentCategory === "Pop"         ? "selected" : ""}>Pop</option>
          </select>`;

        descEl.innerHTML = `<textarea id="updateDanceDescription" class="form-control mt-1" rows="5">${descEl.textContent.trim()}</textarea>`;
        button.textContent = "Submit";
    } else {
        const updatedName    = document.getElementById("updateDanceName").value;
        const regionSelect   = document.getElementById("updateDanceRegion");
        const categorySelect = document.getElementById("updateDanceCategory");
        const updatedDesc    = document.getElementById("updateDanceDescription").value;
        const danceId        = button.getAttribute("data-dance-id");

        fetch("../api/updateDance.php", {
            method:  "POST",
            headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
            body:    JSON.stringify({
                dance_id:    danceId,
                dance_name:  updatedName,
                region:      regionSelect.value,
                category:    categorySelect.value,
                description: updatedDesc
            })
        })
            .then(r => { if (!r.ok) throw new Error("Server error " + r.status); return r.json(); })
            .then(data => {
                if (!data.success) {
                    alert("Update failed: " + (data.error || "Unknown error"));
                    return;
                }
                alert("Dance updated successfully!");
                danceNameEl.textContent = updatedName;
                regionEl.innerHTML      = `<strong>Region:</strong> ${regionSelect.options[regionSelect.selectedIndex].text}`;
                categoryEl.innerHTML    = `<strong>Category:</strong> ${categorySelect.options[categorySelect.selectedIndex].text}`;
                descEl.textContent      = updatedDesc;
                button.textContent      = "Update";
                if (data.slug) history.replaceState(null, '', data.slug);
            })
            .catch(err => alert("Error updating dance: " + err.message));
    }
});
