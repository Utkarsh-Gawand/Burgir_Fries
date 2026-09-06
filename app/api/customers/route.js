import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Looks up a phone number to check if it belongs to a returning
// customer, how many credits they have, and whether they've set a PIN.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ exists: false });
  }

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    credits: user.credits,
    hasPin: !!user.pin,
  });
}