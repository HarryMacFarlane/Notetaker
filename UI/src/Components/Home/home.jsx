import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
export default function Home() {
    return (
        <Container>
            <h1>Home</h1>

            <p>
                Welcome to NoteTaker! This a simple note-taking application that lets 
                multiple users edit the same file in live time. You can create groups,
                and assign permissions to people in each group, allowing a seemless workflow!
                Enjoy!
            </p>
        </Container>
    );
}