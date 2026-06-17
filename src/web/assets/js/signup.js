document.addEventListener("DOMContentLoaded", function () {
    fetch("../partials/toolbar.php")
        .then(response => response.text())
        .then(data => {
            document.getElementById("toolbar-container").innerHTML = data;
            document.querySelectorAll('.dropdown-toggle').forEach(function (el) {
                new bootstrap.Dropdown(el);
            });
        });
});
