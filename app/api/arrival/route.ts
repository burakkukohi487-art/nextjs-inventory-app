import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { ArrivalSchema } from "@/app/lib/schemas";

export async function POST(req: Request) {
    const body = await req.json();

    const result = ArrivalSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(result.error.issues, { status:400 });
    }

    // $transactionを使って、搬入記録と在庫増加のどちらかが失敗したときに両方キャンセルさせる
    await prisma.$transaction([
        prisma.arrival.create({ data: result.data }),
        prisma.product.update({
            where: { id: result.data.productId },
            data: { stock: {increment: result.data.quantity} },
        }),
    ]);

    return NextResponse.json({ success: true });
};