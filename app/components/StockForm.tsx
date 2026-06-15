"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../types/products";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoadingSpinner from "./loadingSpinner";

type Props = {
    title: string;
    apiPath: string;
}

export default function StockForm({ title, apiPath }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState<string[]>([]);

    const { data: session, status } = useSession();

    const router = useRouter();

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => { setProducts(data) })
    }, [])

    const handle = async () => {
        if (productId === "" || quantity === "") return;
        await fetch(apiPath, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId: Number(productId),
                quantity: Number(quantity),
            }),
        }).then(async (res) => {
            if (res.ok) {
                alert("登録が完了しました")
                setProductId("")
                setQuantity("")
                setError([])
            } else {
                const data = await res.json();
                setError(data.map((issue: { message: string }) => issue.message));
            }
        })
    }

    useEffect(() => {
        if (status === "loading") return;
        if (session === null) { router.push("/login") };
    }, [status, session, router])

    if (status === "loading" || status === "unauthenticated") return <div className="bg-white min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
            <h1 className="text-2xl font-bold text-center">{title}</h1>
            <Link href="/" className="inline-flex items-center gap-1 text-md underline text-blue-500 hover:text-blue-700 transition-colors">
                ホームへ戻る
            </Link>
            <br />
            {error.map((err, i) => (
                <span key={i} className="text-red-500 text-sm block">{err}</span>
            ))}
            <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handle()}
                className="w-full border border-gray-300 outline-none p-2 mt-4 my-1 rounded-md"
            >
                <option value="">商品を選択</option>
                {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                ))}
            </select>
            <input
                type="number"
                placeholder="数量"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handle()}
                className="w-full border border-gray-300 outline-none p-2 my-1 rounded-md"
            />
            <div className="flex justify-center">
                <button
                    onClick={handle}
                    className="bg-blue-400 text-white mt-4 py-1 px-3 rounded-md hover:bg-blue-500 cursor-pointer transition-colors"
                >
                    登録
                </button>
            </div>
        </div>
    )
}