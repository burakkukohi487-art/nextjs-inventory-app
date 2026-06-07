"use client";

import { useEffect, useState } from "react";
import { Product } from "./types/products"
import ProductTable from "./components/ProductTable";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center text-black">
      <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
        <h1 className="text-2xl font-bold text-center">商品テーブル</h1>
        <ProductTable products={products} />
        <a href="/login" className="text-blue-500">テスト用ログインリンク</a>
      </div>
    </div>
  )
}