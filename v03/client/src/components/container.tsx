import { Container } from "react-bootstrap";


interface ContainerProps {
    children : React.ReactNode
}

const Wrapper : React.FC<ContainerProps> = ({ children }) => {
    return (
        <Container>
            {children}
        </Container>
    )
}

export default Wrapper;