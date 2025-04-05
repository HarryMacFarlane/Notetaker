import { authContext } from "../../authContext";
import { Button } from "react-bootstrap";


export default function GroupDetails() {

    const [ data, setData ] = useState();

    useEffect(() => {
        fetch(
            `/api/v0/groups/${id}`,
            {
                headers: authContext.reqHeaders,
                credentials: 'include',
            }
        )
        .then(
            (response) => {
                if (!response.ok) {
                    console.error('Could not fetch group data', response.statusText);
                    onBack();
                }
                else {
                    response.json()
                    .then(
                        (data) => {
                            setData(data);
                        }
                    )
                    .catch(
                        (error) => {
                            console.error(error);
                            onBack();
                        }
                    )
                }
            }
        )
        .catch(
            (error) => {
                console.error(error);
                onBack();
            }
        )
    }, [])

    return (
        <>
            <p>{data}</p>
        </>
    )

}