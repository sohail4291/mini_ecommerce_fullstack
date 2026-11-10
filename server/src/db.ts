// One shared Prisma client (Prisma 7 requires a driver adapter)
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


export const prisma = new PrismaClient({ adapter:
     new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
