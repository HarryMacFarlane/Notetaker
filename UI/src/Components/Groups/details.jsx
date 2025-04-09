import { providerContext } from "../../authContext";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react"

export default function GroupDetails() {
    const params = useParams()
    const id = params.id

    const context = useContext(providerContext);
    const headers = context.reqHeader;

    const [data, setData] = useState()

    useEffect(() => {
        fetch(
            `/api/v0/groups/${id}`,
            {
                headers: headers,
                credentials: 'include',
            }
        )
        .then(
            (response) => {
                if (!response.ok) {
                    console.error('Could not fetch group data', response.statusText);
                }
                else {
                    console.log(response)
                    response.json()
                    .then(
                        (data) => {
                            setData(data);
                        }
                    )
                }
            }
        )
        .catch(
            (error) => {
                console.error(error);
            }
        )
    }, [])

    return (
        <>
            <p>{data}</p>
        </>
    )

}