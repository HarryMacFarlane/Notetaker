import { Button, Form } from 'react-bootstrap';
import authReq from "./Form/authReq.jsx";
import Modal from 'react-bootstrap/Modal';
import { MAX_RE_AUTH_ATTEMTPS } from './constants.jsx';
import { reAuthenticateModal } from '../../authContext.jsx';

export function ReAuthModal () {
    const { isModalOpen, hideModal } = reAuthenticateModal();

    const logout = () => {
        hideModal();
        window.location.href = "/";
    }

    const reAuthAttempt = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.email;
        const password = formData.password;

        const success = await authReq(email, password);
        
        if  (success) {
            // Hide the modal
            hideModal();
            return;
        }
        else {
            return;
        }
    }

    return (
        <Modal show={ isModalOpen } centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>Session Expired <br/> Re-authenticate</Modal.Title>
                <Button onClick={logout}>Logout</Button>
            </Modal.Header>
            <Modal.Body>
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
                    <Button variant="primary" type="submit" className="w-100">
                        Authenticate
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}