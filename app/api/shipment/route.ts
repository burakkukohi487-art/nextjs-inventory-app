import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { ShipmentSchema } from "@/app/lib/schemas";

export async function POST(req: Request) {
    const body = await req.json();

    const result = ShipmentSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(result.error.issues, { status: 400 });
    }

    // 出荷記録,在庫減算,在庫確認のいずれかが失敗したときに全てキャンセルさせる
    try {
    await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: result.data.productId },
        });

        if (!product) {
            throw new Error("商品が見つかりません");
        };
        if (product.stock < result.data.quantity) {
            throw new Error("在庫が不足しています");
        };

        await tx.shipment.create({ data: result.data });
        await tx.product.update({
            where: { id: result.data.productId },
            data: { stock: { decrement: result.data.quantity } },
        });
    });

    return NextResponse.json({ success: true });
} catch (e) {
    if (e instanceof Error && (e.message === "在庫が不足しています" || e.message === "商品が見つかりません")) {
        return NextResponse.json([{ message: e.message }], { status: 400 });
    }
    return NextResponse.json([{ message: "登録が失敗しました" }], { status: 500 })
}
};