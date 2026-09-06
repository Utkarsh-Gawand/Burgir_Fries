import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const totalOrders = await prisma.order.count();

  const revenueAgg = await prisma.order.aggregate({
    _sum: { amountPaid: true },
  });

  const creditsAgg = await prisma.order.aggregate({
    _sum: { creditsEarned: true, discount: true },
  });

  // Most-ordered items (by quantity sold) — the "most demanding food".
  const topItemsRaw = await prisma.orderItem.groupBy({
    by: ["name"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });
  const topItems = topItemsRaw.map((row) => ({
    name: row.name,
    quantity: row._sum.quantity,
  }));

  // Category split (Burgers vs Fries) for the pie chart. OrderItem
  // doesn't store category directly, so we look it up from Item.
  const items = await prisma.item.findMany();
  const categoryByItemId = Object.fromEntries(items.map((i) => [i.id, i.category]));

  const allOrderItems = await prisma.orderItem.findMany();
  const categoryTotals = {};
  for (const oi of allOrderItems) {
    const category = categoryByItemId[oi.itemId] || "Other";
    categoryTotals[category] = (categoryTotals[category] || 0) + oi.quantity;
  }
  const categoryBreakdown = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // Orders + revenue per day, last 7 days.
  const allOrders = await prisma.order.findMany({
    select: { createdAt: true, amountPaid: true },
    orderBy: { createdAt: "asc" },
  });
  const dayTotals = {};
  for (const order of allOrders) {
    const day = order.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
    if (!dayTotals[day]) dayTotals[day] = { orders: 0, revenue: 0 };
    dayTotals[day].orders += 1;
    dayTotals[day].revenue += order.amountPaid;
  }
  const dailyTrend = Object.entries(dayTotals)
    .map(([day, totals]) => ({ day, ...totals }))
    .slice(-7);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { items: true },
  });

  return NextResponse.json({
    totalOrders,
    totalRevenue: revenueAgg._sum.amountPaid || 0,
    totalCreditsIssued: creditsAgg._sum.creditsEarned || 0,
    totalCreditsRedeemed: creditsAgg._sum.discount || 0,
    topItems,
    categoryBreakdown,
    dailyTrend,
    recentOrders,
  });
}