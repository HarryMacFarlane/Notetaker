import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
import { reAuthenticateModal } from '../../authContext';
export default function Home() {
    const { showModal } = reAuthenticateModal();
    return (
        <Container>
            <h1>Home</h1>
            <Button className='mb-3' onClick={showModal}>
                Execute Modal Test
            </Button>
            <p>
                Welcome to NoteTaker! This a simple note-taking application that lets 
                multiple users edit the same file in live time. You can create groups,
                and assign permissions to people in each group, allowing a seemless workflow!
                Enjoy!
            </p>
        </Container>
    );
}