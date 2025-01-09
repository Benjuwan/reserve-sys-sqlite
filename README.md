## Reserve-Sys-SQLite
[reserve-sys](https://github.com/Benjuwan/reserve-sys)リポジトリの派生ver（`prisma`×`SQLite`）<br><br>
任意の部屋数を用意するとともに、各部屋ごとの予約を視覚的に把握及び管理・編集できる「会議室予約システムUI」です。<br>`prisma`×`SQLite`で予約内容をビルトインのデータベースに保存・管理する仕様にしています。<br>

- `src/app/types/rooms-atom.ts`<br>部屋数と予約可能時間の設定ファイル

## 注意事項
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

## 技術構成
- @prisma/client@6.1.0
- @types/node@20.16.11
- @types/react-dom@19.0.2 overridden
- @types/react@19.0.1 overridden
- @types/uuid@10.0.0
- eslint-config-next@15.1.1
- eslint@8.57.1
- jotai@2.10.0
- next@15.1.3
- prisma@6.1.0
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

- `src\app\components\schedule\calendar\Calendar.tsx`
当日以前の過去予約分は上記コンポーネント内の`deleteReservation`メソッドで削除
