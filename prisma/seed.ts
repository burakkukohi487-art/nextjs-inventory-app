import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.product.createMany({
        data: [
            { name: "リンゴ", price: 150, stock: 100 },
            { name: "バナナ", price: 80, stock: 5 },
            { name: "ミカン", price: 120, stock: 0 },
            { name: "ブドウ", price: 500, stock: 30 },
        ]
    })
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });