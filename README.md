## Reserve-Sys-SQLite
[reserve-sys](https://github.com/Benjuwan/reserve-sys)リポジトリの派生ver（`prisma`×`SQLite`）<br><br>
任意の部屋数を用意するとともに、各部屋ごとの予約を視覚的に把握及び管理・編集できる「会議室予約システムUI」です。<br>`prisma`×`SQLite`で予約内容をビルトインのデータベースに保存・管理する仕様にしています。<br>

- `src/types/rooms-atom.ts`<br>部屋数と予約可能時間の設定ファイル

### 仕様紹介
以下の仕様に関しては[reserve-sys](https://github.com/Benjuwan/reserve-sys)リポジトリと同様です。<br><br>

- 予約内容の重複禁止<br>他の方が先に予約している場合は受け付けません。
- 予約時間外は受付不可<br>「`timeBlockBegin`時～`timeBlockEnd`時（※）」の時間帯で予約できます。各部屋ごとのタイムテーブルには当日分の予約内容が反映されます。<br>※：`src/types/rooms-atom.ts`の`timeBlockBegin`と`timeBlockEnd`から値を取得
- 過去の予約内容は随時削除<br>当日以前の過去予約内容は削除（※）されます。<br>※：`src/components/schedule/calendar/hooks/useRemovePastSchedule.ts`での`deleteReservation`処理にて実行

#### 予約方法
<img width="948" alt="スケジュール欄の日付にあるアイコンをクリック" src="https://github.com/user-attachments/assets/38353bee-9797-4b3d-a228-70ec86d01b84" />

- スケジュール欄の日付にあるアイコンをクリック

---
<img width="916" alt="表示されたフォーム内の所定項目を選択及び入力" src="https://github.com/user-attachments/assets/8401cc6b-8379-4afb-beff-29a13f8857c2" />

- 表示されたフォーム内の所定項目を選択及び入力

---
<img width="817" alt="登録完了" src="https://github.com/user-attachments/assets/50cf9e66-6519-453a-b325-f67e5a7c4e7a" />

- 登録完了

#### 予約内容の変更
<img width="816" alt="スケジュール欄の日付にある編集したいタスクをクリックすると上記画面が表示される" src="https://github.com/user-attachments/assets/fb824b3a-98a1-49f4-bc5c-b3149d2e20b3" />

- スケジュール欄の日付にある**編集したいタスクをクリック**すると上記画面が表示される

---
<img width="802" alt="表示されたフォーム内の所定項目を選択及び入力（編集）" src="https://github.com/user-attachments/assets/b91c0144-22fe-45de-b387-3ab4702c635a" />

- 表示されたフォーム内の所定項目を選択及び入力（編集）

---
<img width="804" alt="06" src="https://github.com/user-attachments/assets/426a007f-560b-4792-a674-fe07986a98c2" />

- 編集完了

---

## 技術構成
- @eslint/eslintrc@3.3.1
- @prisma/client@6.17.1
- @types/node@24.8.1
- @types/react-dom@19.2.2
- @types/react@19.2.2
- @types/uuid@10.0.0
- eslint-config-next@15.5.6
- eslint@9.38.0
- jotai@2.15.0
- next@15.5.6
- prisma@6.17.1
- react-dom@19.2.0
- react@19.2.0
- typescript@5.9.3
- uuid@13.0.0

> [!NOTE]
> - `npm audit`で定期的に脆弱性のチェックを行う
> - `npm update`で定期的に（互換性を維持した）更新を行う
>   - `^`（キャレット：「指定されたバージョンからメジャーバージョンを変更しない範囲で最新のバージョンまでを許容」する機能を示す記号）が付いていても油断せず定期的にチェックする<br>例：`"next": "^14.2.12"`の場合、14.2.12以上 15.0.0未満のバージョンが許容される
> - `npm outdated`で表示される`Current`と`Wanted`の内容が等しいのが望ましい
> - 特定ライブラリを最新にするには`npm install ライブラリ名@latest`コマンドを実行する

### アップデートや更新後に読み込みエラーが発生する場合は以下を実施
`npm audit fix`または`npm update`後にエラーが発生してサイトが表示されない場合は`npx prisma generate`を実施する。
```bash
# Prismaクライアントを更新してスキーマを反映
npx prisma generate
```

## セットアップ（起動）に必要な作業
- `.env.local`を用意
```bash
# NEXT_PUBLIC を前置した環境変数はクライアントサイドに露出する 
NEXT_PUBLIC_API_URL=http://localhost:3000/
```

- `Prisma`クライアントを更新してスキーマを反映（`npx prisma generate`を実行）
```bash
npx prisma generate
```

## 備考
- `prisma studio`<br>
`GUI`でテーブル操作できる機能
```bash
# npx prisma studio で起動
npx prisma studio
```

- `prisma`のアップデートコマンド<br>
```bash
npm i --save-dev prisma@latest
npm i @prisma/client@latest 
```

## Prisma × SQLite の設定（初期セットアップ）方法
- [Prisma × SQLite | memo.md](./memo.md#prisma--sqlite)
- [Prismaの設定 | Next.js（v15）× Prisma × SQLite で会議室予約システムを作ってみた](https://qiita.com/benjuwan/items/c4341ca41758b076a385#prisma%E3%81%AE%E8%A8%AD%E5%AE%9A)

## データベースの仕様（テーブル）更新
登録内容を変更したい場合、以下フローを実行する必要がある。
- `prisma/schema.prisma`<br>
`model`オブジェクトの内容を編集（登録内容を追加・削除）
- `prisma/schema.prisma`の`model`オブジェクト編集後、以下のコマンドをターミナルに打つ
```bash
# マイグレーションファイルを作成し、データベースに変更を適用
npx prisma migrate dev --name what_you_changed # --name 以降は任意の命名

# Prismaクライアントを更新して新しいスキーマを反映
npx prisma generate
```

> [!NOTE]
> - `prisma/dev.db-journal`<br>
> `dev.db-journal`という設定中のデータベース（今回は`SQLite`）の内部処理用ファイルが自動的に生成・削除されるが無視して構わない。<br>
> `dev.db-journal`は`SQLite`が自動的に管理する`SQLite`のトランザクションログファイルで、データベース操作の一時的な記録を保持している。

### その他の更新・修正が必要なファイル
※以下の更新・修正は本リポジトリにおいてのみ適用されるもので一般的なものではありません。
- `src/app/components/schedule/todoItems/ts/todoItemType.ts`<br>
登録内容の型情報を編集
- `src/app/components/schedule/todoItems/TodoForm.tsx`
    - `todoItems`ステートの初期値である`initTodoItems`オブジェクトを編集（オブジェクトに当該登録内容であるプロパティ・キーを追加・削除）
    - （変更した）当該登録内容に関する入力フォームを（`src/app/components/schedule/todoItems/utils`配下に）用意または調整
- `src/app/api/reservations/`配下の`Route Handlers`の登録内容を編集<br>
（※[前述の`prisma`データベース更新フロー](#データベースの仕様テーブル更新)が済んでいないと進まないので注意）
    - `POST`, `PUT`に関する`data`オブジェクト内を編集（例：プロパティ・キーの追加など）<br>
    ※`data`オブジェクト編集後に型エラーが表示される場合は一旦`VSCode`を閉じてみる
