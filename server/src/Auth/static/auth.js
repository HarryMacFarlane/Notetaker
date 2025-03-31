function toggleForm() {
    document.getElementById("signin-form").classList.toggle("active");
    document.getElementById("register-form").classList.toggle("active");
}

function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

window.onload = function () {
    let refreshToken = getCookie("refresh_token");
    if (refreshToken) {
        fetch("/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken })
        }).then(response => response.status).then(code => {
            if (code === 200) {
                window.location.href = "/dashboard"; // Redirect to dashboard if token is valid
            } 
            else {
                console.log("Token expired or invalid, please sign in again.");
            }
        }).catch(error => console.error("Error verifying token:", error));
    }
};