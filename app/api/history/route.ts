import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const arrival = await prisma.arrival.findMany({ include: {product: true} });
    const shipment = await prisma.shipment.findMany({ include: {product: true} });

    const history = [
        ...arrival.map((a) => ({ ...a, type: "搬入" })),
        ...shipment.map((a) => ({ ...a, type: "出荷" })),
    ];

    history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(history);
}