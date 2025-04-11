import IndexDataTable from "../ReUsed/table";
import { useNavigate } from "react-router-dom";
import { providerContext } from "../../authContext";
import { useContext, useEffect, useState } from "react";

export default function GroupTable() {
    const exampleData = [
        {id: 22, name: "Math 303", description: 'Everyone in Marrial high in advancded data math 303.'},
        {id: 23, name: 'Science 101', description: 'Too lazy'},
        {id: 24, name: 'CJ Tutoring', description: 'Every tuesday, 5 PM'}
    ]

    const navigate = useNavigate();
    const [data, setData] = useState(exampleData);
    const context = useContext(providerContext);
    const reqheaders = context.reqHeader;

    // IMPLEMENT FETCH HERE TO GO GET DATA!
    const headers = {
        'name' : 'name',
        'description' : 'description'
    }

    const details = (id) => {
        // Redirect to group details page
        navigate(`${id}`);
    }
    
    const create = () => {
        navigate(`create`)
    }

    const fetchData = async () => {
        return await fetch(
            '/api/v0/groups',
            {
                headers: reqheaders,
                credentials: 'include'
            }
        )
        .then(
            (response) => {
                if (!response.ok) {
                    console.error('Could not fetch groups!')
                }
                else {
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
            (err) => {
                console.error(err);
            }
        )
    }

    useEffect(async () =>
        await fetchData()
    ,[])

    return (
        <IndexDataTable createFunction={create} detailFunction={details} headers={headers} data={data}/>
    )
}
