"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import AddressAutocomplete from "@/components/checkout/AddressAutocomplete";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const clearCart = useCartStore((state) => state.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [placing, setPlacing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [checked, setChecked] = useState(false);
  const [existingCredits, setExistingCredits] = useState(0);
  const [hasPin, setHasPin] = useState(false);
  const [creditsToUse, setCreditsToUse] = useState(0);
  const [pin, setPin] = useState("");

  const maxRedeemable = Math.min(existingCredits, total);
  const finalTotal = total - creditsToUse;

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => router.push("/menu"), 4000);
      return () => clearTimeout(timer);
    }
  }, [result, router]);

  // Runs automatically the moment the phone number reaches 10 digits —
  // no need to click away from the field for this to trigger.
  useEffect(() => {
    if (phone.length < 10) {
      setChecked(false);
      setExistingCredits(0);
      setHasPin(false);
      setCreditsToUse(0);
      return;
    }

    let cancelled = false;

    fetch(`/api/customers?phone=${encodeURIComponent(phone)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setChecked(true);
        if (data.exists) {
          setExistingCredits(data.credits || 0);
          setHasPin(!!data.hasPin);
        } else {
          setExistingCredits(0);
          setHasPin(false);
        }
        setCreditsToUse(0);
      });

    return () => {
      cancelled = true;
    };
  }, [phone]);

  async function handleConfirmOrder(e) {
    e.preventDefault();
    setError("");

    if (!name || !phone || !locality || !addressLine) {
      setError("Please fill in every field.");
      return;
    }

    if (creditsToUse > 0 && pin.length !== 4) {
      setError("Enter your 4-digit PIN to use credits.");
      return;
    }

    setPlacing(true);
    const fullAddress = `${addressLine}, ${locality}, Mumbai`;

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        address: fullAddress,
        items,
        total,
        creditsToUse,
        pin,
      }),
    });
    const data = await res.json();
    setPlacing(false);

    if (data.success) {
      setResult(data);
      clearCart();
    } else {
      setError(data.error || "Something went wrong. Please try again.");
    }
  }

  if (result) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h1 className="mb-3 font-display text-3xl text-cream">Order placed!</h1>
          <p className="mb-1 text-cream/60">
            Order ID: <span className="text-cream">{result.orderId}</span>
          </p>
          {result.discount > 0 && (
            <p className="mb-1 text-cream/60">
              ₹{result.discount} credits discount applied — paid ₹{result.amountPaid}
            </p>
          )}
          <p className="mb-1 text-cream/60">
            You earned <span className="text-yellow">{result.creditsEarned} credits</span> on this order.
          </p>
          <p className="mb-8 text-cream/60">
            Your balance is now <span className="text-yellow">{result.totalCredits} credits</span>.
          </p>
          <p className="mb-4 text-xs text-cream/40">Returning to the menu shortly...</p>
          <Link href="/menu" className="text-yellow hover:underline">
            Back to menu now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-md">
        <Link href="/menu" className="mb-4 inline-block text-sm text-cream/60 hover:text-yellow">
          ← Add more items
        </Link>
        <h1 className="mb-8 font-display text-3xl text-cream">Checkout</h1>

        {items.length === 0 ? (
          <p className="text-cream/60">
            Your cart is empty. Go back to the menu and pick something!
          </p>
        ) : (
          <>
            <div className="mb-8 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-cream/10 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-cream">{item.name}</p>
                    <p className="text-sm text-cream/50">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-yellow">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-cream/10 pt-4">
                <p className="text-cream/60">Subtotal</p>
                <p className="text-cream">₹{total}</p>
              </div>

              {creditsToUse > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-cream/60">Credits discount</p>
                  <p className="text-yellow">-₹{creditsToUse}</p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-cream/10 pt-3">
                <p className="font-semibold text-cream">Amount payable</p>
                <p className="font-display text-xl text-yellow">₹{finalTotal}</p>
              </div>

              <p className="text-xs text-cream/40">
                {total > 500
                  ? "This order qualifies for 10 credits."
                  : "This order earns 2 credits. Orders above ₹500 earn 10."}
              </p>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-cream/15 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-yellow/50 focus:outline-none"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full rounded-xl border border-cream/15 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-yellow/50 focus:outline-none"
              />

              <AddressAutocomplete value={locality} onChange={setLocality} />

              <textarea
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Flat/House no., Building, Street"
                rows={3}
                className="w-full rounded-xl border border-cream/15 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-yellow/50 focus:outline-none"
              />

              {checked && existingCredits > 0 && (
                <div className="rounded-xl border border-yellow/30 bg-yellow/5 p-4">
                  <p className="mb-2 text-sm text-cream">
                    You have <span className="text-yellow">{existingCredits} credits</span> available
                    (up to ₹{maxRedeemable} off this order).
                  </p>

                  <label className="mb-1 block text-xs text-cream/50">
                    Credits to use
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={maxRedeemable}
                    value={creditsToUse}
                    onChange={(e) => {
                      const val = Math.min(
                        Math.max(Number(e.target.value) || 0, 0),
                        maxRedeemable
                      );
                      setCreditsToUse(val);
                    }}
                    className="mb-3 w-full rounded-lg border border-cream/15 bg-transparent px-3 py-2 text-cream focus:border-yellow/50 focus:outline-none"
                  />

                  {creditsToUse > 0 && (
                    <>
                      <label className="mb-1 block text-xs text-cream/50">
                        Enter your 4-digit PIN to use credits
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={pin}
                        onChange={(e) =>
                          setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        className="w-full rounded-lg border border-cream/15 bg-transparent px-3 py-2 tracking-widest text-cream focus:border-yellow/50 focus:outline-none"
                      />
                    </>
                  )}
                </div>
              )}

              {checked && !hasPin && (
                <div className="rounded-xl border border-cream/10 p-4">
                  <label className="mb-1 block text-xs text-cream/50">
                    Set a 4-digit PIN (optional) to protect your credits next time
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="w-full rounded-lg border border-cream/15 bg-transparent px-3 py-2 tracking-widest text-cream focus:border-yellow/50 focus:outline-none"
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={placing}
                className="w-full rounded-full bg-yellow px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-bg-glow disabled:opacity-60"
              >
                {placing ? "Placing order..." : `Confirm Order — ₹${finalTotal}`}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}