import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";

export default function DashboardRouter () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="dashboard" element={<Dashboard />}>
                    <Route index element={<Home/>} />
                    <Route path="home" element={<Home />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="groups" element={<Groups />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}