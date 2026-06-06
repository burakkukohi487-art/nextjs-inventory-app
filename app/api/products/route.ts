import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { ProductSchema } from "@/app/lib/schemas"

//   /api/productsにGETリクエストが来たら↓
export async function GET() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}

//   /api/productsにPOSTリクエストが来たら↓
export async function POST(req: Request) {    
    const body = await req.json();

    // バリデーション実行
    const result = ProductSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(result.error.issues, { status: 400 });
    }

    const product = await prisma.product.create({ data: result.data });
    return NextResponse.json(product);
}