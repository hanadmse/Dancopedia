DancopediaBreadcrumbs.render([
    { label: 'Home', href: DancopediaBreadcrumbs.basePath },
    { label: 'Map' }
]);

document.addEventListener("DOMContentLoaded", function () {
    fetch("partials/toolbar.php")
        .then(r => r.text())
        .then(data => {
            document.getElementById("toolbar-container").innerHTML = data;
            document.querySelectorAll('.dropdown-toggle').forEach(el => new bootstrap.Dropdown(el));
        });
});

fetch('partials/chatbox.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('chatbox-container').innerHTML = html;
        const s = document.createElement('script');
        s.src   = "assets/js/chatbox.js";
        s.defer = true;
        document.body.appendChild(s);
    })
    .catch(e => console.error('Chatbox error:', e));

const MAP_BASE = 600;
let activePin  = null;

function loadMapDances() {
    fetch('api/fetch_map_dances.php')
        .then(r => r.json())
        .then(data => {
            if (data.error) { console.error(data.error); return; }

            const threshold = 20;
            const clusters  = [];

            data.forEach(dance => {
                let added = false;
                for (const cluster of clusters) {
                    const dx = dance.x - cluster.center.x;
                    const dy = dance.y - cluster.center.y;
                    if (Math.sqrt(dx * dx + dy * dy) < threshold) {
                        cluster.dances.push(dance);
                        let sx = 0, sy = 0;
                        cluster.dances.forEach(d => { sx += d.x; sy += d.y; });
                        cluster.center.x = sx / cluster.dances.length;
                        cluster.center.y = sy / cluster.dances.length;
                        added = true;
                        break;
                    }
                }
                if (!added) clusters.push({ center: { x: dance.x, y: dance.y }, dances: [dance] });
            });

            const container = document.getElementById('mapContainer');
            clusters.forEach(cluster => {
                const pin = document.createElement('div');
                pin.className  = 'pin';
                pin.style.left = (cluster.center.x / MAP_BASE * 100) + '%';
                pin.style.top  = (cluster.center.y / MAP_BASE * 100) + '%';
                if (cluster.dances.length > 1) pin.textContent = cluster.dances.length;
                pin.addEventListener('click', () => {
                    if (activePin) activePin.classList.remove('active');
                    pin.classList.add('active');
                    activePin = pin;
                    openCard(cluster.dances);
                });
                container.appendChild(pin);
            });
        })
        .catch(err => console.error('Error loading dances:', err));
}

function openCard(dances) {
    const idle = document.getElementById('panelIdle');
    const card = document.getElementById('panelCard');

    let html = '<div class="map-card" style="position:relative;">';
    html += '<button class="card-close" onclick="closeCard()" aria-label="Close">&times;</button>';

    if (dances.length === 1) {
        const d = dances[0];
        html += `<div class="map-card-header">
                   <div>
                     <h3 class="card-title">${d.dance_name}</h3>
                     <span class="card-region-tag">${d.region}</span>
                   </div>
                 </div>`;
        if (d.media_url) {
            html += `<div class="card-img-wrap"><img src="${d.media_url}" alt="${d.alttext || d.dance_name}"></div>`;
        }
        if (d.description) {
            html += `<p class="card-desc">${d.description}</p>`;
        }
        html += `<button class="card-btn" onclick="goToDancePage('${encodeURIComponent(d.slug || '')}')">
                   View dance page
                 </button>`;
    } else {
        html += `<h3 class="card-title" style="margin-bottom:6px;">${dances[0].region || 'This area'}</h3>`;
        html += `<p class="card-count">${dances.length} dances in this location</p>`;
        html += '<ul class="dance-list">';
        dances.forEach(d => {
            html += `<li onclick="goToDancePage('${encodeURIComponent(d.slug || '')}')">${d.dance_name}</li>`;
        });
        html += '</ul>';
    }

    html += '</div>';
    card.innerHTML        = html;
    idle.style.display    = 'none';
    card.style.display    = 'block';
}

function closeCard() {
    document.getElementById('panelIdle').style.display = 'block';
    document.getElementById('panelCard').style.display = 'none';
    if (activePin) { activePin.classList.remove('active'); activePin = null; }
}

function goToDancePage(slug) {
    if (!slug) return;
    sessionStorage.setItem('danceFrom', window.location.pathname);
    window.location.href = 'dances/' + slug;
}

document.addEventListener('DOMContentLoaded', loadMapDances);
