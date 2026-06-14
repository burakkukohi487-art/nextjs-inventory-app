"use client";

import { useEffect, useState } from "react";
import { Product } from "../types/products"
import ProductTable from "../components/ProductTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/loadingSpinner";
import Header from "../components/Header";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  useEffect(() => {
    if (status === "loading") return;
    if (session === null) { router.push("/login") };
  }, [status, session, router])

  if (status === "loading" || status === "unauthenticated") return <div className="bg-white min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  const load = async () => {
    await fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Header />
      <div className="flex justify-center">
        <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
          <h1 className="text-2xl font-bold text-center">商品テーブル</h1>
          <Link href="/" className="inline-flex items-center gap-1 text-md underline text-blue-500 hover:text-blue-700 transition-colors">
            ホームへ戻る
          </Link>
          <ProductTable products={products} onDelete={load} />
        </div>
      </div>
    </div>
  )
}