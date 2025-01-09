## メモ
- `Route Handlers`は**クライアントコンポーネントから呼び出す**

### `Route Handler`
- `src/app/api/reservations/route.ts`
  - CRUD操作のためのAPIエンドポイント
  - `POST`, `PUT`, `DELETE`メソッドの実装

## SQLite
- 特徴
  - アプリケーション内に用意でき、ファイルベースとなっているので簡単に利用が可能。
  - 軽量で組み込み型のリレーショナルデータベース。アプリの中でデータベースを持てるので外部にサーバーを立てる必要がない。モックやプロトタイプ、小規模なプロジェクトでよく使用される。

### 注意事項
`SQLite`はあくまで開発環境用で、本番環境で機能させるには特定のデータベースや`BaaS`などを使うべきです。

- `SQLite`が本番環境に向かない理由
1. ファイルベースの構造<br>
サーバーレス環境（例: Vercel）では、各リクエストごとに独立したインスタンスが生成されるため、ローカルファイル（SQLiteデータベース）に永続的なデータを保存できません。

2. スケーラビリティの問題<br>
SQLiteは複数の同時接続に対して弱く、大規模なアプリケーションには不向きです。<br>読み取り操作は高速ですが、書き込み操作ではロックが発生しやすいため、パフォーマンスに影響が出る可能性があります。

3. クラウドインフラとの相性<br>
クラウドホスティング（VercelやAWS Lambdaなど）の多くが揮発性ストレージを持つため、SQLiteのデータベースファイルがリクエスト終了時に消去されるリスクがあります。

4. データの整合性とバックアップ<br>
SQLiteはシングルファイルデータベースのため、破損した場合にデータ全体が失われるリスクがあります。<br>クラウドデータベースサービスが提供する自動バックアップや復旧機能が使えません。


5. 監視とメンテナンス<br>
パフォーマンスメトリクスの取得が限られています。<br>データベースの状態監視やアラート設定などの運用機能が不足しています。

## Prisma
- データベースとのやり取りを簡単にする`ORM`というツール。`ORM`とはデータベースのテーブルをオブジェクトとして操作できる技術で、`SQL`を書かなくても`JavaScript`（`TypeScript`）のコードだけでデータベース操作ができるようになる。
- `prisma/migratitons`フォルダの中にはマイグレート（設定した内容を実際のデータベースに反映させる作業）の履歴のようなものが残る。
- `dev.db`：DBの情報を保持しているファイル

## 内部ファイルとして各部屋データのデータフェッチを行う場合
- `public`dir をプロジェクトファイル直下に用意し、そのファイル内にフェッチ用データを置く
```
- public
  |-  room.json // フェッチ用データ
- src
  |- app
  ...
  ..
  .
- next.config.mjs
- tsconfig.json
- README.md
...
..
.
```

- クライアントコンポーネントでデータフェッチ
```tsx
// `src/app/components/rooms/Rooms.tsx`

const [rooms, setRooms] = useAtom(roomsAtom);

useEffect(() => {
    const fetchRoomsData: () => Promise<void> = async () => {
        try {
            /* public/room.json をフェッチ */
            const res: Response = await fetch("/room.json", { cache: 'no-store' });

        if (!res.ok) {
            throw new Error('fetch error');
        }

        const resObj: roomType[] = await res.json();
        setRooms(resObj);
        } catch (e) {
            console.error(e);
        }
    }
    fetchRoomsData();
}, []);
```

