import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Button, Card, Input, Badge } from "../components/UI";
import api from "../services/api";
import toast from "react-hot-toast";
import { Camera, Footprints, MapPinned, Navigation } from "lucide-react";

export default function Profile(){
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [preview, setPreview] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(user?.stats || { totalTrips:0, totalDistanceKm:0, totalSteps:0 });
  const [history, setHistory] = useState([]);

  useEffect(()=>{
    api.get("/auth/history").then(r=>{ setHistory(r.data.data.history); setStats(r.data.data.stats); }).catch(()=>{});
  },[]);

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2*1024*1024) { toast.error("Max 2MB image"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setAvatar(base64);
      setPreview(base64);
    };
    reader.readAsDataURL(f);
  };

  const save = async () => {
    setSaving(true);
    try{
      const res = await api.put("/auth/profile", { name, avatar });
      setUser(res.data.data.user);
      toast.success("Profile updated!");
    }catch(e){ toast.error(e.response?.data?.message || "Failed"); }
    setSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="display text-3xl font-bold">My Profile</h1>
      <p className="text-muted">Photo, stats, history — sab yahan</p>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6 text-center">
          <div className="relative w-28 h-28 mx-auto">
            <img src={preview || `https://i.pravatar.cc/200?u=${user?.email}`} alt="avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-card" />
            <label className="absolute bottom-1 right-1 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow">
              <Camera size={14}/>
              <input type="file" accept="image/*" className="hidden" onChange={onFile}/>
            </label>
          </div>
          <h3 className="font-bold mt-4">{user?.name}</h3>
          <p className="text-sm text-muted">{user?.email}</p>

          <div className="mt-6 space-y-3 text-left">
            <Input label="Name" value={name} onChange={e=>setName(e.target.value)} />
            <p className="text-xs text-muted">Photo 2MB tak — small image choose karo, base64 me save hoga.</p>
            <Button onClick={save} disabled={saving} className="w-full">{saving?"Saving...":"Save Profile"}</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center"><p className="text-2xl font-extrabold text-primary-600">{stats.totalTrips||0}</p><p className="text-xs text-muted flex items-center justify-center gap-1"><MapPinned size={12}/> Trips</p></Card>
            <Card className="p-4 text-center"><p className="text-2xl font-extrabold text-emerald-600">{(stats.totalDistanceKm||0).toFixed(1)}<span className="text-sm">km</span></p><p className="text-xs text-muted flex items-center justify-center gap-1"><Navigation size={12}/> Distance</p></Card>
            <Card className="p-4 text-center"><p className="text-2xl font-extrabold text-violet-600">{(stats.totalSteps||0).toLocaleString()}</p><p className="text-xs text-muted flex items-center justify-center gap-1"><Footprints size={12}/> Steps</p></Card>
          </div>

          <Card className="p-5">
            <h3 className="font-semibold">History — Kaha kaha gaye</h3>
            {history.length===0 ? <p className="text-sm text-muted mt-2">Abhi koi history nahi — trip generate karo to yahan dikhega.</p> : (
              <div className="mt-3 space-y-2 max-h-[360px] overflow-auto">
                {history.map((h,i)=>(
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border">
                    <div>
                      <p className="text-sm font-medium">{h.from || "Kanpur"} → {h.destination}</p>
                      <p className="text-xs text-muted">{new Date(h.visitedAt).toLocaleDateString()} • {h.days} days</p>
                    </div>
                    <Badge>{h.destination}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
