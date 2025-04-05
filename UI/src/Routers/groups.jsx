import { Route } from 'react-router-dom';
import { Groups } from '../Components';
import { GroupsTable, GroupDetails, GroupCreate } from '../Components/Groups';
export default function () {
    return (
        <>
            <Route path="groups" element={<Groups />}/>
                <Route index element={<GroupsTable/>}/>
                <Route path=":id" element={<GroupDetails />}/>
                <Route path="create" element={<GroupCreate/>}/>
        </>
    )
}