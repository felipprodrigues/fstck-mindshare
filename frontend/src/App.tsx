import { Navigate, Route, Routes } from "react-router-dom"
import { Layout } from "./component/Layout"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Layout>
  )
}

export default App
