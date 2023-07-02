import "./App.css";
import { Button, Space } from "antd";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedPage } from "./components/ProtectedPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedPage>
            <Home />
          </ProtectedPage>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
