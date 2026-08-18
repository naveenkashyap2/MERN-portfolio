import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export default function AppLayout(){
  return (
    <div className="min-h-screen bg-background text-charcoal">
      <Navbar/>
      <main><Outlet/></main>
      <Footer/>
      <Toaster position="top-center" toastOptions={{ style:{borderRadius:"12px", fontSize:"14px"} }}/>
    </div>
  )
}
