window.onload = function () {
    const refreshToken = getCookie("refresh_token");
    if (refreshToken) {
        try {
            fetch("/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${refreshToken}` },
            }).then(response => {
                if (!response.ok) {
                    return;
                }
                else {
                    response.json().then(
                        (data) => {
                            sessionStorage.setItem("token", data.get("access_token"));
                            sessionStorage.setItem("timestamp", data.get("timestamp"));
                            window.location.href = "/dashboard";
                        }
                    )
                }
            })
        }
        catch(error) {
            console.error("Error verifying token:", error)
        }
    }
    else {
        console.log('No refresh token found, try again later');
    }
};

async function submitForm (event) {
    event.preventDefault(); // Prevent form submission
    const form = event.target;
    
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData);
    const userData = JSON.stringify(dataObject);
    const action = form.getAttribute("action");
    const method = "POST";
    try {
        console.log(userData);
        // REPLACE THIS WITH PROXY SERVER
        fetch(`${action}`, {
            headers: {
                "Content-Type": "application/json"
            }
            ,
            method: method,
            body: userData,
            credentials: "include" // Include cookies in the request
        }).then(
                (response) => {
                    console.log('Received Response');
                    if (!response.ok) {
                        console.log("Error:", response.statusText);
                        document.getElementById("error").innerHTML = "Invalid email or password. Please try again.";
                        return;
                    }
                    else {
                        response.json().then(
                            (data) => {
                                sessionStorage.setItem("token", data.access_token);
                                sessionStorage.setItem("timestamp", data.timestamp);
                                window.location.href = "/dashboard"; // Redirect to dashboard on success
                                return
                            }
                        );
                    }
                }
            )
    }
    catch (error) {
        console.log(`Error: ${error}`);
    }
}

function toggleForm() {
    document.getElementById("signin-form-div").classList.toggle("active");
    document.getElementById("register-form-div").classList.toggle("active");
    document.getElementById("error").innerHTML = "";
}

function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}