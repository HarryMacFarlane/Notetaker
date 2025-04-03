

export default async function authReq(email, password) {

    return await fetch(`/login`, 
        {
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({ 'email':email, 'password': password }),
            credentials: "include" // Include cookies in the request
        }
    ).then(
        (response) => 
            {
                if (!response.ok) {
                    console.error("Error Code: ", response.status);
                    return false;
                }
                else {
                    if (navigator.cookieEnabled) {
                        window.location.href = "/dashboard"; // Redirect to dashboard on success
                        return true;
                    }
                    else {
                        response.json()
                        .then(
                            (data) => {
                                sessionStorage.setItem("access_token", data.get("access_token"));
                                sessionStorage.setItem("timestamp", data.get("timestamp"));
                                window.location.href = "/dashboard";
                                return true;
                            }
                        )
                        .catch(
                            (e) => {
                                console.error(e);
                                return false;
                            }
                        )
                    }
                }
            }
    ).catch((error) => 
        {
            console.error(`Error: ${error}`);
            return false;
        }
    )
}