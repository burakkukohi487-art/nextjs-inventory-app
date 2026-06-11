"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Header from "../components/Header";
import LoadingSpinner from "../components/loadingSpinner";

export default function AddUser() {
    const { data: session, status } = useSession();
    const nowRole = session?.user.role;

    const router = useRouter();

    const [empNo, setEmpNo] = useState("");
    const [pass, setPass] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("EMPLOYEE");

    const [error, setError] = useState<string[]>([]);

    const [showPass, setShowPass] = useState(false);

    const handleAdd = async () => {
        if (empNo === "" || pass === "" || name === "") return
        await fetch("/api/addUser", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                empNo: empNo,
                password: pass,
                name: name,
                role: role, 
            }),
        }).then(async (res) => {
            if (res.ok) {
                router.push("/")
                alert("登録が完了しました")
            } else {
                const data = await res.json();
                setError(data.map((issue: { message: string}) => issue.message));
            }
        })
    };
    
    useEffect(() => {
        if (nowRole != "ADMIN") { router.push("/") };
    }, [nowRole, router])

    if (status === "loading" || status === "unauthenticated") return <div className="bg-white min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <Header />
            <div className="flex justify-center">
                <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
                    <h1 className="text-2xl font-bold text-center">社員登録</h1>
                    <div>
                        <Link href="/" className="inline-flex items-center gap-1 text-md underline text-blue-500 hover:text-blue-700 transition-colors">
                            ホームへ戻る
                        </Link>
                        <br />
                        {error.map((err, i) => (
                            <span key={i} className="text-red-500 text-sm block">{err}</span>
                        ))}
                        <input
                            type="text"
                            placeholder="社員番号"
                            onChange={(e) => setEmpNo(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            className="w-full border border-gray-300 outline-none p-2 my-2 rounded-md"
                        />
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="パスワード"
                                onChange={(e) => setPass(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                className="w-full border border-gray-300 outline-none p-2 my-2 rounded-md pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="社員名"
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            className="w-full border border-gray-300 outline-none p-2 my-2 rounded-md"
                        />
                        <select
                            name=""
                            id=""
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            className="w-full border border-gray-300 outline-none p-2 my-2 rounded-md"
                        >
                            <option value="EMPLOYEE">社員</option>
                            <option value="ADMIN">管理者</option>
                        </select>
                        <div className="flex justify-center">
                            <button
                                onClick={handleAdd}
                                className="bg-blue-400 text-white mt-4 py-1 px-3 rounded-md hover:bg-blue-500 cursor-pointer transition-colors"
                            >
                                登録
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}