import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VoiceAssistant from "../components/VoiceAssistant";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout(){
  const nav = useNavigate();
  const handleVoice = (action) => {
    if (action.type === "live") nav("/live");
    if (action.type === "create" || action.type === "trip") nav("/create");
  };
  return (
    <div className="min-h-screen bg-background text-charcoal">
      <Navbar/>
      <main><Outlet/></main>
      <Footer/>
      <VoiceAssistant onAction={handleVoice}/>
      <Toaster position="top-center" toastOptions={{ style:{borderRadius:"12px", fontSize:"14px"} }}/>
    </div>
  )
}
