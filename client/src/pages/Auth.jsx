import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Card } from "../components/UI";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { MapPinned } from "lucide-react";

export function Login(){
  const [form,setForm]=useState({email:"",password:""});
  const [loading,setLoading]=useState(false);
  const nav=useNavigate();
  const {setAuth}=useAuthStore();
  const submit=async(e)=>{
    e.preventDefault(); setLoading(true);
    try{
      const res=await api.post("/auth/login",form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Welcome back!");
      nav("/create");
    }catch(err){ toast.error(err.response?.data?.message||"Login failed"); }
    setLoading(false);
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 to-white">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center mx-auto"><MapPinned/></div>
          <h1 className="display text-2xl font-bold mt-3">Welcome back</h1>
          <p className="text-sm text-muted">Login to save & manage your trips</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/>
          <Input label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required/>
          <Button type="submit" className="w-full" disabled={loading}>{loading?"Logging in...":"Login"}</Button>
          <p className="text-center text-sm text-muted">No account? <Link to="/signup" className="text-primary-600 font-medium">Sign up</Link></p>
          <div className="text-center"><Link to="/create" className="text-xs text-muted hover:underline">Skip — Continue without login →</Link></div>
        </form>
      </Card>
    </div>
  );
}

export function Signup(){
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [loading,setLoading]=useState(false);
  const nav=useNavigate();
  const {setAuth}=useAuthStore();
  const submit=async(e)=>{
    e.preventDefault(); setLoading(true);
    try{
      const res=await api.post("/auth/signup",form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Account created!");
      nav("/create");
    }catch(err){ toast.error(err.response?.data?.message||"Signup failed"); }
    setLoading(false);
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 to-white">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center mx-auto"><MapPinned/></div>
          <h1 className="display text-2xl font-bold mt-3">Create account</h1>
          <p className="text-sm text-muted">Save trips & access anywhere</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Priya Sharma" required/>
          <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/>
          <Input label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 chars" required/>
          <Button type="submit" className="w-full" disabled={loading}>{loading?"Creating...":"Sign Up"}</Button>
          <p className="text-center text-sm text-muted">Have account? <Link to="/login" className="text-primary-600 font-medium">Login</Link></p>
        </form>
      </Card>
    </div>
  );
}
