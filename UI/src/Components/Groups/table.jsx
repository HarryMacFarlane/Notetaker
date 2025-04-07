import dataIndexTable from "../ReUsed/table";

export default function GroupTable() {

    // IMPLEMENT FETCH HERE TO GO GET DATA!
    const headers = {
        'name' : 'name',
        'description' : 'description'
    }

    const details = (id) => {
        // Redirect to group details page
        window.location.href = `/groups/${id}`;
    }

    return (
        <dataIndexTable />
    )
}
