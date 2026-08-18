import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const useGenerateTrip = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const generate = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post("/trips/generate", payload);
      setData(res.data.data);
      if (res.data.data.isMock) toast("Mock AI Mode — Add GEMINI_API_KEY for real Gemini", { icon: "🤖" });
      else toast.success("Itinerary generated via Gemini!");
      return res.data.data;
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to generate");
      throw e;
    } finally { setLoading(false); }
  };
  return { generate, loading, data, setData };
};
