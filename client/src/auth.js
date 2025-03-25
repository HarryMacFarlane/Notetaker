document.addEventListener("htmx:afterRequest", function(event) {
    if (event.detail.successful) {
        const response = JSON.parse(event.detail.xhr.responseText);
        sessionStorage.setItem("accessToken", response.accessToken);
        window.location.href = "/home";
    }
});

function toggleLoading(action, done = false) {
    const btn = document.getElementById(`${action}-btn`);
    const loader = document.getElementById(`${action}-loading`);
    if (!done) {
        btn.disabled = true;
        loader.style.display = "inline-block";
    } else {
        btn.disabled = false;
        loader.style.display = "none";
    }
}