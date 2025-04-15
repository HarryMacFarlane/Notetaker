import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet } from "react-router-dom";
import { useGraphQL } from "../graphql/client";
import { authenticationCheck } from "../util/authenticationCheck";
import { Navigate } from "react-router-dom";
interface NavBarProps {}

const NavBar : React.FC<NavBarProps> = async ({}) => {
    const { client } = useGraphQL();

    if (!await authenticationCheck({ client } )) return <Navigate to="/authentication"/>
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