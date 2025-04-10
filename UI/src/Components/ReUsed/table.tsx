import { Button, Table } from "react-bootstrap"

const IndexDataTable = ({createFunction, detailFunction, headers, data}) => {
    if (!data) {
        return (
            <h1> NO GROUPS FOUND!</h1>
        )
    }

    return (
        <>
            <Button onClick={createFunction}>Create</Button>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                    {Object.values(headers).map((headerLabel, idx) => (
                        <th key={idx}>{headerLabel}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, rowIndex) => (
                    <tr key={rowIndex} onClick={() => detailFunction(entry.id)}>
                        {Object.keys(headers).map((key, colIndex) => (
                        <td key={colIndex}>{entry[key]}</td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default IndexDataTable;