import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Card } from "../components/UI";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { MapPinned, Sparkles, ShieldCheck, Chrome } from "lucide-react";
import { motion } from "framer-motion";

const GoogleButton = ({ onClick, loading }) => (
  <button type="button" onClick={onClick} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white border border-border rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition shadow-sm">
    <Chrome size={18} className="text-blue-500"/> Continue with Google
  </button>
);

export function Login(){
  const [form,setForm]=useState({email:"",password:""});
  const [loading,setLoading]=useState(false);
  const [gLoading,setGLoading]=useState(false);
  const nav=useNavigate();
  const {setAuth}=useAuthStore();
  const submit=async(e)=>{
    e.preventDefault(); setLoading(true);
    try{
      const res=await api.post("/auth/login",form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Welcome back! 🔐");
      nav("/create");
    }catch(err){ toast.error(err.response?.data?.message||"Login failed"); }
    setLoading(false);
  };
  const google = async () => {
    setGLoading(true);
    // Mock Google — in prod use @react-oauth/google
    try{
      const mock = { name: "Google User", email: `user${Date.now()%1000}@gmail.com`, avatar: `https://i.pravatar.cc/200?u=${Date.now()}` };
      const res = await api.post("/auth/google", mock);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Google login success! ✨");
      nav("/create");
    }catch(e){ toast.error("Google auth failed"); }
    setGLoading(false);
  };
  return (
    <div className="min-h-[86vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-emerald-50 via-white to-violet-50">
      <motion.div initial={{opacity:0, y:16, scale:0.98}} animate={{opacity:1, y:0, scale:1}} transition={{duration:0.4}} className="w-full max-w-md">
        <Card className="p-7 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <motion.div initial={{scale:0.8}} animate={{scale:1}} transition={{type:"spring"}} className="w-12 h-12 bg-gradient-to-br from-primary-600 to-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg"><MapPinned size={20}/></motion.div>
            <h1 className="display text-2xl font-bold mt-3">Welcome back</h1>
            <p className="text-sm text-muted">Login is mandatory — secure trips & history</p>
            <p className="text-xs bg-amber-50 border border-amber-100 text-amber-700 rounded-full px-3 py-1 inline-flex items-center gap-1 mt-2"><ShieldCheck size={12}/> 100% Secure • Encrypted</p>
          </div>
          <div className="space-y-3">
            <GoogleButton onClick={google} loading={gLoading}/>
            <div className="flex items-center gap-3 py-2"><div className="h-px bg-border flex-1"/><span className="text-xs text-muted">or email</span><div className="h-px bg-border flex-1"/></div>
            <form onSubmit={submit} className="space-y-4">
              <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/>
              <Input label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required/>
              <Button type="submit" className="w-full" disabled={loading}>{loading?"Logging in...":"Login"}</Button>
            </form>
            <p className="text-center text-sm text-muted">No account? <Link to="/signup" className="text-primary-600 font-semibold">Sign up</Link></p>
          </div>
          <p className="text-center text-xs text-muted mt-4">Animated • Responsive • Google Auth ready</p>
        </Card>
      </motion.div>
    </div>
  );
}

export function Signup(){
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [loading,setLoading]=useState(false);
  const [gLoading,setGLoading]=useState(false);
  const nav=useNavigate();
  const {setAuth}=useAuthStore();
  const submit=async(e)=>{
    e.preventDefault(); setLoading(true);
    try{
      const res=await api.post("/auth/signup",form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Account created! 🎉");
      nav("/create");
    }catch(err){ toast.error(err.response?.data?.message||"Signup failed"); }
    setLoading(false);
  };
  const google = async () => {
    setGLoading(true);
    try{
      const mock = { name: form.name || "Google User", email: `user${Date.now()%1000}@gmail.com`, avatar: `https://i.pravatar.cc/200?u=${Date.now()}` };
      const res = await api.post("/auth/google", mock);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Google signup success! ✨");
      nav("/create");
    }catch(e){ toast.error("Google auth failed"); }
    setGLoading(false);
  };
  return (
    <div className="min-h-[86vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <motion.div initial={{opacity:0, y:16, scale:0.98}} animate={{opacity:1, y:0, scale:1}} transition={{duration:0.4}} className="w-full max-w-md">
        <Card className="p-7 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <motion.div initial={{rotate:-10, scale:0.9}} animate={{rotate:0, scale:1}} className="w-12 h-12 bg-gradient-to-br from-violet-600 to-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg"><Sparkles size={20}/></motion.div>
            <h1 className="display text-2xl font-bold mt-3">Create account</h1>
            <p className="text-sm text-muted">Join 2,400+ yatris • Secure & fast</p>
          </div>
          <div className="space-y-3">
            <GoogleButton onClick={google} loading={gLoading}/>
            <div className="flex items-center gap-3 py-2"><div className="h-px bg-border flex-1"/><span className="text-xs text-muted">or create with email</span><div className="h-px bg-border flex-1"/></div>
            <form onSubmit={submit} className="space-y-4">
              <Input label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Naveen" required/>
              <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/>
              <Input label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 chars" required/>
              <Button type="submit" className="w-full" disabled={loading}>{loading?"Creating...":"Sign Up — Free"}</Button>
            </form>
            <p className="text-center text-sm text-muted">Have account? <Link to="/login" className="text-primary-600 font-semibold">Login</Link></p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
