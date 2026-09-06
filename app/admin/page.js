"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#f5c518", "#c9a100", "#7bae3f", "#5c3a21", "#9c9890"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/analytics?password=${encodeURIComponent(password)}`);
    const result = await res.json();
    setLoading(false);

    if (res.ok) {
      setData(result);
    } else {
      setError(result.error || "Something went wrong.");
    }
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm text-center">
          <h1 className="mb-6 font-display text-3xl text-cream">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="mb-4 w-full rounded-xl border border-cream/15 bg-transparent px-4 py-3 text-center text-cream placeholder:text-cream/30 focus:border-yellow/50 focus:outline-none"
          />
          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-yellow px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-bg-glow disabled:opacity-60"
          >
            {loading ? "Checking..." : "View dashboard"}
          </button>
        </form>
      </main>
    );
  }

  const tooltipStyle = {
    backgroundColor: "#1a1712",
    border: "1px solid rgba(245,241,232,0.15)",
    borderRadius: "8px",
    color: "#f5f1e8",
  };

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-display text-3xl text-cream">Dashboard</h1>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-cream/10 p-4">
            <p className="text-xs text-cream/50">Total orders</p>
            <p className="font-display text-2xl text-cream">{data.totalOrders}</p>
          </div>
          <div className="rounded-xl border border-cream/10 p-4">
            <p className="text-xs text-cream/50">Revenue</p>
            <p className="font-display text-2xl text-yellow">₹{data.totalRevenue}</p>
          </div>
          <div className="rounded-xl border border-cream/10 p-4">
            <p className="text-xs text-cream/50">Credits issued</p>
            <p className="font-display text-2xl text-cream">{data.totalCreditsIssued}</p>
          </div>
          <div className="rounded-xl border border-cream/10 p-4">
            <p className="text-xs text-cream/50">Credits redeemed</p>
            <p className="font-display text-2xl text-cream">{data.totalCreditsRedeemed}</p>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-cream/10 p-4">
            <h2 className="mb-4 font-display text-lg text-cream">Most demanded items</h2>
            {data.topItems.length === 0 ? (
              <p className="text-sm text-cream/50">No orders yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.topItems} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,241,232,0.1)" />
                  <XAxis type="number" stroke="rgba(245,241,232,0.4)" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="rgba(245,241,232,0.4)"
                    fontSize={12}
                    width={110}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="quantity" fill="#f5c518" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-xl border border-cream/10 p-4">
            <h2 className="mb-4 font-display text-lg text-cream">Category split</h2>
            {data.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-cream/50">No orders yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => entry.name}
                  >
                    {data.categoryBreakdown.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="mb-10 rounded-xl border border-cream/10 p-4">
          <h2 className="mb-4 font-display text-lg text-cream">Orders over time</h2>
          {data.dailyTrend.length === 0 ? (
            <p className="text-sm text-cream/50">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,241,232,0.1)" />
                <XAxis dataKey="day" stroke="rgba(245,241,232,0.4)" fontSize={12} />
                <YAxis stroke="rgba(245,241,232,0.4)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#f5c518" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#7bae3f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <h2 className="mb-4 font-display text-xl text-cream">Recent orders</h2>
        <div className="space-y-3">
          {data.recentOrders.length === 0 && (
            <p className="text-sm text-cream/50">No orders yet.</p>
          )}
          {data.recentOrders.map((order) => (
            <div key={order.id} className="rounded-xl border border-cream/10 p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-cream">{order.customerName}</p>
                <p className="text-yellow">₹{order.amountPaid}</p>
              </div>
              <p className="text-xs text-cream/50">
                {order.phone} · {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-cream/40">
                {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}