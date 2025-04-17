import { Spinner } from "react-bootstrap";


export const LoadingScreen : React.FC = () => {
    return (
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}