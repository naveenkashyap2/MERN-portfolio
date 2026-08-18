import { Link, useNavigate, useLocation } from "react-router-dom";
import { MapPinned, Compass, Bookmark, LogOut, Menu, X, Sparkles, Navigation, User } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Button } from "./UI";

export default function Navbar() {
  const { isAuth, user, logout } = useAuthStore();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (p) => loc.pathname === p ? "text-primary-600 font-semibold" : "text-muted hover:text-charcoal";

  const doLogout = async () => {
    try{ const api = (await import("../services/api")).default; await api.post("/auth/logout"); }catch{}
    logout(); nav("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center text-white shadow">
              <MapPinned size={18} />
            </div>
            <span className="display font-extrabold text-xl tracking-tight text-charcoal">Yatra<span className="text-primary-600">Genie</span> <span className="font-semibold text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full border border-primary-100 ml-1">AI</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <Link to="/explore" className={`text-sm ${isActive("/explore")}`}>Explore</Link>
            <Link to="/create" className={`text-sm ${isActive("/create")}`}>Plan Trip</Link>
            <Link to="/live" className={`text-sm flex items-center gap-1 ${isActive("/live")}`}><Navigation size={14}/> Live</Link>
            {isAuth && <Link to="/my-trips" className={`text-sm flex items-center gap-1 ${isActive("/my-trips")}`}><Bookmark size={14}/> My Trips</Link>}
            {isAuth && user?.role === "admin" && <Link to="/admin" className={`text-sm ${isActive("/admin")}`}>Admin</Link>}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!isAuth ? (
              <>
                <Link to="/login" className="text-sm font-medium text-charcoal px-4 py-2">Login</Link>
                <Link to="/signup"><Button size="md"><Sparkles size={16}/> Get Started</Button></Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 rounded-full pr-3 pl-1 py-1 border border-transparent hover:border-border">
                  <img src={user?.avatar || `https://i.pravatar.cc/100?u=${user?.email}`} alt="avatar" className="w-8 h-8 rounded-full object-cover border"/>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs text-muted">{user?.email?.split("@")[0]}</p>
                  </div>
                </Link>
                <Link to="/profile" className="p-2 hover:bg-gray-50 rounded-xl text-muted" title="Profile"><User size={18}/></Link>
                <button onClick={doLogout} className="p-2 hover:bg-gray-50 rounded-xl text-muted" title="Logout"><LogOut size={18}/></button>
              </div>
            )}
          </div>

          <button onClick={()=>setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-gray-50">
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-2">
          <Link onClick={()=>setOpen(false)} to="/explore" className="flex items-center gap-2 py-2 text-sm"><Compass size={16}/> Explore</Link>
          <Link onClick={()=>setOpen(false)} to="/create" className="flex items-center gap-2 py-2 text-sm"><Sparkles size={16}/> Plan Trip</Link>
          <Link onClick={()=>setOpen(false)} to="/live" className="flex items-center gap-2 py-2 text-sm"><Navigation size={16}/> Live Tracker</Link>
          {isAuth && <Link onClick={()=>setOpen(false)} to="/my-trips" className="flex items-center gap-2 py-2 text-sm"><Bookmark size={16}/> My Trips</Link>}
          <Link onClick={()=>setOpen(false)} to="/profile" className="flex items-center gap-2 py-2 text-sm"><User size={16}/> Profile</Link>
          {!isAuth ? (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1"><Button variant="secondary" className="w-full">Login</Button></Link>
              <Link to="/signup" className="flex-1"><Button className="w-full">Sign Up</Button></Link>
            </div>
          ) : (
            <Button variant="secondary" className="w-full" onClick={()=>{doLogout(); setOpen(false);}}>Logout</Button>
          )}
        </div>
      )}
    </header>
  );
}
