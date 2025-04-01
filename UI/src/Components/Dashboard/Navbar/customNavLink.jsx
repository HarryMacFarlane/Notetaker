import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";


export default function customNavLink({ to, text, handleClose}) {
    return (
        <Nav.Link as={NavLink} to={to} className="navlink" onClick={handleClose}>{text}</Nav.Link>
    )
}