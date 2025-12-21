🌏 バックパッカー掲示板 開発レポート
📅 開発期間: Day 1-2 完了
🎯 プロジェクト概要
プロジェクト名
Backpacker Spots - 世界中のバックパッカー向け情報共有掲示板

目標
最終目標: 月間10万PVの多言語対応プラットフォーム
MVP期間: 3週間(21日)
開発手法: AI駆動開発
技術スタック
分野	技術
フロントエンド	Next.js 15 + Tailwind CSS
バックエンド	Supabase (PostgreSQL)
認証	Supabase Auth
翻訳	DeepL API
ホスティング	Vercel
バージョン管理	GitHub
✅ Day 1: 環境構築 (完了)
所要時間
約3-4時間

達成項目
1. 開発環境セットアップ
✅ Node.js v20.x.x インストール
✅ Git 2.43.0 インストール
✅ VS Code インストール
2. アカウント作成
✅ GitHub アカウント
✅ Supabase プロジェクト作成
プロジェクト名: afimbo's Project
リージョン: Singapore (Southeast Asia)
理由: バックパッカーの80%が活動する東南アジアをカバー
✅ DeepL API キー取得 (無料50万文字/月)
✅ Vercel アカウント
3. Next.jsプロジェクト作成
bash
npx create-next-app@latest backpacker-spots
選択した設定:

TypeScript: No
ESLint: Yes
Tailwind CSS: Yes (重要)
src/ directory: No
App Router: Yes (重要)
Turbopack: No
4. 環境変数設定
.env.local ファイル作成:

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
DEEPL_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx
5. 初回デプロイ準備
✅ GitHubリポジトリ作成
✅ 初回コミット・Push完了
トラブルシューティング記録
問題1: Gitインストールエラー
症状: 'git' is not recognized 原因: 環境変数が設定されていない 解決: 再インストール + PC再起動

問題2: PowerShell実行ポリシーエラー
症状: scripts is disabled 解決:

powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
✅ Day 2: データベース構築 + 基本表示 (完了)
所要時間
約5-6時間

達成項目
1. データベース設計
作成したテーブル:

spots (目的地情報)
カラム	型	説明
id	uuid (PK)	一意識別子
spot_name	text	目的地名
spot_type	text	カテゴリ(hostel, temple等)
country	text	国名
city	text	都市名
address	text	住所
latitude	numeric	緯度
longitude	numeric	経度
cost_amount	numeric	費用
cost_currency	text	通貨(USD, THB等)
how_to_get_there	jsonb	行き方(多言語)
tips	jsonb	ヒント(多言語)
author_id	uuid (FK)	投稿者ID
created_at	timestamptz	作成日時
updated_at	timestamptz	更新日時
comments (コメント)
カラム	型	説明
id	uuid (PK)	一意識別子
spot_id	uuid (FK)	目的地参照
user_id	uuid (FK)	コメント者ID
content	jsonb	コメント内容(多言語)
created_at	timestamptz	作成日時
saved_spots (保存済み目的地)
カラム	型	説明
id	uuid (PK)	一意識別子
user_id	uuid (FK)	ユーザーID
spot_id	uuid (FK)	目的地参照
created_at	timestamptz	保存日時
UNIQUE(user_id, spot_id)	制約	重複保存防止
2. Foreign Key設定
sql
-- spots → auth.users
ALTER TABLE spots
ADD CONSTRAINT fk_spots_author
FOREIGN KEY (author_id) REFERENCES auth.users(id)
ON DELETE SET NULL;

-- comments → spots, users
ALTER TABLE comments
ADD CONSTRAINT fk_comments_spot
FOREIGN KEY (spot_id) REFERENCES spots(id)
ON DELETE CASCADE;

ALTER TABLE comments
ADD CONSTRAINT fk_comments_user
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- saved_spots → spots, users
ALTER TABLE saved_spots
ADD CONSTRAINT fk_saved_spots_spot
FOREIGN KEY (spot_id) REFERENCES spots(id)
ON DELETE CASCADE;

ALTER TABLE saved_spots
ADD CONSTRAINT fk_saved_spots_user
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;
3. RLSポリシー設定
sql
-- 全員が目的地を閲覧可能
CREATE POLICY "全員が目的地を閲覧可能"
ON spots FOR SELECT TO public USING (true);

-- 全員がコメントを閲覧可能
CREATE POLICY "全員がコメントを閲覧可能"
ON comments FOR SELECT TO public USING (true);

-- 全員が保存済みスポットを閲覧可能
CREATE POLICY "全員が保存済みスポットを閲覧可能"
ON saved_spots FOR SELECT TO public USING (true);
4. サンプルデータ投入
3件の目的地を追加:

Lub d Bangkok Silom (ホステル - $15/泊)
Wat Phra Kaew (寺院 - 500 THB)
Khao San Road (ストリート - 無料)
5. Next.js実装
ファイル構成:

backpacker-spots/
├── app/
│   ├── page.tsx (ホームページ - データ表示)
│   └── layout.tsx
├── lib/
│   └── supabase.ts (Supabase接続設定)
└── .env.local (環境変数)
主要コード:

lib/supabase.ts:

typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
app/page.tsx:

Supabaseからデータ取得
カード形式で一覧表示
Tailwind CSSでスタイリング
モバイルファースト対応
6. ブラウザ表示成功!
🌏 Backpacker Spots
世界中のバックパッカーが共有する目的地情報

[3件のカードが美しく表示]
トラブルシューティング記録
問題1: Foreign Key エラー
症状: column "id" does not exist 原因: auth.users のカラム参照方法が間違っていた 解決: REFERENCES auth.users(id) に修正