## prisma × SQLite
`Prisma`の設定フロー<br>各フローの補足説明は[こちら（4. データの永続化をする | 【図解解説】これ1本でGraphQLをマスターできるチュートリアル【React/TypeScript/Prisma】）](https://qiita.com/Sicut_study/items/13c9f51c1f9683225e2e#4-%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AE%E6%B0%B8%E7%B6%9A%E5%8C%96%E3%82%92%E3%81%99%E3%82%8B)が詳しい。

1. `Prisma`のインストール
```bash
npm install prisma @prisma/client
npm install @prisma/client
```

2. `Prisma`の初期化
```bash
npx prisma init
```

3. マイグレーションの実行
```bash
npx prisma migrate dev --name init
```

4. クライアントの生成
```bash
npx prisma generate
```

### `.env`と`.env.local`の設定
- `.env`
```bash
DATABASE_URL="file:./dev.db"
```

- `.env.local`
```bash
# 本番環境ではホスティング先のURLを指定
NEXT_PUBLIC_API_URL="http://localhost:3000/"
```

### スキーマ設定
- `prisma/schema.prisma`
```
datasource db {
  provider = "sqlite"         // 使用するDBの種類を指定（今回はSQLite）
  url      = "file:./dev.db"  // プロジェクト内の dev.db をデータベースの参照URLとして設定
}

generator client {
  provider = "prisma-client-js" // Prismaクライアントを生成するためのライブラリを指定
}

// データベースのテーブル内容とリンクさせるための設定
model Reservation {
  id          String   @id @default(uuid()) // 主キーの指定（UUIDを自動生成）
  todoID      String                        // 日付 (yyyy/mm/d)
  todoContent String                        // 予約内容
  edit        Boolean  @default(false)
  pw          String                        // 編集可否パスワード
  rooms       String                        // 予約会議室名
  startTime   String                        // 開始時間 (hh:mm)
  finishTime  String                        // 終了時間 (hh:mm)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- `prisma/schema.prisma`
  - データベースのスキーマ定義
  - モデルの定義

### `prisma`設定
- `src/lib/prisma.ts`
  - `Prisma`クライアントのシングルトンインスタンスを管理
  - グローバルな状態での`Prisma`クライアントの再利用を確保

```ts
// `src/lib/prisma.ts`

/* クライアントで prisma を通じてデータベースを操作・利用するための機能をインポート */
import { PrismaClient } from '@prisma/client';

/* グローバルスコープに PrismaClient のインスタンスを保持するための型定義 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/* PrismaClient のインスタンスが存在しない場合は新規作成 */
export const prisma = globalForPrisma.prisma || new PrismaClient();

/**
 * 開発環境の場合のみ、グローバルオブジェクトに PrismaClient インスタンスを保持
 * これにより開発時のホットリロードで複数のインスタンスが作成されることを防ぐ
*/
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### prisma studio
`GUI`でテーブル操作できる機能

- `npx prisma studio`で起動
```bash
npx prisma studio
```

### データベースの仕様（テーブル）更新
登録内容を変更したい場合、以下フローを実行する必要がある。
- `prisma/schema.prisma`<br>`model`オブジェクトの内容を編集（登録内容を追加・削除）
- `prisma/schema.prisma`の`model`オブジェクト編集後、以下のコマンドをターミナルに打つ
```bash
# マイグレーションファイルを作成し、データベースに変更を適用
npx prisma migrate dev --name what_you_changed # --name 以降は任意の命名

# Prismaクライアントを更新して新しいスキーマを反映
npx prisma generate
```

> [!NOTE]  
> `prisma/dev.db-journal`<br>`dev.db-journal`という`SQLite`の内部処理用ファイルが生成されるが自動的に生成・削除されるが無視して良い（`dev.db-journal`は`SQLite`が自動的に管理する`SQLite`のトランザクションログファイルで、データベース操作の一時的な記録を保持している）

- `src/app/components/schedule/todoItems/ts/todoItemType.ts`<br>登録内容の型情報を編集
- `src/app/components/schedule/todoItems/TodoForm.tsx`
  - `todoItems`ステートの初期値である`initTodoItems`オブジェクトを編集（オブジェクトに当該登録内容であるプロパティ・キーを追加・削除）
  - （変更した）当該登録内容に関する入力フォームを（`src/app/components/schedule/todoItems/utils`配下に）用意または調整
- `src/app/api/reservations/`配下の`Route Handler`の登録内容を編集
  - `POST`, `PUT`に関する`data`オブジェクト内を編集（例：プロパティ・キーの追加など）
    - ※`data`オブジェクト編集後に型エラーが表示される場合は一旦`VSCode`を閉じてみる

## 参照
### prisma
- [【Next.js】Prismaを使ってみる](https://www.sddgrp.co.jp/blog/technology/use-next-jsprisma/)
- [Quickstart](https://www.prisma.io/docs/getting-started/quickstart-sqlite)
- [SQLite](https://www.prisma.io/docs/orm/overview/databases/sqlite)
- [【図解解説】これ1本でGraphQLをマスターできるチュートリアル【React/TypeScript/Prisma】](https://qiita.com/Sicut_study/items/13c9f51c1f9683225e2e#4-%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AE%E6%B0%B8%E7%B6%9A%E5%8C%96%E3%82%92%E3%81%99%E3%82%8B)

### その他
- `link`で別ファイルを読み込む方法<br>
[Next.jsでheadタグの中にlinkでスタイルシート指定をする方法](https://naopoyo.com/docs/how-to-specify-a-stylesheet-with-a-link-tag-in-the-head-tag-in-next-js)# reserve-sys

- `useState`や`useEffect`を抑えて不要な再レンダリングを防ぐ<br>
[優先度順：Reactの再レンダリング最適化ガイド](https://zenn.dev/any_dev/articles/react-performance-rendering-guide)

- `ESLint`エラー：`Expected an assignment or function call and instead saw an expression`への対処<br>
[ESLint A && B, A || C が no-unused-expressions のエラーになる](https://chaika.hatenablog.com/entry/2024/09/28/083000#google_vignette)

## 備忘録
### カスタムフックの呼び出し場所に注意
- `ESLint`でエラーが発生する
```diff
export const usePrevNextDays = () => {
+    // OK：領域外でカスタムフックを呼び出す
+    const { getCalendarItem } = useGetCalndarItem();

    const prevNextDays: (year: number, month: number, dayDateBox: calendarItemType[]) => calendarItemType[] = (
        year: number,
        month: number,
        dayDateBox: calendarItemType[],
    ) => {
-        // NG：カスタムフック内でカスタムフックを呼び出してしまっている
-        const { getCalendarItem } = useGetCalndarItem();
    ...
    ..
    .
```

### `Atom`
- `atomWithDefault`
`atomWithDefault`は非同期の初期値を扱える`jotai`のユーティリティ。

```ts
export const fetchTodoMemoAtom = atomWithDefault(async () => {
    // GET処理： src/app/api/reservations/route.ts の GET によりDBからのデータを取得 
    const response: Response = await fetch('/api/reservations', { cache: 'no-store' });
    const resObj: todoItemType[] = await response.json();
    return resObj;
});
```

引数として渡した非同期関数（この場合はfetchを行う関数）が実行され、その結果が atom の初期値として設定される。

```ts
const [fetchTodoMemo] = useAtom(fetchTodoMemoAtom);
```

コンポーネント内で useAtom(fetchTodoMemoAtom) を使用すると、自動的に：
1. フェッチ処理が実行される
2. データが取得できるまでの間は undefined または Promise の状態になる
3. データ取得完了後、取得したデータで状態が更新される

### `vercel`デプロイ時に`prisma`起因のエラー
- `prisma`起因のエラー
`vercel`の「`Node.js`の依存関係をキャッシュ」する働きによって「古い`Prisma Client`が使用されてしまって」デプロイエラーになっていた。（＝`Prisma Client`の自動生成が正しく実行されていなかった）

```
Error [PrismaClientInitializationError]: Prisma has detected that this project was built on Vercel, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the `prisma generate` command during the build process.
```

- 解決策
`build`時に`prisma generate`で`Prisma Client`を新規制作するように変更する

```diff
{
  "scripts": {
    "dev": "next dev",
-   "build": "next build",
+   "build": "prisma generate && next build",
    ...
    ..
    .
  }
}
```
