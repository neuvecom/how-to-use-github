---
title: "GitHub Pages"
---

# GitHub Pages

この章では、GitHub Pagesを使った静的サイトのホスティングとカスタムドメインの設定について学びます。

## GitHub Pagesとは

**GitHub Pages**は、GitHubリポジトリから直接静的ウェブサイトをホスティングできる無料サービスです。

### 特徴

| 特徴 | 説明 |
|------|------|
| **無料** | パブリックリポジトリは無料 |
| **HTTPS** | 自動でHTTPS対応 |
| **CDN** | 高速な配信 |
| **カスタムドメイン** | 独自ドメイン対応 |
| **Jekyll統合** | Markdownからサイト生成 |

### 用途

- プロジェクトのドキュメント
- 個人ブログ・ポートフォリオ
- 技術書・チュートリアル
- ランディングページ
- オープンソースプロジェクトのサイト

## 基本的な設定

### 有効化

Settings → Pages:

```yaml
Source:
  ☐ Deploy from a branch（ブランチから）
  ☑ GitHub Actions（カスタムビルド）

Branch: main
Folder: / (root) または /docs
```

### ディレクトリ構造（ブランチからデプロイ）

```
my-repo/
├── docs/            # GitHub Pagesのルート
│   ├── index.html
│   ├── about.html
│   └── assets/
│       ├── css/
│       └── images/
├── src/             # ソースコード
└── README.md
```

### 最小構成

```html
<!-- docs/index.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
</head>
<body>
  <h1>Welcome to My Project</h1>
  <p>This is a GitHub Pages site.</p>
</body>
</html>
```

## GitHub Actionsでのデプロイ

### 静的サイトジェネレーターの使用

```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### フレームワーク別の設定

#### Next.js（Static Export）

```yaml
# next.config.js
const nextConfig = {
  output: 'export',
  basePath: '/repo-name',  # リポジトリ名
  images: {
    unoptimized: true
  }
}
```

```yaml
# ワークフロー
- name: Build
  run: npm run build
  env:
    NEXT_PUBLIC_BASE_PATH: /repo-name
```

#### Vite / React

```javascript
// vite.config.js
export default defineConfig({
  base: '/repo-name/',
  build: {
    outDir: 'dist'
  }
})
```

#### VuePress / VitePress

```javascript
// .vitepress/config.js
export default {
  base: '/repo-name/',
  title: 'My Documentation',
  description: 'Project documentation'
}
```

## Jekyll（組み込みサポート）

### Jekyll の利点

```yaml
特徴:
- GitHub Pages にネイティブ対応
- ビルド不要（自動）
- Markdown で執筆可能
- テーマが豊富
```

### 基本構成

```
my-site/
├── _config.yml
├── _posts/
│   └── 2024-01-01-first-post.md
├── _layouts/
│   └── default.html
├── index.md
└── about.md
```

### 設定ファイル

```yaml
# _config.yml
title: My Blog
description: A technical blog
baseurl: "/repo-name"
url: "https://username.github.io"

theme: minima

plugins:
  - jekyll-feed
  - jekyll-seo-tag
```

### 記事の書き方

```markdown
---
layout: post
title: "はじめての投稿"
date: 2024-01-01 12:00:00 +0900
categories: blog
---

# はじめての投稿

これは最初のブログ記事です。

## 見出し

本文を書きます。

```code
コードブロックも使えます
```
```

## カスタムドメイン

### 設定手順

1. DNS設定（ドメイン管理画面）:

```yaml
# Aレコード（apex domain: example.com）
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

# CNAMEレコード（www.example.com）
username.github.io
```

2. GitHubでの設定:

```yaml
Settings → Pages → Custom domain:
  example.com

☑ Enforce HTTPS（推奨）
```

3. CNAMEファイルの作成:

```
# docs/CNAME または リポジトリルートに
example.com
```

### DNS検証

```bash
# Aレコードの確認
dig example.com +short

# CNAMEの確認
dig www.example.com +short

