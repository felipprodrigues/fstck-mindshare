import { Navigate, Route, Routes } from "react-router-dom"
import { Layout } from "./components/Layout"
import { IdeasPage } from "./pages/Ideas"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { useAuthStore } from "./stores/auth"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <IdeasPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
