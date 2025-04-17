import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { LoadingScreen } from "../../components/LoadingScreen";


const GroupDetails : React.FC = () => {
    const { id } = useParams();
    if (!id){
        throw new Error("This can't be the case, there is no id in the parameters!?")
    }

    const [ loading , setLoading ] = useState(true);

    const executeDetailsQuery = () => {
        setLoading(false);
    }

    useEffect(
        executeDetailsQuery, []
    );

    return (
        <>
        { loading ? <LoadingScreen/> : <DetailsScreen id={id}/>}
        </>
    );
}


const DetailsScreen : React.FC<{ id: string}> = () => {
    return (
        <div>Group Details, go implement!</div>
    )
}

export default GroupDetails;