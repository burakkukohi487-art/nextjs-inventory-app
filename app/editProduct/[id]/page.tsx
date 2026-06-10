"use client";

import { use, useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Link from "next/link";
import LoadingSpinner from "@/app/components/loadingSpinner";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getProduct = async () => {
        await fetch(`/api/products/${id}`, {
            method: "GET",
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setName(data.name);
                    setPrice(data.price);
                    setStock(data.stock);
                } else {
                    setError("商品が見つかりませんでした")
                }
            })
    }

    const handleEdit = async () => {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                price: Number(price),
                stock: Number(stock),
            }),
        });

        if (res.ok) {
            alert("更新が完了しました");
            router.push("/productTable");
        } else {
            setError("更新に失敗しました");
        }
        setLoading(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getProduct();
            setLoading(false);
        }
        fetchData();
    }, [id])

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <Header />
            <div className="flex justify-center">
                <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">

                    <h1 className="text-2xl font-bold text-center">商品テーブル</h1>
                    <Link href="/productTable" className="inline-flex items-center gap-1 text-md underline text-blue-500 hover:text-blue-700 transition-colors mb-2">
                        一覧へ戻る
                    </Link>
                    <br />
                    {error && <span className="text-red-500 md-4">{error}</span>}
                    {loading
                        ? <LoadingSpinner />
                        : <>
                            <span>商品名</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                                placeholder="商品名"
                                className="w-full border border-gray-300 outline-none p-2 mb-2 rounded-md"
                            />
                            <span>価格</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                                min={1}
                                placeholder="価格"
                                className="w-full border border-gray-300 outline-none p-2 mb-2 rounded-md"
                            />
                            <span>在庫</span>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                                min={0}
                                placeholder="在庫"
                                className="w-full border border-gray-300 outline-none p-2 rounded-md"
                            />
                            <div className="flex justify-center">
                                <button
                                    onClick={handleEdit}
                                    className="bg-blue-400 text-white mt-4 py-1 px-3 rounded-md hover:bg-blue-500 cursor-pointer transition-colors"
                                >
                                    登録
                                </button>
                            </div>
                        </>}
                </div>
            </div>
        </div>
    )
}