// [...nextauth]は、「なんでもキャッチするルート」
// /api/auth/signin
// /api/auth/signout
// /api/auth/callback   すべて [...nextauth]/route.ts が処理する

import { handlers } from "@/auth";

export const { GET, POST } = handlers;