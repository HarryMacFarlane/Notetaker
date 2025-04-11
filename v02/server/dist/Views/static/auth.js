"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.onload = function () {
    fetch("/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
    })
        .then(response => {
        if (!response.ok) {
            throw Error(`Could not refresh token: ${response.status}`);
        }
        else {
            if (navigator.cookieEnabled) {
                window.location.href = "/dashboard";
                return;
            }
            response.json()
                .then((data) => {
                sessionStorage.setItem("token", data.get("access_token"));
                sessionStorage.setItem("timestamp", data.get("timestamp"));
                window.location.href = "/dashboard";
            })
                .catch((e) => {
                console.log("Error when attempting to save information to session storage!");
            });
        }
    })
        .catch((e) => {
        console.error(e);
    });
};
function submitForm(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const dataObject = Object.fromEntries(formData);
        const userData = JSON.stringify(dataObject);
        const action = form.getAttribute("action");
        const method = "POST";
        // REPLACE THIS WITH PROXY SERVER
        fetch(`${action}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: method,
            body: userData,
            credentials: "include" // Include cookies in the request
        }).then((response) => {
            console.log('Received Response');
            if (!response.ok) {
                console.error("Error: ", response.statusText);
                document.getElementById("error").innerHTML = (action === "/login") ?
                    "Invalid email or password. Please try again."
                    : "Something went wrong on our end. Please try again later!";
                return;
            }
            else {
                if (navigator.cookieEnabled) {
                    window.location.href = "/dashboard"; // Redirect to dashboard on success
                    return;
                }
                else {
                    response.json()
                        .then((data) => {
                        sessionStorage.setItem("token", data.get("access_token"));
                        sessionStorage.setItem("timestamp", data.get("timestamp"));
                        window.location.href = "/dashboard";
                    })
                        .catch((e) => {
                        console.log(e);
                        document.getElementById("error").innerHTML = "Something went wrong. Try again later!";
                    });
                }
            }
        }).catch((error) => {
            console.error(`Error: ${error}`);
        });
    });
}
function toggleForm() {
    document.getElementById("signin-form-div").classList.toggle("active");
    document.getElementById("register-form-div").classList.toggle("active");
    document.getElementById("error").innerHTML = "";
}
