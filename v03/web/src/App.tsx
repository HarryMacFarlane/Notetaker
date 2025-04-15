import { AuthScreen, HomeScreen } from "./screens"
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./graphql/client";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components";

// CREATE THE DASHBOARD!
function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/authentication" element={<AuthScreen/>}/>
          <Route path="/" element={<NavBar/>}/>
            <Route path="" element={<HomeScreen/>}/>
      </Routes>
    </AuthProvider>
  )
}

export default App
