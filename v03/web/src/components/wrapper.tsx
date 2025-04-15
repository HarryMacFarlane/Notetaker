import { Container } from "react-bootstrap";
import { ChildrenInput } from "../util/childrenInterface";

const Wrapper : React.FC<ChildrenInput> = ({ children }) => {
    return (
        <Container>
            {children}
        </Container>
    )
}

export default Wrapper;