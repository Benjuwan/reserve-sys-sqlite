## Reserve-Sys-SQLite
[reserve-sys](https://github.com/Benjuwan/reserve-sys)リポジトリの派生ver（`prisma`×`SQLite`）<br><br>
任意の部屋数を用意するとともに、各部屋ごとの予約を視覚的に把握及び管理・編集できる「会議室予約システムUI」です。<br>`prisma`×`SQLite`で予約内容をビルトインのデータベースに保存・管理する仕様にしています。<br>

- `src/app/types/rooms-atom.ts`<br>部屋数と予約可能時間の設定ファイル

### 仕様紹介
以下の仕様に関しては[reserve-sys](https://github.com/Benjuwan/reserve-sys)リポジトリと同様です。<br><br>

- 予約内容の重複禁止<br>他の方が先に予約している場合は受け付けません。
- 予約時間外は受付不可<br>今月かつ「`timeBlockBegin`時～`timeBlockEnd`時（※）」の時間帯で予約できます。また、タイムテーブルには当日分の予約内容が反映されます。<br>※：`src/app/types/rooms-atom.ts`の`timeBlockBegin`と`timeBlockEnd`から値を取得
- 過去の予約内容は随時削除<br>当日以前の過去予約内容は削除（※）されます。<br>※：`src/app/components/schedule/calendar/Calendar.tsx`内の`useEffect`での`deleteReservation`処理にて実行

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

### アラートコード
- 予約内容の時間帯が競合した場合に表示されるアラート情報の発生元ファイル
  - aCode:001<br>`src\app\components\schedule\todoItems\TodoForm.tsx`
  - aCode:002<br>`src\app\components\schedule\todoItems\utils\TodoFormItemTimeSchedule.tsx`
  - aCode:003<br>`src\app\components\schedule\todoItems\utils\TodoFormItemRegiBtn.tsx`

## 技術構成
- @prisma/client@6.2.1
- @types/node@20.16.11
- @types/react-dom@19.0.2 overridden
- @types/react@19.0.1 overridden
- @types/uuid@10.0.0
- eslint-config-next@15.1.1
- eslint@8.57.1
- jotai@2.10.0
- next@15.1.3
- prisma@6.2.1
- react-dom@19.0.0
- react@19.0.0
- typescript@5.6.2
- uuid@10.0.0

## 備考
- `.env.local`を用意
```bash
## NEXT_PUBLIC を前置した環境変数はクライアントサイドに露出する 
NEXT_PUBLIC_API_URL=http://localhost:3000/
```

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
