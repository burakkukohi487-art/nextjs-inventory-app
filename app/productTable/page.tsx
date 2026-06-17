"use client";

import { useEffect, useState } from "react";
import { Product } from "../types/products"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/loadingSpinner";
import Header from "../components/Header";
import Link from "next/link";
import { AlertTriangle, Circle } from "lucide-react";

type Filter = "all" | "in" | "low" | "out";
type Sort = "id" | "price" | "stock";
type Order = "asc" | "desc";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("id");
  const [order, setOrder] = useState<Order>("asc");

  const router = useRouter();

  const [error, setError] = useState("");

  const viewProducts = products
    .filter((product) => {
      switch (filter) {
        case "all": return true;
        case "out": return product.stock === 0;
        case "low": return product.stock > 0 && product.stock < 31;
        case "in": return product.stock > 30;
      }
    })
    .sort((a, b) => {
      const diff = a[sort] - b[sort];
      return order === "asc" ? diff : -diff;
    });

  const load = async () => {
    await fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }

  const handleDelete = async (id: number) => {
    if (!confirm("商品を削除しますか？")) return;
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          load();
          alert("削除が完了しました")
        } else {
          setError("削除に失敗しました");
          router.push("/productTable");
        }
      })
  }

  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false);
      })
  }, [])

  useEffect(() => {
    if (status === "loading") return;
    if (session === null) { router.push("/login") };
  }, [status, session, router])

  if (status === "loading" || status === "unauthenticated" || loading === true) return <div className="bg-white min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Header />
      <div className="flex justify-center">
        <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
          <h1 className="text-2xl font-bold text-center">商品テーブル</h1>
          <div className="flex justify-between">
            <Link href="/" className="inline-flex items-center gap-1 text-md underline text-blue-500 hover:text-blue-700 transition-colors">
              ホームへ戻る
            </Link>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
                className="border border-gray-300 outline-none p-1 rounded-md"
              >
                <option value="all">全て</option>
                <option value="in">在庫あり</option>
                <option value="low">在庫少</option>
                <option value="out">在庫なし</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="border border-gray-300 outline-none p-1 rounded-md"
              >
                <option value="id">ID順(登録順)</option>
                <option value="price">価格順</option>
                <option value="stock">在庫数順</option>
              </select>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as Order)}
                className="border border-gray-300 outline-none p-1 rounded-md"
              >
                <option value="asc">昇順</option>
                <option value="desc">降順</option>
              </select>
            </div>
          </div>
          <br />
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
                {viewProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="border border-gray-300 text-center">{product.id}</td>
                    <td className="border border-gray-300">{product.name}</td>
                    <td className="border border-gray-300 text-right">{product.price}</td>
                    <td className="border border-gray-300 text-right">
                      <div className="flex items-center">
                        {product.stock === 0
                          ? <span title="在庫切れ"><AlertTriangle size={18} className="text-gray-500 fill-red-500" /></span>
                          : product.stock < 31
                            ? <span title="在庫少(30以下)"><Circle size={18} className="text-gray-500 fill-yellow-400" /></span>
                            : null}
                        <span className="ml-auto">
                          {product.stock}
                        </span>
                      </div>
                    </td>
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
        </div>
      </div>
    </div>
  )
}