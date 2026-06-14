"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "./components/loadingSpinner";
import Header from "./components/Header";

export default function Home() {
  const { data: session, status } = useSession();
  const role = session?.user.role;

  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
  }, [])

  useEffect(() => {
    if (status === "loading") return;
    if (session === null) { router.push("/login") };
  }, [status, session, router])

  if (status === "loading" || status === "unauthenticated") return <div className="bg-white min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Header />
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 w-md shadow-xl mt-20 mb-auto p-4 rounded-2xl">
          <h1 className="text-2xl font-bold text-center">ホーム</h1>
          <Link
            href="/productTable"
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <p className="font-bold">商品一覧</p>
            <p className="text-sm text-gray-500">登録済みの商品を確認する</p>
          </Link>
          <Link
            href="/addProduct"
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <p className="font-bold">商品登録</p>
            <p className="text-sm text-gray-500">新しく商品を登録する</p>
          </Link>
          <Link
            href="/arrival"
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <p className="font-bold">搬入登録</p>
            <p className="text-sm text-gray-500">搬入情報を登録する</p>
          </Link>
          <Link
            href="/"
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <p className="font-bold">出荷登録</p>
            <p className="text-sm text-gray-500">出荷情報を登録する</p>
          </Link>
          {role === "ADMIN" &&
            <Link
              href="/addUser"
              className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <p className="font-bold">社員登録</p>
              <p className="text-sm text-gray-500">社員のアカウントを登録する</p>
            </Link>
          }
        </div>
      </div>
    </div>
  )
}