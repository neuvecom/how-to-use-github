---
title: "GitHub Actions基礎"
---

この章では、GitHub Actionsの基本概念、ワークフローの構造、トリガー、ランナーについて学びます。

## GitHub Actionsとは

**GitHub Actions**は、GitHubに組み込まれたCI/CD（継続的インテグレーション/継続的デリバリー）プラットフォームです。

### できること

- 自動テスト
- 自動ビルド
- 自動デプロイ
- コードの自動チェック（lint, format）
- 定期実行タスク
- Issue/PR の自動化

## ワークフローの基本構造

### ファイルの配置

```
.github/
└── workflows/
    ├── ci.yml
    ├── deploy.yml
    └── release.yml
```

### 基本構造

```yaml
# .github/workflows/ci.yml
name: CI  # ワークフロー名

on:  # トリガー
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:  # ジョブ定義
  test:  # ジョブ名
    runs-on: ubuntu-latest  # ランナー

    steps:  # ステップ
      - uses: actions/checkout@v4  # アクション
      - name: Run tests  # ステップ名
        run: npm test  # コマンド
```

### 構成要素

| 要素 | 説明 |
|------|------|
| **Workflow** | 自動化プロセス全体（YAMLファイル） |
| **Event** | ワークフローを起動するトリガー |
| **Job** | 同じランナーで実行されるステップの集合 |
| **Step** | 個々のタスク（コマンドまたはアクション） |
| **Action** | 再利用可能なステップ |
| **Runner** | ジョブを実行するサーバー |

## トリガー（on）

### push / pull_request

```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    paths:
      - 'src/**'
      - '!src/**/*.md'  # 除外

  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

### その他のイベント

```yaml
# スケジュール実行
on:
  schedule:
    - cron: '0 0 * * *'  # 毎日0時（UTC）

# 手動実行
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deploy environment'
        required: true
        default: 'staging'

# リリース
on:
  release:
    types: [published]

# Issue / PR イベント
on:
  issues:
    types: [opened, labeled]
  pull_request_review:
    types: [submitted]
```

### 複数トリガーの組み合わせ

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜
  workflow_dispatch:
```

## ジョブとステップ

### 複数ジョブ

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]  # 依存関係
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
```

### ステップの書き方

```yaml
steps:
  # アクションを使用
  - uses: actions/checkout@v4

  # アクション + 設定
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'

  # コマンドを実行
  - run: npm install

  # 名前付きステップ
  - name: Run tests
    run: npm test

  # 複数行コマンド
  - name: Build and deploy
    run: |
      npm run build
      npm run deploy

  # 環境変数
  - name: With env
    env:
      NODE_ENV: production
    run: npm run build
```

## ランナー

### GitHub-hosted ランナー

GitHubが提供する仮想マシン:

| ラベル | OS |
|--------|-----|
| `ubuntu-latest` | Ubuntu 22.04 |
| `ubuntu-22.04` | Ubuntu 22.04 |
| `ubuntu-20.04` | Ubuntu 20.04 |
| `windows-latest` | Windows Server 2022 |
| `macos-latest` | macOS 14 (Sonoma) |
| `macos-13` | macOS 13 (Ventura) |

### Self-hosted ランナー

自分のサーバーでジョブを実行:

```yaml
jobs:
  build:
    runs-on: self-hosted
    # または
    runs-on: [self-hosted, linux, x64]
```

## マーケットプレイスのアクション

### よく使うアクション

```yaml
# コードのチェックアウト
- uses: actions/checkout@v4

# Node.js のセットアップ
- uses: actions/setup-node@v4
  with:
    node-version: '20'

# Python のセットアップ
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'

# キャッシュ
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ hashFiles('package-lock.json') }}

# アーティファクトのアップロード
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
```

### アクションの指定方法

```yaml
# バージョン指定（推奨）
- uses: actions/checkout@v4

# コミットハッシュ（最も安全）
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11

# ブランチ（非推奨）
- uses: actions/checkout@main

# ローカルアクション
- uses: ./.github/actions/my-action
```

## 環境変数とシークレット

### 環境変数

```yaml
env:
  # ワークフローレベル
  NODE_ENV: production

jobs:
  build:
    env:
      # ジョブレベル
      CI: true
    steps:
      - name: Build
        env:
          # ステップレベル
          API_URL: https://api.example.com
        run: npm run build
```

### シークレット

Settings → Secrets and variables → Actions:

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: ./deploy.sh
```

### デフォルト環境変数

```yaml
- run: |
    echo "Repository: ${{ github.repository }}"
    echo "Branch: ${{ github.ref_name }}"
    echo "SHA: ${{ github.sha }}"
    echo "Actor: ${{ github.actor }}"
    echo "Event: ${{ github.event_name }}"
```

---

## 中級者向けTips

### 条件分岐（if）

```yaml
steps:
  - name: Only on main
    if: github.ref == 'refs/heads/main'
    run: echo "Main branch"

  - name: Only on PR
    if: github.event_name == 'pull_request'
    run: echo "Pull request"

  - name: Skip on failure
    if: success()
    run: echo "Previous step succeeded"

  - name: Always run
    if: always()
    run: echo "This always runs"
```

### マトリックスビルド

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20, 22]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### ワークフローの実行確認

```bash
# 実行一覧
gh run list

# 実行詳細
gh run view 123456

# ログを見る
gh run view 123456 --log

# 再実行
gh run rerun 123456
```

---

## まとめ

| 要素 | 説明 |
|------|------|
| Workflow | YAMLで定義する自動化プロセス |
| Event | ワークフローを起動するトリガー |
| Job | ステップの集合 |
| Step | 個々のタスク |
| Action | 再利用可能な処理 |
| Runner | 実行環境 |

### 最初のワークフロー例

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

次の章では、GitHub Actions応用について学びます。
