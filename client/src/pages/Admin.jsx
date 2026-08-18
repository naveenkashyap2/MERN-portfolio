import { useEffect, useState } from "react";
import api from "../services/api";
import { Card, Badge } from "../components/UI";

export default function Admin(){
  const [data,setData]=useState(null);
  const [err,setErr]=useState("");
  useEffect(()=>{
    api.get("/admin/stats").then(r=>setData(r.data.data)).catch(e=>setErr(e.response?.data?.message||"Admin only. Login as admin."));
  },[]);
  if(err) return <div className="max-w-4xl mx-auto px-4 py-12"><Card className="p-8 text-center"><p className="font-semibold text-red-600">{err}</p><p className="text-sm text-muted mt-2">Create admin: signup then change role to 'admin' in DB or memoryStore.</p></Card></div>;
  if(!data) return <div className="p-12 text-center">Loading admin...</div>;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="display text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <Card className="p-6 text-center"><p className="text-3xl font-bold text-primary-600">{data.users}</p><p className="text-sm text-muted">Total Users</p></Card>
        <Card className="p-6 text-center"><p className="text-3xl font-bold text-violet-600">{data.trips}</p><p className="text-sm text-muted">Total Trips</p></Card>
        <Card className="p-6 text-center"><p className="text-3xl font-bold text-amber-600">{data.recentTrips?.length||0}</p><p className="text-sm text-muted">Recent Trips</p></Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-5">
          <h3 className="font-semibold">Recent Trips</h3>
          <div className="space-y-2 mt-3">
            {(data.recentTrips||[]).map(t=><div key={t._id} className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm"><span>{t.title}</span><Badge>{t.destination}</Badge></div>)}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Recent Users</h3>
          <div className="space-y-2 mt-3">
            {(data.recentUsers||[]).map(u=><div key={u._id} className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm"><span>{u.name} ({u.email})</span><Badge>{u.role}</Badge></div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
