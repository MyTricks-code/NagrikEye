import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
// import Dashboard from "./components/Dashboard";
import { Routes, Route, useLocation } from "react-router-dom";
// import Profile from "./components/Profile";
// import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./pages/LandingPage"
import Posts from "./pages/Posts";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(location.pathname === "/");

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/reports" element={<Posts />}/>
      </Routes>
    </div>
  );
}

export default App;
