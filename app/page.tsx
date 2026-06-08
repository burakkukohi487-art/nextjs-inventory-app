"use client";

import { useEffect, useState } from "react";
import { Product } from "./types/products"
import ProductTable from "./components/ProductTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./components/loadingSpinner";
import Header from "./components/Header";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const { data: session, status } = useSession();
  const name = session?.user.name;
  const role = session?.user.role;

  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  useEffect(() => {
    if (session === null) { router.push("/login") };
  }, [session, router])

  if (status === "loading" || status === "unauthenticated") return <div className="bg-white min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Header />
      <div className="flex justify-center">
        <div className="w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
          <h1 className="text-2xl font-bold text-center">商品テーブル</h1>
          <ProductTable products={products} />
        </div>
      </div>
    </div>
  )
}