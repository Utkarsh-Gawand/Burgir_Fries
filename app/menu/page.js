import { prisma } from "@/lib/db";
import MenuCard from "@/components/menu/MenuCard";

export const metadata = {
  title: "Menu | Burgir Fries",
};

export default async function MenuPage() {
  const menuItems = await prisma.item.findMany();

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold tracking-wide text-yellow">
          Burgir Fries
        </p>
        <h1 className="mb-10 font-display text-4xl text-cream sm:text-5xl">
          Our Menu
        </h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}