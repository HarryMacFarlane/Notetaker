import { Form } from 'react-bootstrap';
import authReq from './authReq.jsx';

export default function AuthForm() {
    return (
        <>
            <Form onSubmit={authReq}>
                <Form.Group className='mb-3' controlId='authEmail'>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="authPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    )
}