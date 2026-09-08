import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import ForgotPass from "./pages/ForgotPass";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(
    !!localStorage.getItem("token"),
  );

  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem("userId");
    return saved ? Number(saved) : null;
  });

  return (
    <Routes>
      <Route element={<PublicRoute isAllowed={isAuthorized} />}>
        <Route
          path="/login"
          element={
            <LoginPage setAuth={setIsAuthorized} setUserId={setCurrentUserId} />
          }
        />

        <Route
          path="/register"
          element={
            <RegisterPage
              setAuth={setIsAuthorized}
              setUserId={setCurrentUserId}
            />
          }
        />
      </Route>

      <Route element={<ProtectedRoute isAllowed={isAuthorized} />}>
        <Route
          path="/main"
          element={
            <MainPage userId={currentUserId} setAuth={setIsAuthorized} />
          }
        />
      </Route>

      <Route path="forgot-password" element={<ForgotPass />}></Route>

      <Route
        path="/"
        element={<Navigate to={isAuthorized ? "/main" : "/login"} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