問題2: spots テーブルのPrimary Key問題
症状: 複数カラムがPrimary Keyになっていた 原因: テーブル作成時の誤設定 解決: テーブルを削除して再作成

sql
DROP TABLE spots CASCADE;
CREATE TABLE spots (...);
問題3: lib フォルダの場所
症状: import '@/lib/supabase' でエラー 原因: lib が app 内に作成されていた 解決: lib を app と同じレベルに移動

📚 学習した技術概念
1. データベース基礎
Primary Key: 絶対に重複しない一意識別子(例: パスポート番号)
Foreign Key: 他のテーブルへの参照(例: 住所録)
UNIQUE制約: 特定の組み合わせの重複を防ぐ
2. SQL言語
DDL (Data Definition Language):

CREATE - 作成
ALTER - 変更
DROP - 削除
DML (Data Manipulation Language):

SELECT - 閲覧
INSERT - 追加
UPDATE - 更新
DELETE - データ削除
3. セキュリティ
RLS (Row Level Security): 誰が何を見れるかの制御
環境変数: APIキーを安全に管理
4. Next.js基礎
App Router: ファイルベースルーティング
'use client': クライアントコンポーネント
useEffect: データ取得のタイミング制御
5. JSONBデータ型
多言語対応のための柔軟なデータ保存:

json
{
  "ja": "日本語テキスト",
  "en": "English text"
}
📊 進捗状況
完成度
MVP の約30%完成!

Week 1 (21日計画):
✅ Day 1: 環境構築
✅ Day 2: データベース + 基本表示
⏭️ Day 3-4: 記事詳細ページ
⏭️ Day 5-6: 翻訳機能
⏭️ Day 7: Week 1完成!
技術スタック習得度
技術	習得度
SQL	⭐⭐⭐ (基礎習得)
Next.js	⭐⭐ (基本理解)
Supabase	⭐⭐⭐ (操作可能)
Git/GitHub	⭐⭐ (基本操作可能)
Tailwind CSS	⭐ (使用開始)
🎯 次のステップ (Day 3-4)
Day 3: 記事詳細ページ (2-3時間)
動的ルーティング実装
/spots/[id] ページ作成
詳細情報表示
地図統合(座標から)
全情報表示
言語切り替えボタン
日本語/英語トグル
Day 4: UI改善 + 検索機能 (2-3時間)
レスポンシブデザイン確認
スマホ表示最適化
タブレット対応
検索機能
国名フィルター
キーワード検索
カテゴリフィルター
hostel, temple, street等で絞り込み
💰 コスト状況
現在の月額コスト
$0/月 (完全無料)

サービス	プラン	コスト
Vercel	Hobby	$0
Supabase	Free	$0
DeepL API	Free	$0
GitHub	Free	$0
有料化の目安
Supabase Pro ($25/月): DB 500MB超過時
DeepL Pro (€4.99/月): 月50万文字超過時
予想: 月5万PV達成時(約6ヶ月後)
🔧 開発環境
ローカル環境
OS: Windows
Node.js: v20.11.0
npm: 10.2.4
Git: 2.43.0
エディタ: VS Code
リモート環境
GitHub: github.com/[username]/backpacker-spots
Supabase: afimbo's Project (Singapore)
ブラウザ確認: http://localhost:3000
📝 重要なコマンド集
開発サーバー
bash
npm run dev          # 開発サーバー起動
Git操作
bash
git add .            # 全変更をステージング
git commit -m "..."  # コミット
git push             # GitHubにプッシュ
Supabase操作
sql
-- データ確認
SELECT * FROM spots;

-- ポリシー確認
SELECT * FROM pg_policies WHERE tablename = 'spots';

-- テーブル構造確認
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'spots';
🎓 学んだベストプラクティス
1. コミットメッセージ
✅ 良い例:
"Day 2完了: データベース構築・データ表示機能実装"

❌ 悪い例:
"update"
2. 環境変数の管理
✅ .env.local に保存(Gitignoreされる)
❌ コードに直接書く(危険!)
3. データベース設計
✅ Primary Key は uuid で自動生成
✅ Foreign Key で関連付け
✅ JSONB で多言語対応
4. RLSポリシー
✅ 必要最小限の権限
✅ public は閲覧のみ
✅ 認証ユーザーのみ編集
🚀 今後の展望
Week 2 (Day 8-14)
記事投稿機能(認証必須)
コメント機能
保存(ブックマーク)機能
検索・フィルター強化
Week 3 (Day 15-21)
UI/UX改善
パフォーマンス最適化
SEO対策
MVP完成・公開!
Phase 2 (Week 4以降)
画像アップロード
AIプランニング機能
地図表示
多言語展開(5言語)
📞 サポート・リソース
公式ドキュメント
Next.js: https://nextjs.org/docs
Supabase: https://supabase.com/docs
Tailwind CSS: https://tailwindcss.com/docs
よくある質問
Q: データが表示されない A: RLSポリシーを確認、開発サーバー再起動

Q: エラーが出た A: エラーメッセージをそのままClaudeに送る

Q: 環境変数が読み込まれない A: 開発サーバーを再起動(Ctrl+C → npm run dev)

✨ まとめ
2日間で完全に動作するデータベース駆動Webアプリを構築しました!

主な成果:

🗄️ 3テーブルのリレーショナルDB設計
🔐 セキュリティ設定(RLS)
🌐 データのブラウザ表示
📱 モバイル対応デザイン
🚀 GitHubでバージョン管理
次回: 記事詳細ページとUI改善で、より実用的なサイトに!

作成日: 2025年12月21日 最終更新: Day 2完了時点 プロジェクト進捗: 30% (MVP基準)