import { useGraphQL } from "../../graphql/client";
import { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { LoadingScreen } from "../../components/LoadingScreen";

const GROUP_DETAILS_REQUEST = gql`

`;


const GroupList : React.FC = () => {
    const { client } = useGraphQL();
    const [ loading, setLoading ] = useState(true);

    const executeMembershipRequest = () => {
        setLoading(false);
    }

    useEffect(executeMembershipRequest,[]);

    return (
        <>
            { loading ? <LoadingScreen/> : <div>Memberships List</div> }
        </>
    )
}