// This component takes one item's data in as "props" (the { item } part
// below) and renders one card.
//
// Images are expected at public/images/<item.id>.jpg

import Link from "next/link";

export default function MenuCard({ item }) {
  return (
    <Link
      href={`/item/${item.id}`}
      className="block rounded-2xl border border-yellow/10 bg-bg-glow p-5 transition hover:border-yellow/40"
    >
      <img
        src={`/images/${item.id}.jpg`}
        alt={item.name}
        className="mb-4 h-36 w-full rounded-xl object-cover"
      />

      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-yellow">
        {item.category}
      </p>
      <h3 className="mb-1 font-display text-xl text-cream">{item.name}</h3>
      <p className="mb-3 text-sm text-cream/60">{item.description}</p>
      <p className="text-lg font-extrabold text-yellow">₹{item.price}</p>
    </Link>
  );
}