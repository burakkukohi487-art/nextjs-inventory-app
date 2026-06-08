"use client";

import { useSession, signOut } from "next-auth/react"
import Link from "next/link";

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-99 bg-white shadow px-6 py-3 flex items-center justify-between">
            <Link href="/">
                <h1 className="font-bold text-lg">在庫管理システム</h1>
            </Link>
            <div className="flex items-center gap-6 text-sm">
                <span>社員番号：{session?.user.empNo}</span>
                <span>氏名：{session?.user.name}</span>
                <button
                    onClick={() => signOut({ redirectTo: "/login" })}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors cursor-pointer"
                >
                    ログアウト
                </button>
            </div>
        </header>

    )
}