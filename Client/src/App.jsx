import "./App.css";
import { Button, Space } from "antd";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedPage } from "./components/ProtectedPage";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Profile } from "./pages/Profile";

function App() {
  const { isLoading } = useSelector((store) => store.loaders);
  // console.log(isLoading);

  return (
    <div>
      {isLoading && <LoadingSpinner />}
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
        <Route
          path="/profile"
          element={
            <ProtectedPage>
              <Profile />
            </ProtectedPage>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
