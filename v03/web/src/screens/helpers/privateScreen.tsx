import { Navigate } from "react-router-dom"
import { authenticationCheck } from "../../util/authenticationCheck";
import { useGraphQL } from "../../graphql/client";

interface PrivateRouteInput {
    children : React.ReactNode
}

const PrivateScreen : React.FC<PrivateRouteInput> = async ({children}) => {
    const { client } = useGraphQL();
    return (
        <>
            {(await authenticationCheck({ client } )) ? children : <Navigate to="/authentication"/>}
        </>
    )
}

export default PrivateScreen;