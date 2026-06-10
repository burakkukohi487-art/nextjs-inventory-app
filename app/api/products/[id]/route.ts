import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
    });
    return NextResponse.json(product);
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();
    await prisma.product.update({
        where: { id: Number(id) },
        data: {
            name: body.name,
            price: body.price,
            stock: body.stock,
        },
    });
    return NextResponse.json({ success: true });
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    await prisma.product.delete({
        where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
}