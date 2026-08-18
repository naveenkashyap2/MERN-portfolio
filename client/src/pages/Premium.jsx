import { useState } from "react";
import { Card, Button, Badge } from "../components/UI";
import { Crown, Check, Zap, Navigation, Mic, MapPin } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Premium(){
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState("");
  
  const pay = async (plan) => {
    setLoading(plan);
    try{
      const orderRes = await api.post("/payments/create-order", { plan });
      toast("Opening Razorpay (Mock) — " + orderRes.data.data.order.amountDisplay, { icon: "💳" });
      // Simulate Razorpay checkout delay
      await new Promise(r=>setTimeout(r,1200));
      const verify = await api.post("/payments/verify", { plan, paymentId: "pay_mock_"+Date.now(), orderId: orderRes.data.data.order.id });
      setUser(verify.data.data.user);
      toast.success(`Premium ${plan} activated! 🎉`);
    }catch(e){ toast.error(e.response?.data?.message||"Payment failed. Login required?"); }
    setLoading("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="primary" className="mb-3"><Crown size={12}/> Premium Razorpay</Badge>
        <h1 className="display text-4xl font-bold">Upgrade to Premium</h1>
        <p className="text-muted mt-2">₹149 Explorer ya ₹199 Pro — Razorpay secure. Live tracker + Voice 4 languages unlock karo.</p>
        {user?.isPremium && <p className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm inline-block">Active: <b>{user.premiumPlan}</b> — till {user.premiumUntil? new Date(user.premiumUntil).toLocaleDateString(): "—"}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto">
        <Card className="p-6 border-2 border-primary-100 shadow-card">
          <h3 className="font-bold text-lg flex items-center gap-2">Explorer <Badge>Most Popular</Badge></h3>
          <p className="text-4xl font-extrabold mt-2">₹149<span className="text-sm font-normal text-muted">/month</span></p>
          <p className="text-xs text-muted">Razorpay • UPI / Card / Wallet</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> Unlimited AI trips</li>
            <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> Live 10km / 20km + All India map</li>
            <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> Steps + History timeline</li>
            <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> Voice Hindi + English</li>
            <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> Train timings + Highway best route</li>
          </ul>
          <Button onClick={()=>pay("explorer")} disabled={loading==="explorer"} className="w-full mt-6">{loading==="explorer"?"Processing...":"Pay ₹149 — Razorpay"}</Button>
          <p className="text-[11px] text-muted text-center mt-2">Mock Razorpay — real keys add karne se real payment hoga</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-0 shadow-xl">
          <h3 className="font-bold text-lg flex items-center gap-2">Pro <Zap size={16}/></h3>
          <p className="text-4xl font-extrabold mt-2">₹199<span className="text-sm font-normal opacity-80">/month</span></p>
          <p className="text-xs opacity-70">Razorpay • Premium support</p>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            <li className="flex gap-2"><Check size={16}/> Explorer sab +</li>
            <li className="flex gap-2"><Check size={16}/> 4 Languages Voice: हिन्दी, English, मराठी, ಕನ್ನಡ</li>
            <li className="flex gap-2"><Check size={16}/> Offline maps + Background tracking</li>
            <li className="flex gap-2"><Check size={16}/> Priority Gemini (faster)</li>
            <li className="flex gap-2"><Check size={16}/> Premium badge + No ads + History export</li>
          </ul>
          <Button onClick={()=>pay("pro")} disabled={loading==="pro"} variant="secondary" className="w-full mt-6 bg-white text-violet-700 hover:bg-white">{loading==="pro"?"Processing...":"Pay ₹199 — Razorpay"}</Button>
        </Card>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
        <Card className="p-4 text-center"><Navigation size={20} className="mx-auto text-primary-600"/><p className="text-sm font-semibold mt-2">All India Routes</p><p className="text-xs text-muted">Kanpur-Delhi se Kashmir-Kanyakumari</p></Card>
        <Card className="p-4 text-center"><Mic size={20} className="mx-auto text-violet-600"/><p className="text-sm font-semibold mt-2">Bolo-To-Karo</p><p className="text-xs text-muted">4 bhasha me voice assistant</p></Card>
        <Card className="p-4 text-center"><MapPin size={20} className="mx-auto text-emerald-600"/><p className="text-sm font-semibold mt-2">Live Steps</p><p className="text-xs text-muted">Har kadam track, history save</p></Card>
      </div>

      <Card className="p-4 mt-6 max-w-4xl mx-auto bg-gray-50">
        <p className="text-xs font-mono text-muted">Razorpay Integration: In production, add RAZORPAY_KEY_ID & SECRET in server/.env and use razorpay npm to create orders. Current is mock — always succeeds for demo. Login mandatory for payment (secure).</p>
      </Card>
    </div>
  );
}
