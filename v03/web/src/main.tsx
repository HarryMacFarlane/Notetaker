import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppRouter } from './router.tsx'
import { AuthProvider } from "./graphql/client";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
        <AppRouter>
          <App />
        </AppRouter>
    </AuthProvider>
  </StrictMode>,
)
