import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Guest checkout: no login required. Phone number identifies a
// returning customer and tracks their credits. A PIN protects credit
// redemption so someone else can't spend your credits just by
// knowing your phone number.
export async function POST(request) {
  const { name, phone, address, items, total, creditsToUse, pin } =
    await request.json();

  if (!name || !phone || !address) {
    return NextResponse.json(
      { error: "Name, phone, and address are required" },
      { status: 400 }
    );
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { phone } });
  const existingCredits = existingUser?.credits || 0;

  const requested = Math.max(Number(creditsToUse) || 0, 0);

  // PIN check: only enforced when they're actually trying to redeem credits.
  if (requested > 0) {
    if (!existingUser || !existingUser.pin) {
      return NextResponse.json(
        {
          error:
            "No PIN set for this number yet. Place an order without using credits first to create one.",
        },
        { status: 400 }
      );
    }
    if (pin !== existingUser.pin) {
      return NextResponse.json({ error: "Incorrect PIN." }, { status: 403 });
    }
  }

  const discount = Math.min(requested, existingCredits, total);
  const amountPaid = total - discount;

  // 2 credits per order, 10 if the order (before discount) is above ₹500.
  const creditsEarned = total > 500 ? 10 : 2;
  const newCreditsBalance = existingCredits - discount + creditsEarned;

  // Keep an existing PIN if they already have one. If they don't, and
  // they entered a fresh 4-digit PIN this time, save it now.
  const finalPin =
    existingUser?.pin || (pin && pin.length === 4 ? pin : null);

  const user = await prisma.user.upsert({
    where: { phone },
    update: { name, address, credits: newCreditsBalance, pin: finalPin },
    create: { phone, name, address, credits: creditsEarned, pin: finalPin },
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      customerName: name,
      phone,
      address,
      total,
      discount,
      amountPaid,
      creditsEarned,
      items: {
        create: items.map((item) => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
    discount,
    amountPaid,
    creditsEarned,
    totalCredits: user.credits,
  });
}