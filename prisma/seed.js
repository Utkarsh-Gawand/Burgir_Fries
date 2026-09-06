const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const menuItems = [
  { id: "classic-cheese", name: "Classic Cheese Burger", category: "Burgers", price: 149, description: "Beef patty, cheddar, lettuce, house sauce." },
  { id: "bbq-bacon", name: "BBQ Bacon Burger", category: "Burgers", price: 189, description: "Smoky BBQ sauce, crispy bacon, caramelized onions." },
  { id: "veg-supreme", name: "Veg Supreme Burger", category: "Burgers", price: 139, description: "Crispy veg patty, cheese, jalapeños, mayo." },
  { id: "chicken-zinger", name: "Chicken Zinger Burger", category: "Burgers", price: 169, description: "Spicy fried chicken fillet, slaw, zinger sauce." },
  { id: "loaded-fries", name: "Loaded Fries", category: "Fries", price: 129, description: "Fries topped with cheese sauce, jalapeños, herbs." },
  { id: "peri-peri-fries", name: "Peri Peri Fries", category: "Fries", price: 99, description: "Crispy fries tossed in peri peri seasoning." },
];

async function main() {
  for (const item of menuItems) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log("Menu items seeded!");
}

main().finally(() => prisma.$disconnect());