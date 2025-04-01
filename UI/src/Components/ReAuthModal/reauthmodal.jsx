import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useContext, useRef } from 'react';
import { AuthContext } from '../../authContext.jsx';
import Modal from 'react-bootstrap/Modal';
import { MAX_RE_AUTH_ATTEMTPS } from './constants.jsx';

export default function ReAuthModal ({ authFunction }) {
    const attempts = useRef(0);
    let errorMessage;
    
    const useAttempt = () => attempts.current = attempts.current + 1;

    const reAuthAttempt = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.email;
        const password = formData.password;
        try {
            authFunction(email, password);
        }
        catch (error) {
            useAttempt();
            if (attempts.current === MAX_RE_AUTH_ATTEMTPS) {
                window.location.href = "/";
            }
            errorMessage = error.message;
        }
    }

    return (
        <Modal show centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>Session Expired - Re-authenticate</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{ errorMessage }</p>
                <Form onSubmit={reAuthAttempt}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            required
                        />
                    </Form.Group>
                    <p>Attempts left: {attempts}</p>
                    <Button variant="primary" type="submit" className="w-100">
                        Authenticate
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}