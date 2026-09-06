import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import DeliveryOptions from "@/components/item/DeliveryOptions";

export default async function ItemPage({ params }) {
  const item = await prisma.item.findUnique({ where: { id: params.id } });

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/menu" className="mb-8 inline-block text-sm text-cream/60 hover:text-yellow">
          ← Back to menu
        </Link>

        <img
          src={`/images/${item.id}.jpg`}
          alt={item.name}
          className="mb-8 h-52 w-full rounded-2xl object-cover"
        />

        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-yellow">
          {item.category}
        </p>
        <h1 className="mb-3 font-display text-4xl text-cream">{item.name}</h1>
        <p className="mb-4 text-cream/60">{item.description}</p>
        <p className="mb-10 font-display text-3xl text-yellow">₹{item.price}</p>

        <DeliveryOptions item={item} />
      </div>
    </main>
  );
}