import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Employees from "./pages/Employees";
import Register from "./pages/Register";
import Management from "./pages/Management";
import Navbar from "./components/Navbar";
import useCheckLogin from "./hooks/useCheckLogin";
import { useEffect } from "react";

function App() {
  const checkLogin = useCheckLogin();
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/management" element={<Management />} />
        </Route>
      </Routes>
    </Navbar>
  );
}

export default App;
