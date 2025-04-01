import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, Home, Settings, Groups, Notes, Profile } from "./Components";

function DashboardRouter () {
    return (
        <BrowserRouter basename='/dashboard'>
            <Routes>
                <Route path="" element={<Dashboard />}>
                    <Route index element={<Home/>} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default DashboardRouter;