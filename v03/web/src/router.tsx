import { BrowserRouter, Routes, Route} from "react-router-dom"
import { AuthScreen, HomeScreen, GroupDetailScreen } from "./screens"
import { NavBar } from "./components"

export const AppRouter : React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/authentication" element={<AuthScreen/>}/>
                <Route path="/" element={<NavBar/>}/>
                    <Route path="" element={<HomeScreen/>}/>
                    <Route path="groups/:id" element={<GroupDetailScreen/>}/>
        </Routes>
        </BrowserRouter>
    )
}