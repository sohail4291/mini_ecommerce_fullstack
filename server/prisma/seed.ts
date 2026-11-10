// Sample data: npx prisma db seed
import bcrypt from "bcryptjs";
import { prisma } from "../src/db";


async function main() {
  await prisma.user.upsert({ where: { email: "admin@shop.com" }, update: {},
    create: { email: "admin@shop.com", password: await bcrypt.hash("admin123", 10), role: "ADMIN" } });
    
  if ((await prisma.product.count()) === 0)
    await prisma.product.createMany({ data: ["Headphones", "Keyboard", "Mouse", "Monitor", "Webcam", "USB Hub"].map((name, i) =>
      ({ name, description: `Great ${name}`, price: (i + 1) * 49900, stock: 20, imageUrl: `https://picsum.photos/seed/${name}/300/200` })) });
}
main().finally(() => prisma.$disconnect());
