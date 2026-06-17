fetch('../partials/chatbox.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('chatbox-container').innerHTML = html;
        const s = document.createElement('script');
        s.src = '../assets/js/chatbox.js';
        document.body.appendChild(s);
    })
    .catch(e => console.error('Chatbox error:', e));

document.addEventListener("DOMContentLoaded", function () {
    const descriptionField = document.getElementById("danceDescription");
    descriptionField.required = true;
    descriptionField.maxLength = 5000;

    fetch("../partials/toolbar.php")
        .then(r => r.text())
        .then(data => {
            document.getElementById("toolbar-container").innerHTML = data;
            document.querySelectorAll('.dropdown-toggle').forEach(el => new bootstrap.Dropdown(el));
        });

    const mapContainer = document.getElementById("mapContainer");
    mapContainer.addEventListener("click", function (event) {
        const rect   = mapContainer.getBoundingClientRect();
        const scaleX = 600 / rect.width;
        const scaleY = 600 / rect.height;
        const x = Math.round((event.clientX - rect.left) * scaleX);
        const y = Math.round((event.clientY - rect.top)  * scaleY);

        document.getElementById("pinX").value = x;
        document.getElementById("pinY").value = y;

        let marker = document.getElementById("marker");
        if (!marker) {
            marker = document.createElement("div");
            marker.id        = "marker";
            marker.className = "pin";
            mapContainer.appendChild(marker);
        }
        marker.style.left = (x / 600 * 100) + "%";
        marker.style.top  = (y / 600 * 100) + "%";
    });
});

function showCreateDanceError(message) {
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.textContent = message;
    feedbackDiv.className   = 'err';
}

function validateDanceImage(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxBytes     = 5 * 1024 * 1024;
    if (!file) return 'A dance image is required.';
    if (!allowedTypes.includes(file.type)) return 'Only JPG, PNG, and WebP images are allowed.';
    if (file.size <= 0 || file.size > maxBytes) return 'Image must be under 5 MB.';
    return '';
}

function createDance() {
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.className = '';

    const danceName      = document.getElementById('danceName').value.trim();
    const categoryId     = document.getElementById('danceCategory').value;
    const regionVal      = document.getElementById('danceRegion').value;
    const description    = document.getElementById('danceDescription').value.trim();
    const danceImageFile = document.getElementById('danceImage').files[0];
    const pinX           = document.getElementById('pinX').value;
    const pinY           = document.getElementById('pinY').value;

    const regionMap = { "Rio de Janeiro": 1, "Northeastern Brazil": 2, "Pernambuco": 3, "Bahia": 4 };
    const region    = regionMap[regionVal] ?? regionVal;

    if (danceName.length < 2 || danceName.length > 100) {
        showCreateDanceError('Dance name must be between 2 and 100 characters.');
        return;
    }
    if (!categoryId || !regionVal) {
        showCreateDanceError('Please choose a category and region.');
        return;
    }
    if (!description || description.length > 5000) {
        showCreateDanceError('Description is required and must be 5,000 characters or fewer.');
        return;
    }
    const imageError = validateDanceImage(danceImageFile);
    if (imageError) {
        showCreateDanceError(imageError);
        return;
    }
    if (pinX === '' || pinY === '') {
        showCreateDanceError('Please click the map to place a pin first.');
        return;
    }
    const xNum = Number(pinX);
    const yNum = Number(pinY);
    if (!Number.isInteger(xNum) || !Number.isInteger(yNum) || xNum < 0 || xNum > 600 || yNum < 0 || yNum > 600) {
        showCreateDanceError('Map pin coordinates are invalid.');
        return;
    }

    feedbackDiv.textContent = 'Submitting…';

    const formData = new FormData();
    formData.append('dance_name',  danceName);
    formData.append('category_id', categoryId);
    formData.append('region',      region);
    formData.append('description', description);
    formData.append('pin_x',       pinX);
    formData.append('pin_y',       pinY);
    if (danceImageFile) formData.append('dance_image', danceImageFile);

    fetch('../api/create_dance.php', {
        method:  'POST',
        headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content },
        body:    formData
    })
        .then(r => r.json())
        .then(data => {
            feedbackDiv.textContent = data.message || data.error || 'Submission complete.';
            feedbackDiv.className   = data.success ? 'ok' : 'err';
        })
        .catch(err => {
            feedbackDiv.textContent = err.message || 'Submission failed.';
            feedbackDiv.className   = 'err';
        });
}
