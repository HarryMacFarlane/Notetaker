import { Outlet } from "react-router";
import Navbar from "./Navbar/navbar.jsx";
// MAKE SURE TO UPDATE THIS TO INCLUDE THE NAVBAR IN THE FUTURE!!!!
export default function Dashboard() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}