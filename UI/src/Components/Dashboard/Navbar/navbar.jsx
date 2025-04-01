import { useState } from "react";
import { Navbar, Nav, Offcanvas, Button } from "react-bootstrap";
import CustomNavLink from "./customNavLink";
import "./navbar.module.css";

export default function SideNav() {
    /* Set the width of the side navigation to 250px */
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Navbar bg="light" variant="light" className="">
                <Button className='navopener' onClick={handleShow}>
                    &#9776;
                </Button>
                <h1 className=""> NoteTaker </h1>
            </Navbar>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Dashboard</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <CustomNavLink to="/home" text="Home" handleClose={handleClose} />
                        <CustomNavLink to="/notes" text="Notes" handleClose={handleClose} />
                        <CustomNavLink to="/groups" text="Groups" handleClose={handleClose} />
                        <CustomNavLink to="/profile" text="Profile" handleClose={handleClose} />
                        <CustomNavLink to="/settings" text="Settings" handleClose={handleClose} />
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}