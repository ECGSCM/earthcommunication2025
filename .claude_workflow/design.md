# 設計書：施工事例サイトのNetlifyデプロイ

## 1. デプロイ方式の選択

### 採用方式：Netlify CLI（コマンドライン）

**選定理由**：
- ✅ Netlify CLIが既にインストール済み（`/usr/local/bin/netlify`）
- ✅ 最も迅速にデプロイ可能
- ✅ ローカルでビルド検証済み（1.21秒で成功）
- ✅ 画像ファイルが正しくdist/imagesにコピー確認済み（全18枚）
- ✅ コマンドラインで完全制御可能

**不採用方式**：
- **Git連携**: リポジトリ作成・プッシュなど追加手順が必要
- **ドラッグ&ドロップ**: ブラウザ操作が必要、自動化不可

## 2. アーキテクチャ設計

### ビルド構成
```
web_app/
├── src/                    # ソースコード
│   ├── App.jsx            # メインアプリケーション
│   ├── components/        # Reactコンポーネント
│   └── data/cases.js      # 施工事例データ（18件）
├── public/
│   └── images/            # 施工事例画像（18枚、44MB）
├── dist/                  # ビルド出力（デプロイ対象）
│   ├── index.html
│   ├── assets/            # JS/CSSバンドル
│   └── images/            # コピーされた画像
├── netlify.toml           # Netlify設定
└── package.json
```

### デプロイフロー
```
1. ローカルビルド（npm run build）
   ↓
2. dist/ディレクトリ生成
   ↓
3. Netlify CLIでデプロイ
   ↓
4. Netlifyサーバーへアップロード
   ↓
5. 公開URLの取得
```

## 3. 実施手順の詳細設計

### Phase 1: 事前確認
```bash
# 1.1 現在のディレクトリ確認
cd /Users/cou/earthcommunication_施工事例/web_app

# 1.2 依存関係の確認
npm list --depth=0

# 1.3 既存ビルドのクリーンアップ
rm -rf dist
```

### Phase 2: プロダクションビルド
```bash
# 2.1 プロダクションビルド実行
npm run build

# 2.2 ビルド結果の検証
ls -lh dist/
ls -lh dist/images/

# 2.3 ビルドサイズの確認
du -sh dist/
```

**期待される結果**：
- `dist/index.html`: 約1KB
- `dist/assets/index-*.css`: 約7KB
- `dist/assets/index-*.js`: 約315KB
- `dist/images/`: 18ファイル、合計44MB
- 合計サイズ: 約44.3MB

### Phase 3: Netlifyデプロイ
```bash
# 3.1 Netlifyにログイン（初回のみ）
netlify login

# 3.2 デプロイ実行（新規サイト作成）
netlify deploy --prod --dir=dist

# または、ドラフトデプロイで事前確認
netlify deploy --dir=dist
```

**デプロイオプション**：
- `--prod`: 本番環境へ直接デプロイ
- `--dir=dist`: デプロイするディレクトリを指定
- サイト名はNetlifyが自動生成（例: `random-name-123.netlify.app`）

### Phase 4: デプロイ後の検証
```bash
# 4.1 デプロイされたURLを開く
# （Netlify CLIが表示するURLをブラウザで開く）

# 4.2 サイトの動作確認
```

**検証項目チェックリスト**：
- [ ] サイトが正常に表示される
- [ ] 全18件の施工事例が表示される
- [ ] 画像が正しく読み込まれる
- [ ] カテゴリーフィルタが機能する
- [ ] 画像モーダル（拡大表示）が機能する
- [ ] レスポンシブデザインが機能する（モバイル表示確認）
- [ ] ページタイトルとメタデータが正しい
- [ ] ブラウザコンソールにエラーがない

## 4. Netlify設定の活用

### netlify.tomlの設定内容（既存）
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**設定の効果**：
- ✅ SPAルーティング対応（すべてのパスをindex.htmlへ）
- ✅ セキュリティヘッダー自動付与
- ✅ 静的アセットの長期キャッシュ（1年）
- ✅ 画像の長期キャッシュ（1年）

