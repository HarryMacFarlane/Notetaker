import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, Home, Settings, Notes, Profile } from "./Components";
import { GroupCreate, GroupDetails, GroupsTable } from "./Components/Groups";

function DashboardRouter () {
    return (
        <BrowserRouter basename='/dashboard'>
            <Routes>
                <Route path="" element={<Dashboard />}>
                    <Route index element={<Home/>} />
                    <Route path="home" element={<Home />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="groups" element={<GroupsTable/>}/>
                    <Route path="groups/:id" element={<GroupDetails />}/>
                    <Route path="groups/create" element={<GroupCreate/>}/>
                    <Route path="notes" element={<Notes />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default DashboardRouter;