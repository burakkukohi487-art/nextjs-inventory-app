# nextjs-inventory-app

Next.jsで在庫管理アプリを作成する

## 目的

- 業務アプリ開発の経験を積む
- MySQLとの連携
- ログイン機能・認証を実装する

## 使用技術

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- MySQL
- NextAuth.js
- bcryptjs
- zod

## 機能

- 社員番号・パスワードでのログイン
- パスワードのハッシュ化（bcrypt）
- ロール管理（管理者・一般社員）
- 商品一覧表示
- 商品登録
- 商品削除
- 商品情報の編集
- 社員登録（管理者のみ）
- 搬入登録

## セットアップ

```bash
npm install
```

`.env` ファイルを作成：

```
DATABASE_URL="mysql://ユーザー名:パスワード@localhost:3306/データベース名"
NEXTAUTH_SECRET="任意の文字列"
```

```bash
npx prisma db push
npx prisma db seed
npm run dev
```

## テスト用アカウント

- 管理者：社員番号 `0001` / パスワード `admin123`
- 一般社員：社員番号 `0002` / パスワード `staff123`