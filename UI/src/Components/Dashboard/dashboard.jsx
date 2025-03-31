import { Outlet } from "react-router";

// MAKE SURE TO UPDATE THIS TO INCLUDE THE NAVBAR IN THE FUTURE!!!!
function Dashboard() {

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            
            <Outlet />
        </div>
    );
}

export default { Dashboard };