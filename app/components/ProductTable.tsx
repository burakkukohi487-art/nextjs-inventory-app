"use client"

import { useState } from "react";
import { Product } from "../types/products"
import { useRouter } from "next/navigation";

type Props = {
    products: Product[];
    onDelete: () => void;
};

export default function ProductTable({ products, onDelete }: Props) {
    const router = useRouter();

    const [error, setError] = useState("");

    const handleDelete = async (id: number) => {
        if (!confirm("商品を削除しますか？")) return;
        await fetch(`/api/products/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    onDelete();
                    alert("削除が完了しました")
                } else {
                    setError("削除に失敗しました");
                    router.push("/productTable");
                }
            })
            .then((e) => {
                console.log(e);
            })
    }

    return (
        <div>
            {error && <span className="text-red-500 mt-4">{error}</span>}
            <table className="w-full">

                <thead>
                    <tr className="bg-gray-400">
                        <th className="border border-gray-300">商品ID</th>
                        <th className="border border-gray-300">商品名</th>
                        <th className="border border-gray-300">価格</th>
                        <th className="border border-gray-300">在庫数</th>
                        <th className="border border-gray-300"></th>
                        <th className="border border-gray-300"></th>

                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="border border-gray-300 text-center">{product.id}</td>
                            <td className="border border-gray-300">{product.name}</td>
                            <td className="border border-gray-300 text-right">{product.price}</td>
                            <td className="border border-gray-300 text-right">{product.stock}</td>
                            <td className="border border-gray-300 text-center">
                                <button
                                    onClick={() => router.push(`/editProduct/${product.id}`)}
                                    className="text-blue-500 hover:underline cursor-pointer text-sm"
                                >
                                    編集
                                </button>
                            </td>
                            <td className="border border-gray-300 text-center">
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-red-500 hover:underline cursor-pointer text-sm"
                                >
                                    削除
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}