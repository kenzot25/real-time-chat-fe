import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Register from "./pages/Register";
import ProfileSettings from "./pages/ProfileSetting";

function App() {
  return (
    <>
      <Routes>
        <Route
          index
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <ProfileSettings />
            </ProtectedRoutes>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
