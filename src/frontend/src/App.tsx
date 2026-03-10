import {Route, Routes} from "react-router"
import LoginPage from "./app/login/page"
import RegisterPage from "./app/register/page"
import RootLayout from "./app/layout"

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout/>}>
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Route>
    </Routes>
  )
}
