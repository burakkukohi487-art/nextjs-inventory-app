import { z } from "zod";

// バリデーションのルール
export const ProductSchema = z.object({
    name: z.string().min(1, "商品名は必須です"),
    price: z.number().int().min(1, "価格は1以上にしてください"),
    stock: z.number().int().min(0, "在庫数は0以上にしてください"),
});

// バリデーションの型
export type ProductInput = z.infer<typeof ProductSchema>;