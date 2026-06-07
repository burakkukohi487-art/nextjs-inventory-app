"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const [empNo, setEmpNo] = useState("");
    const [pass, setPass] = useState("");

    const [showPass, setShowPass] = useState(false);

    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!empNo || !pass) return;
        const result = await signIn("credentials", {
            empNo: empNo,
            password: pass,
            redirect: false,
        });

        if (result?.error) {
            setError("社員番号またはパスワードが間違っています");
            setPass("")
        } else {
            router.push("/");            
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
            <div className="w-md shadow-xl p-4 rounded-2xl">
                <h1 className="text-2xl font-bold text-center mb-4">ログインページ</h1>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <div>
                    <input
                        type="text"
                        placeholder="社員番号"
                        value={empNo}
                        onChange={(e) => setEmpNo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full border border-gray-300 outline-none p-2 my-1 rounded-md"
                    />
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="パスワード"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className="w-full border border-gray-300 outline-none p-2 my-1 rounded-md pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                        >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleLogin}
                            className="bg-blue-400 text-white py-1 px-3 rounded-md hover:bg-blue-500 cursor-pointer transition-colors"
                        >
                            ログイン
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}