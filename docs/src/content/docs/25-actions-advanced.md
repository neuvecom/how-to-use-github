---
title: "GitHub Actions応用"
quiz:
  - question: "マトリックスビルドの主な用途は何ですか？"
    options:
      - "ファイルを圧縮する"
      - "複数の環境（OS、言語バージョン等）で並列テストする"
      - "データベースを作成する"
      - "メールを送信する"
    answer: 1
  - question: "GitHub Actionsでシークレットを参照する正しい構文はどれですか？"
    options:
      - "$SECRET_NAME"
      - "secrets.SECRET_NAME"
      - "${{ secrets.SECRET_NAME }}"
      - "env.SECRET_NAME"
    answer: 2
  - question: "ワークフローのキャッシュを使用する主なメリットは何ですか？"
    options:
      - "セキュリティの向上"
      - "依存関係のインストール時間を短縮"
      - "コードの品質向上"
      - "ログの削減"
    answer: 1
---

この章では、マトリックスビルド、シークレット、キャッシュ、再利用可能ワークフローなど、応用的な機能を学びます。

## マトリックスビルド

### 基本的なマトリックス

複数の組み合わせでテストを並列実行:

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

この例では 3 × 3 = 9 ジョブが並列実行されます。

### include / exclude

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    include:
      # 特定の組み合わせを追加
      - os: ubuntu-latest
        node: 22
        experimental: true
    exclude:
      # 特定の組み合わせを除外
      - os: windows-latest
        node: 18
```

### fail-fast

```yaml
strategy:
  fail-fast: false  # 1つ失敗しても他を続行
  matrix:
    os: [ubuntu-latest, macos-latest]
```

## シークレットとシークレット管理

### シークレットの種類

| 種類 | スコープ | 設定場所 |
|------|----------|----------|
| Repository secrets | リポジトリ | Settings → Secrets |
| Environment secrets | 環境 | Settings → Environments |
| Organization secrets | Organization | Org Settings → Secrets |

### 使用方法

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    run: ./deploy.sh
```

### GITHUB_TOKEN

自動で提供されるトークン:

```yaml
steps:
  - name: Create Release
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    run: gh release create v1.0.0

  # または permissions で制御
permissions:
  contents: write
  pull-requests: write
```

### シークレットの注意点

```yaml
# NG: ログに出力される可能性
- run: echo ${{ secrets.API_KEY }}

# OK: マスクされる
- run: ./script.sh
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

## キャッシュ

### 基本的なキャッシュ

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      npm-${{ runner.os }}-
```

### 言語別のキャッシュ設定

```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'

# Go
- uses: actions/setup-go@v5
  with:
    go-version: '1.21'
    cache: true
```

### カスタムキャッシュ

```yaml
- name: Cache build
  uses: actions/cache@v4
  with:
    path: |
      ~/.cache
      node_modules
      .next/cache
    key: build-${{ runner.os }}-${{ hashFiles('**/*.lock') }}
    restore-keys: |
      build-${{ runner.os }}-
```

## アーティファクト

### アップロード

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: |
      dist/
      !dist/**/*.map
    retention-days: 7
```

### ダウンロード

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - run: ./deploy.sh
```

## 再利用可能ワークフロー

### 呼び出される側

```yaml
# .github/workflows/reusable-build.yml
name: Reusable Build

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '20'
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci
      - run: npm run build
```

### 呼び出す側

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: '20'
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 他リポジトリのワークフローを使用

```yaml
jobs:
  build:
    uses: org/repo/.github/workflows/build.yml@main
    with:
      environment: production
```

## 複合アクション（Composite Actions）

### 作成

```yaml
# .github/actions/setup-project/action.yml
name: 'Setup Project'
description: 'Setup Node.js and install dependencies'
inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'
runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
    - run: npm ci
      shell: bash
    - run: npm run build
      shell: bash
```

### 使用

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-project
    with:
      node-version: '20'
```

## 依存ジョブ（needs）

### 順次実行

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### 並列 + 依存

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    runs-on: ubuntu-latest
    steps: [...]

  build:
    needs: [lint, test]  # 両方完了後に実行
    runs-on: ubuntu-latest
    steps: [...]
```

### ジョブ間のデータ受け渡し

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.value }}
    steps:
      - id: version
        run: echo "value=$(cat version.txt)" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying version ${{ needs.build.outputs.version }}"
```

---

## 中級者向けTips

### 条件付き実行

```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

### タイムアウト設定

```yaml
jobs:
  build:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - name: Long running task
        timeout-minutes: 10
        run: ./long-task.sh
```

### 並列度の制御

```yaml
jobs:
  deploy:
    concurrency:
      group: production
      cancel-in-progress: false
    runs-on: ubuntu-latest
```

### サービスコンテナ

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
      redis:
        image: redis
        ports:
          - 6379:6379
    steps:
      - run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432
```

---

## まとめ

| 機能 | 用途 |
|------|------|
| マトリックス | 複数環境での並列テスト |
| キャッシュ | ビルド時間の短縮 |
| アーティファクト | ジョブ間のファイル共有 |
| 再利用可能WF | ワークフローの共通化 |
| 複合アクション | ステップの共通化 |

次の章では、CI/CDパイプラインについて学びます。
