import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Auth from "./components/Auth";
import { Routes, Route, useLocation } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import Posts from "./pages/Posts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminAI from "./pages/AdminAI";
import AdminAIHistory from "./pages/AdminAIHistory";
import VistaApp from "./pages/VistaApp";
import CurrentWeather from "./vista-components/CurrentWeather";
import Forecast from "./vista-components/Forecast";
import VistaAIAssistant from "./vista-components/VistaAIAssistant";
import Hero from "./vista-pages/Hero";
import VistaAIHistory from "./vista-pages/VistaAIHistory";

// Kiosk Imports
import KioskLayout from "./kiosk-components/KioskLayout";
import KioskHome from "./kiosk-pages/KioskHome";
import GasDashboard from "./kiosk-pages/GasDashboard";
import GasBillPayment from "./kiosk-pages/gas/GasBillPayment";
import NewGasConnection from "./kiosk-pages/gas/NewGasConnection";
import CylinderRefill from "./kiosk-pages/gas/CylinderRefill";
import GasComplaint from "./kiosk-pages/gas/GasComplaint";
import TrackStatus from "./kiosk-pages/gas/TrackStatus";
import Emergency from "./kiosk-pages/gas/Emergency";

function App() {
  useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(location.pathname === "/");

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <LanguageProvider>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/vista" element={<VistaApp />}>
            <Route index element={<Hero />} />
            <Route path="weather" element={<div className="w-full p-0 md:p-6"><CurrentWeather /></div>} />
            <Route path="forecast" element={<div className="w-full p-0 md:p-6"><Forecast /></div>} />
            <Route path="ai" element={<div className="h-[calc(100vh-100px)] w-full mb-8"><VistaAIAssistant /></div>} />
            <Route path="ai-history" element={<VistaAIHistory />} />
          </Route>

          {/* Kiosk Routes */}
          <Route path="/kiosk" element={<KioskLayout />}>
            <Route index element={<KioskHome />} />
            <Route path="gas" element={<GasDashboard />} />
            <Route path="gas/pay-bill" element={<GasBillPayment />} />
            <Route path="gas/new-connection" element={<NewGasConnection />} />
            <Route path="gas/book-refill" element={<CylinderRefill />} />
            <Route path="gas/register-complaint" element={<GasComplaint />} />
            <Route path="gas/track-status" element={<TrackStatus />} />
            <Route path="gas/emergency" element={<Emergency />} />
          </Route>

          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-reports" element={<AdminReports />} />
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
          <Route path="/admin-ai" element={<AdminAI />} />
          <Route path="/admin-ai-history" element={<AdminAIHistory />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}

export default App;
