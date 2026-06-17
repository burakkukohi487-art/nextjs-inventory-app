"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/products"
import LoadingSpinner from "../components/loadingSpinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Link from "next/link";

type TypeFilter = "all" | "arrival" | "shipment";
type HistoryItem = {
    id: number;
    productId: number;
    quantity: number;
    createdAt: string;
    type: "搬入" | "出荷";
    product: {
        name: string;
    };
};

export default function History() {
    const { data: session, status } = useSession();

    const router = useRouter();

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [productFilter, setProductFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/products").then((res) => res.json()),
            fetch("/api/history").then((res) => res.json()),
        ]).then(([products, history]) => {
            setAllProducts(products);
            setHistory(history);
            setLoading(false);
        });
    }, []);


    const filteredHistory = history
        .filter((item) => !productFilter || item.productId === Number(productFilter))
        .filter((item) => {
            switch (typeFilter) {
                case "all": return true;
                case "arrival": return item.type === "搬入";
                case "shipment": return item.type === "出荷";
                default: return true;
            }
        });

    useEffect(() => {
        if (status === "loading") return;
        if (session === null) { router.push("/login") };
    }, [status, session, router])

    if (status === "loading" || status === "unauthenticated" || loading) return <div className="bg-white min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <Header />
            <div className="flex justify-center">
                <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
                    <h1 className="text-2xl font-bold text-center">搬入・出荷履歴</h1>
                    <div className="flex justify-between">
                        <Link href="/" className="inline-flex items-center gap-1 text-md underline text-blue-500 hover:text-blue-700 transition-colors">
                            ホームへ戻る
                        </Link>
                        <div className="flex gap-2">
                            <select
                                value={productFilter}
                                onChange={(e) => setProductFilter(e.target.value)}
                                className="border border-gray-300 outline-none p-1 rounded-md"
                            >
                                <option value="">全て</option>
                                {allProducts.map((product) => (
                                    <option
                                        key={product.id}
                                        value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                                className="border border-gray-300 outline-none p-1 rounded-md"
                            >
                                <option value="all">全て</option>
                                <option value="arrival">搬入</option>
                                <option value="shipment">出荷</option>
                            </select>
                        </div>
                    </div>
                    <br />
                    {filteredHistory.length !== 0 ?
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-400">
                                    <th className="border border-gray-300">商品ID</th>
                                    <th className="border border-gray-300">商品名</th>
                                    <th className="border border-gray-300">操作区分</th>
                                    <th className="border border-gray-300">数量</th>
                                    <th className="border border-gray-300">日時</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((item) => (
                                    <tr key={`${item.type}${item.id}`}>
                                        <td className="border border-gray-300 text-center">{item.productId}</td>
                                        <td className="border border-gray-300">{item.product.name}</td>
                                        <td className="border border-gray-300 text-center">
                                            <span className={item.type === "搬入" ? "text-blue-600" : "text-red-600"}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 text-right">{item.quantity}</td>
                                        <td className="border border-gray-300 text-right">{new Date(item.createdAt).toLocaleString("ja-JP")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        : <span className="block w-full text-center">履歴が見つかりませんでした</span>}
                </div>
            </div>
        </div>
    )
}