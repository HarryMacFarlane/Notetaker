import React from "react";
import { AuthProvider } from "./authContext";
import DashboardRouter from "./router.jsx";

function App() {
  return (
    <AuthProvider>
      <DashboardRouter />
    </AuthProvider>
  );
}

export default App;