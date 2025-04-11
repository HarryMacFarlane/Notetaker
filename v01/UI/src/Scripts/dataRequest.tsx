
export default async function(resourceName, {id}) {
    if (id) {
        resourceName += "/id";
    }
    return await fetch(
        `/api/v1/${resourceName}`,
        {
            headers: {'Content-Type': 'application/json', 'authorization': `Bearer ${sessionStorage.getItem('access_token')}`},
            credentials: 'include',
            method: 'POST',
        }
    ).then(
        async (response) => {
            if (!response.ok) {
                throw Error(`Invalid Request. Code: ${response.status}`)
            }
            else {
                return await response.json();
            }
        }
    )
}