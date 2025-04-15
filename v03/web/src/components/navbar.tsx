import React, { useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, useNavigate } from "react-router-dom";
import { authenticationCheck } from "../util/authenticationCheck";
import { useGraphQL } from "../graphql/client";
interface NavBarProps {}

const NavBar : React.FC<NavBarProps> = ({}) => {
    const navigate = useNavigate();
    const { client } = useGraphQL();

    const authCheck = () => {
        authenticationCheck({client})
        .then(
            (valid) => {
                if (!valid) navigate("/authentication");
            }
        )
    }
    // Navigate to login if user is not logged in
    useEffect(authCheck,[])
    
    return (
    <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/home">Notetaker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="me-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/home/groups">Groups</Nav.Link>
                        <Nav.Link href="/home/notes">Notes</Nav.Link>
                        <Nav.Link href="/home/settings">Settings</Nav.Link>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet/>
    </>
    )
}

export default NavBar;