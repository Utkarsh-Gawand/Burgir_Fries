"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

const SWIGGY_URL = "https://www.swiggy.com";
const ZOMATO_URL = "https://www.zomato.com";

export default function DeliveryOptions({ item }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  function handleWebsiteOrder() {
    addItem({ id: item.id, name: item.name, price: item.price });
    router.push("/checkout");
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <a
        href={SWIGGY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-cream/15 px-5 py-4 text-center font-semibold text-cream transition hover:border-yellow/50"
      >
        Order on Swiggy
      </a>

      <a
        href={ZOMATO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-cream/15 px-5 py-4 text-center font-semibold text-cream transition hover:border-yellow/50"
      >
        Order on Zomato
      </a>

      <div className="rounded-xl border border-cream/15 px-5 py-4 text-center">
        <p className="font-semibold text-cream">Dine-in</p>
        <p className="mt-1 text-xs text-cream/50">Show this screen to our staff</p>
      </div>

      <button
        onClick={handleWebsiteOrder}
        className="rounded-xl bg-yellow px-5 py-4 text-center font-extrabold text-bg-glow transition hover:brightness-95"
      >
        Order from Website
        <span className="block text-xs font-semibold normal-case text-bg-glow/70">
          Earn credits on this order
        </span>
      </button>
    </div>
  );
}