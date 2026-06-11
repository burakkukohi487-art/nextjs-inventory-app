import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const adminPass = await bcrypt.hash("admin123", 10);
const staffPass = await bcrypt.hash("staff123", 10);

async function main() {
    await prisma.product.createMany({
        data: [
            { name: "リンゴ", price: 150, stock: 100 },
            { name: "バナナ", price: 80, stock: 5 },
            { name: "ミカン", price: 120, stock: 0 },
            { name: "ブドウ", price: 500, stock: 30 },
        ],
        skipDuplicates: true,
    });
    await prisma.employee.upsert({
        where: { empNo: "0001" },
        update: { password: adminPass },
        create: { empNo: "0001", password: adminPass, name: "管理者", role: "ADMIN" },
    });
    await prisma.employee.upsert({
        where: { empNo: "0002" },
        update: { password: staffPass },
        create: { empNo: "0002", password: staffPass, name: "一般社員", role: "EMPLOYEE" },
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });