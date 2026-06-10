"use client";

import Link from "next/link";
import Header from "../components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [error, setError] = useState("");

    const router = useRouter();

    const handleAdd = async () => {
        if (name === "" || price === "" || stock === "") return
        await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                price: Number(price),
                stock: Number(stock),
            }),
        }).then((res) => {
            if (res.ok) {
                setName("");
                setPrice("");
                setStock("");
                router.push("/productTable");
                alert("登録が完了しました")
            } else {
                setError("登録に失敗しました");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <Header />
            <div className="flex justify-center">
                <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
                    <h1 className="text-2xl font-bold text-center">商品テーブル</h1>
                    <Link href="/" className="inline-flex items-center gap-1 text-md underline text-blue-500 hover:text-blue-700 transition-colors">
                        ホームへ戻る
                    </Link>
                    {error && <span className="text-red-500">{error}</span>}
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="商品名"
                        className="w-full border border-gray-300 outline-none mt-4 p-2 my-1 rounded-md"
                    />
                    <input
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        min={1}
                        placeholder="価格"
                        className="w-full border border-gray-300 outline-none p-2 my-1 rounded-md"
                    />
                    <input
                        type="number"
                        onChange={(e) => setStock(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        min={0}
                        placeholder="在庫"
                        className="w-full border border-gray-300 outline-none p-2 my-1 rounded-md"
                    />
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
    )
}