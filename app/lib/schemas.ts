import { z } from "zod";

// バリデーションのルール
export const ProductSchema = z.object({
    name: z.string().min(1, "商品名は必須です"),
    price: z.number().int().min(1, "価格は1以上にしてください"),
    stock: z.number().int().min(0, "在庫数は0以上にしてください"),
});

export const UserSchema = z.object({
    empNo: z.string().min(1, "社員番号は必須です"),
    password: z.string().min(1, "パスワードは必須です"),
    name: z.string().min(1, "社員名は必須です"),
    role: z.enum(["ADMIN", "EMPLOYEE"], {   // enumは第二引数に直接文字列を入れられない
        message: "役職は社員か管理者のどちらかを選択してください"
    }),
});

export const ArrivalSchema = z.object({
    productId: z.number().int(),
    quantity: z.number().int().min(1, "搬入数は1以上にしてください").max(999999, "搬入数が大きすぎます"),
});

// バリデーションの型
export type ProductInput = z.infer<typeof ProductSchema>;
export type UserInput = z.infer<typeof UserSchema>;
export type ArrivalInput = z.infer<typeof ArrivalSchema>;