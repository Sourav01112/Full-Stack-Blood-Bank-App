import "./App.css";
import { Button, Space } from "antd";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedPage } from "./components/ProtectedPage";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Profile } from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import { Error404 } from "./pages/Error404/index";
import ForgotPasswordMailSent from "./pages/ForgotPasswordMailSent";
import ResetPasswod from "./pages/ResetPassword";
import ResetPasswordSuccess from "./pages/ResetPasswordSuccess";

function App() {
  const { isLoading } = useSelector((store) => store.loaders);

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

        {/* ---------- Forgot Password  & Rest -----------*/}
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/forgotpassword/success"
          element={<ForgotPasswordMailSent />}
        />
        <Route path="/resetPassword/:id" element={<ResetPasswod />} />
        <Route
          path="/resetPassword/success"
          element={<ResetPasswordSuccess />}
        />
        {/* ---------- Forgot Password  & Rest -----------*/}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
