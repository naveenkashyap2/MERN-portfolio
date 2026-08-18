import User from "../models/User.js";
import { isDBConnected } from "../config/db.js";
import { memoryStore } from "../utils/memoryStore.js";

// Mock Razorpay - no real key needed, simulates success
export const createOrder = async (req, res) => {
  const { plan } = req.body; // explorer 149, pro 199
  const prices = { explorer: 149, pro: 199, free: 0 };
  const amount = prices[plan] || 149;
  // In real: razorpay.orders.create({amount: amount*100, currency:"INR"})
  const mockOrder = {
    id: `order_${Date.now()}`,
    amount: amount * 100,
    currency: "INR",
    plan,
    amountDisplay: `₹${amount}`,
  };
  res.json({ success: true, data: { order: mockOrder, key: "rzp_test_mock_key" } });
};

export const verifyPayment = async (req, res) => {
  const { plan, paymentId, orderId } = req.body;
  const validPlans = ["explorer","pro"];
  if (!validPlans.includes(plan)) return res.status(400).json({ success: false, message: "Invalid plan" });

  // Simulate verification always success for demo
  const update = {
    isPremium: true,
    premiumPlan: plan,
    premiumSince: new Date(),
    premiumUntil: new Date(Date.now() + 30*24*3600000), // 30 days
  };

  if (isDBConnected()) {
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    return res.json({ success: true, message: `Premium ${plan} activated!`, data: { user } });
  } else {
    const user = memoryStore.users.find(u => u._id === req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    Object.assign(user, update);
    const { password, ...safe } = user;
    return res.json({ success: true, message: `Premium ${plan} activated! (mock)`, data: { user: safe } });
  }
};

export const getPremiumStatus = async (req, res) => {
  res.json({ success: true, data: { isPremium: req.user.isPremium, plan: req.user.premiumPlan, until: req.user.premiumUntil } });
};
