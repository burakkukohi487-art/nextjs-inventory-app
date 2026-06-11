import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { UserSchema } from "@/app/lib/schemas"
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const body = await req.json();

    // バリデーション実行
    const parsed = UserSchema.safeParse(body);

    if(!parsed.success) {
        return NextResponse.json(parsed.error.issues, { status: 400 })
    }

    // 社員番号の重複チェック
    const exsting = await prisma.employee.findUnique({
        where: { empNo: parsed.data.empNo }
    });
    if (exsting) {
        return NextResponse.json([{ message: "この社員番号は既に使われています" }], { status: 409 });
    }

    const hashedPass = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.employee.create({ data: { ...parsed.data, password: hashedPass } });
    return NextResponse.json(user);
}