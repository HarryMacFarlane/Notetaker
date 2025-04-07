import { Button, Table } from "react-bootstrap"

const indexDataTable = ({detailFunction, headers}) => {

    return (
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
                <tr key={rowIndex}>
                    {Object.keys(headers).map((key, colIndex) => (
                    <td key={colIndex}>{entry[key]}</td>
                    ))}
                    <Button onClick={() => detailFunction(entry.id)}> Details </Button>
                </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default indexDataTable;