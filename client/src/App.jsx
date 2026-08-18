import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import CreateTrip from "./pages/CreateTrip";
import TripDetail from "./pages/TripDetail";
import Explore from "./pages/Explore";
import MyTrips from "./pages/MyTrips";
import Admin from "./pages/Admin";
import { Login, Signup } from "./pages/Auth";
import { useAuthStore } from "./store/authStore";

const qc = new QueryClient();

function Protected({ children }){
  const { isAuth } = useAuthStore();
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

export default function App(){
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout/>}>
            <Route path="/" element={<Landing/>} />
            <Route path="/create" element={<CreateTrip/>} />
            <Route path="/trip/:id" element={<TripDetail/>} />
            <Route path="/trip/preview" element={<TripDetail/>} />
            <Route path="/explore" element={<Explore/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/my-trips" element={<Protected><MyTrips/></Protected>} />
            <Route path="/admin" element={<Protected><Admin/></Protected>} />
            <Route path="*" element={<div className="text-center py-20"><h2 className="text-xl font-semibold">404 — Page not found</h2><a href="/" className="text-primary-600 underline">Go Home</a></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
