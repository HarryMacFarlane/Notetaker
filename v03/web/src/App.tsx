import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./graphql/client";
import { AppRouter } from "./router";

// CREATE THE DASHBOARD!
function App() {

  return (
    <AuthProvider>
      <AppRouter/>
    </AuthProvider>
  )
}

export default App