# HTTPS証明書の確認（設定後しばらく待つ）
curl -I https://example.com
```

### サブドメインの設定

```yaml
# docs.example.com の場合
CNAME: username.github.io

# Settings → Pages
Custom domain: docs.example.com
```

## 高度な設定

### 404ページ

```html
<!-- 404.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Page Not Found</title>
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p><a href="/">ホームに戻る</a></p>
</body>
</html>
```

### SPAのルーティング対応

```html
<!-- 404.html でリダイレクト -->
<!DOCTYPE html>
<html>
<head>
  <script>
    // パスをクエリパラメータに変換してリダイレクト
    const path = window.location.pathname;
    window.location.href = '/?path=' + encodeURIComponent(path);
  </script>
</head>
</html>
```

```javascript
// index.html で復元
const params = new URLSearchParams(window.location.search);
const path = params.get('path');
if (path) {
  window.history.replaceState(null, '', path);
}
```

### リダイレクト設定

```html
<!-- old-page.html -->
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=/new-page">
  <link rel="canonical" href="/new-page">
</head>
<body>
  <p>Redirecting to <a href="/new-page">new page</a>...</p>
</body>
</html>
```

## 制限事項

### サイズ制限

| 項目 | 制限 |
|------|------|
| リポジトリサイズ | 1GB推奨 |
| サイトサイズ | 1GB |
| 帯域幅 | 100GB/月（ソフトリミット） |
| ビルド時間 | 10分 |

### 禁止事項

```yaml
禁止されている用途:
- 商用サービスの運営
- パスワード保護されたコンテンツ
- 動的なサーバーサイド処理
- データベースの使用
```

---

## 中級者向けTips

### 複数環境のデプロイ

```yaml
# .github/workflows/pages.yml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set environment
        id: env
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "url=https://example.com" >> $GITHUB_OUTPUT
          else
            echo "url=https://staging.example.com" >> $GITHUB_OUTPUT
          fi

      - name: Build
        run: npm run build
        env:
          BASE_URL: ${{ steps.env.outputs.url }}
```

### Cloudflare Pages との比較

```yaml
GitHub Pages:
  ✅ 無料
  ✅ 簡単設定
  ❌ ビルド時間制限
  ❌ 高度なリダイレクト不可

Cloudflare Pages:
  ✅ 無料（無制限帯域幅）
  ✅ 高速なビルド
  ✅ 高度な設定
  ✅ Edgeでの関数実行
  ❌ GitHubとは別サービス
```

### パフォーマンス最適化

```yaml
# 画像の最適化
- WebP形式を使用
- 適切なサイズに圧縮
- lazy loading を設定

# キャッシュ設定（_headers ファイル - Cloudflareの場合）
/*
  Cache-Control: public, max-age=31536000, immutable

# ファイルサイズの削減
- CSSの圧縮
- JavaScriptのminify
- 不要な依存関係の削除
```

### アクセス解析の追加

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXX');
</script>
```

---

## まとめ

| 項目 | 内容 |
|------|------|
| 料金 | 無料（パブリック） |
| HTTPS | 自動 |
| カスタムドメイン | 対応 |
| ビルド | Jekyll自動 / Actions |

### GitHub Pagesのベストプラクティス

1. **GitHub Actionsを使用**: 柔軟なビルド設定
2. **カスタムドメイン**: ブランディングの向上
3. **HTTPS強制**: セキュリティ確保
4. **404ページ**: ユーザー体験の向上
5. **パフォーマンス最適化**: 画像圧縮、CDN活用

### 用途別推奨設定

```yaml
ドキュメントサイト:
  ツール: VitePress / Docusaurus
  デプロイ: GitHub Actions

個人ブログ:
  ツール: Jekyll / Hugo
  デプロイ: ブランチから直接

プロジェクトランディングページ:
  ツール: 静的HTML / React
  デプロイ: GitHub Actions
```

次の章では、GitHub Packagesについて学びます。
