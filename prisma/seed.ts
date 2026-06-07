import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.product.createMany({
        data: [
            { name: "リンゴ", price: 150, stock: 100 },
            { name: "バナナ", price: 80, stock: 5 },
            { name: "ミカン", price: 120, stock: 0 },
            { name: "ブドウ", price: 500, stock: 30 },
        ],
    });
    await prisma.employee.createMany({
        data:[
            { empNo: "0001", password: "admin123", name: "管理者", role: "ADMIN" },
            { empNo: "0002", password: "staff123", name: "一般社員", role: "EMPLOYEE" },
        ],
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });