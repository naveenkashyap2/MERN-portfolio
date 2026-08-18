import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import CreateTrip from "./pages/CreateTrip";
import TripDetail from "./pages/TripDetail";
import Explore from "./pages/Explore";
import MyTrips from "./pages/MyTrips";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Live from "./pages/Live";
import Premium from "./pages/Premium";
import { Login, Signup } from "./pages/Auth";
import { useAuthStore } from "./store/authStore";

const qc = new QueryClient();

function Protected({ children }){
  const { isAuth } = useAuthStore();
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

function VoiceWrapper({ children }){
  const nav = useNavigate();
  // This wrapper is not needed, VoiceAssistant inside Applayout handles
  return children;
}

export default function App(){
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout/>}>
            <Route path="/" element={<Landing/>} />
            <Route path="/create" element={<Protected><CreateTrip/></Protected>} />
            <Route path="/trip/:id" element={<Protected><TripDetail/></Protected>} />
            <Route path="/trip/preview" element={<Protected><TripDetail/></Protected>} />
            <Route path="/explore" element={<Protected><Explore/></Protected>} />
            <Route path="/my-trips" element={<Protected><MyTrips/></Protected>} />
            <Route path="/history" element={<Protected><MyTrips/></Protected>} />
            <Route path="/live" element={<Protected><Live/></Protected>} />
            <Route path="/premium" element={<Premium/>} />
            <Route path="/profile" element={<Protected><Profile/></Protected>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/admin" element={<Protected><Admin/></Protected>} />
            <Route path="*" element={<div className="text-center py-20"><h2 className="text-xl font-semibold">404 — Page not found</h2><a href="/" className="text-primary-600 underline">Go Home</a></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