## 5. 想定される問題と対策

### 問題1: Netlifyログインエラー
**症状**: `netlify login`が失敗する  
**原因**: ブラウザ認証の問題、ネットワーク制限  
**対策**:
1. 手動でNetlifyアカウント作成
2. アクセストークンを使用した認証
3. 環境変数`NETLIFY_AUTH_TOKEN`の設定

### 問題2: デプロイサイズ制限
**症状**: アップロードが遅い、タイムアウト  
**原因**: 画像サイズが大きい（44MB）  
**対策**:
- Netlify無料プランは125MBまでOK（現在44MBで余裕）
- 将来的には画像最適化を検討（WebP形式など）

### 問題3: 画像が表示されない
**症状**: デプロイ後に画像が404エラー  
**原因**: パス設定の問題、ビルド時のコピーミス  
**対策**:
1. ビルド前に`dist/images/`の確認
2. `public/`ディレクトリからのコピーを確認
3. ブラウザのDevToolsでパスを確認

### 問題4: React Router（SPA）のルーティング問題
**症状**: リロード時に404エラー  
**原因**: サーバー側のリダイレクト設定不足  
**対策**:
- `netlify.toml`の`[[redirects]]`設定で対応済み
- すべてのリクエストが`index.html`へリダイレクト

## 6. パフォーマンス最適化設計

### 現在の最適化（実装済み）
- ✅ Viteによるコード分割
- ✅ CSS/JSの最小化
- ✅ Gzip圧縮（Viteビルド時）
- ✅ 静的アセットのキャッシュヘッダー

### 将来的な最適化案
- 画像の遅延読み込み（実装済みか確認必要）
- 画像のWebP形式への変換
- CDN配信の活用（Netlifyデフォルトで有効）

## 7. セキュリティ設計

### 実装済みセキュリティ対策
- ✅ X-Frame-Options: DENY（クリックジャッキング防止）
- ✅ X-XSS-Protection: 1; mode=block（XSS防止）
- ✅ X-Content-Type-Options: nosniff（MIMEスニッフィング防止）
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### 追加推奨事項
- Content-Security-Policy（将来的に検討）
- HTTPS自動適用（Netlifyデフォルト）

## 8. カスタムドメイン設定（オプション）

### 将来的な設定手順
1. Netlifyダッシュボードでドメイン設定
2. DNSレコードの更新
3. SSL証明書の自動発行（Let's Encrypt）

**現時点では不要**：まず自動生成URLで動作確認

## 9. CI/CD設計（将来的な拡張）

### Git連携への移行案
1. GitHubリポジトリ作成
2. Netlifyとリポジトリを連携
3. mainブランチへのpush時に自動デプロイ

**メリット**：
- バージョン管理
- 自動デプロイ
- プレビューデプロイ（PRごと）

**現時点では不要**：まず手動デプロイで動作確認

## 10. ロールバック計画

### デプロイ失敗時の対処
1. Netlifyダッシュボードで過去のデプロイを確認
2. 前回の成功デプロイにロールバック
3. または、再度ローカルビルド→デプロイ

### バックアップ戦略
- `dist/`ディレクトリの保持（再デプロイ可能）
- ソースコードのバックアップ（Git推奨）

## 11. モニタリング・運用設計

### Netlify標準機能
- アクセス解析（基本）
- デプロイログ
- エラーログ
- 帯域幅使用量

### 推奨モニタリング
- Google Analytics（オプション）
- Netlify Analytics（有料、詳細分析）

## 12. 成功判定基準

### デプロイ成功の判定
- ✅ `netlify deploy`コマンドが成功
- ✅ デプロイURLが発行される
- ✅ HTTPステータス200でアクセス可能

### サイト機能の判定
- ✅ 全18件の事例が表示
- ✅ 全18枚の画像が読み込まれる
- ✅ フィルタリング機能が動作
- ✅ モーダル機能が動作
- ✅ レスポンシブ表示が正常

---

**作成日時**: 2025-11-27  
**ステータス**: 完了  
**次のステップ**: タスク化フェーズへ進む
