---
title: "WebUIからのデプロイ"
---

この章では、GitHub の Web UI からデプロイを実行する方法を学びます。GitHub Actions を活用して、ブラウザから本番環境へのデプロイが可能です。

## workflow_dispatch（手動実行）

### workflow_dispatchとは

GitHub Actions ワークフローを Web UI から手動で実行できるトリガーです。

### 設定方法

ワークフローファイルに `workflow_dispatch` を追加：

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  workflow_dispatch:  # 手動実行を有効化

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: echo "Deploying..."
```

### 実行方法

1. リポジトリの「Actions」タブ
2. 左側のワークフロー一覧から該当ワークフローを選択
3. 「Run workflow」ボタンをクリック
4. ブランチを選択
5. 「Run workflow」で実行

### 入力パラメータの追加

デプロイ時にパラメータを指定できます：

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'デプロイ先環境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      version:
        description: 'デプロイするバージョン'
        required: false
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ${{ github.event.inputs.environment }}
        run: |
          echo "Environment: ${{ github.event.inputs.environment }}"
          echo "Version: ${{ github.event.inputs.version }}"
```

### 入力タイプ

| タイプ | 説明 |
|--------|------|
| `string` | 自由入力テキスト |
| `choice` | ドロップダウン選択 |
| `boolean` | チェックボックス |
| `environment` | 環境を選択 |

## Releasesからのデプロイ

### リリーストリガーの設定

リリースを作成したときにデプロイを実行：

```yaml
# .github/workflows/release-deploy.yml
name: Release Deploy

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Get release info
        run: |
          echo "Tag: ${{ github.event.release.tag_name }}"
          echo "Name: ${{ github.event.release.name }}"

      - name: Deploy to production
        run: |
          # デプロイコマンド
          echo "Deploying version ${{ github.event.release.tag_name }}"
```

### リリースの作成手順

1. リポジトリの「Releases」（右側サイドバー）
2. 「Draft a new release」
3. タグを選択または新規作成
4. リリースタイトルと説明を入力
5. 「Publish release」→ デプロイが自動実行

### プレリリース

本番デプロイ前のテスト用：

```yaml
on:
  release:
    types: [published]

jobs:
  deploy-staging:
    if: github.event.release.prerelease
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: echo "Deploying to staging"

  deploy-production:
    if: ${{ !github.event.release.prerelease }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploying to production"
```

## Environments（環境）と承認フロー

### Environmentsとは

デプロイ先の環境を定義し、保護ルールや承認フローを設定できます。

### 環境の作成

1. Settings → Environments
2. 「New environment」
3. 環境名を入力（例: `production`, `staging`）
4. 「Configure environment」

### 環境の保護ルール

| ルール | 説明 |
|--------|------|
| **Required reviewers** | 指定したユーザーの承認が必要 |
| **Wait timer** | 指定時間待機してからデプロイ |
| **Deployment branches** | 特定ブランチからのみデプロイ可能 |

### 承認フローの設定

1. 環境の設定ページ
2. 「Required reviewers」にチェック
3. 承認者を追加（最大6人）
4. 「Save protection rules」

### ワークフローでの使用

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Deploy
        run: echo "Deploying to production"
```

### 承認の実行

1. ワークフローが承認待ち状態になる
2. 承認者に通知が届く
3. Actions タブで「Review pending deployments」
4. 環境を選択して「Approve and deploy」

## デプロイ状況の確認

### Actionsタブ

1. 「Actions」タブでワークフローの実行状況を確認
2. 各ジョブの詳細ログを表示
3. 失敗した場合はエラー内容を確認

### Deploymentsページ

1. リポジトリのメインページ右側「Deployments」
2. 環境ごとのデプロイ履歴
3. 各デプロイの状態とログへのリンク

### ステータスバッジ

READMEにデプロイ状況を表示：

```markdown
![Deploy](https://github.com/user/repo/actions/workflows/deploy.yml/badge.svg)
```

## 実践的なデプロイワークフロー

### ステージング→本番の段階デプロイ

```yaml
name: Deploy Pipeline

on:
  workflow_dispatch:
    inputs:
      skip_staging:
        description: 'Skip staging deployment'
        type: boolean
        default: false

jobs:
  deploy-staging:
    if: ${{ !inputs.skip_staging }}
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to staging
        run: echo "Deploying to staging"

  deploy-production:
    needs: deploy-staging
    if: ${{ always() && (needs.deploy-staging.result == 'success' || inputs.skip_staging) }}
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: echo "Deploying to production"
```

### ロールバック機能

```yaml
name: Deploy with Rollback

on:
  workflow_dispatch:
    inputs:
      action:
        description: 'Action to perform'
        required: true
        type: choice
        options:
          - deploy
          - rollback
      version:
        description: 'Version to deploy/rollback to'
        required: true
        type: string

jobs:
  execute:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy
        if: ${{ inputs.action == 'deploy' }}
        run: echo "Deploying version ${{ inputs.version }}"

      - name: Rollback
        if: ${{ inputs.action == 'rollback' }}
        run: echo "Rolling back to version ${{ inputs.version }}"
```

---

## 中級者向けTips

### 並列デプロイと順次デプロイ

```yaml
jobs:
  # 並列デプロイ
  deploy-region-1:
    runs-on: ubuntu-latest
    environment: region-1
    steps: [...]

  deploy-region-2:
    runs-on: ubuntu-latest
    environment: region-2
    steps: [...]

  # 順次デプロイ（needsで依存関係を指定）
  deploy-primary:
    runs-on: ubuntu-latest
    steps: [...]

  deploy-secondary:
    needs: deploy-primary
    runs-on: ubuntu-latest
    steps: [...]
```

### Slack通知

デプロイ結果をSlackに通知：

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 環境変数とシークレットの使い分け

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy
        env:
          # 環境固有のシークレット
          API_KEY: ${{ secrets.PRODUCTION_API_KEY }}
          # 環境変数（vars.XXX）
          API_URL: ${{ vars.API_URL }}
        run: |
          echo "Deploying to $API_URL"
```

### デプロイゲート（カナリアリリース）

```yaml
jobs:
  deploy-canary:
    runs-on: ubuntu-latest
    environment: canary
    steps:
      - name: Deploy to 10% of traffic
        run: echo "Canary deployment"

  verify-canary:
    needs: deploy-canary
    runs-on: ubuntu-latest
    steps:
      - name: Run smoke tests
        run: echo "Verifying canary"

  deploy-full:
    needs: verify-canary
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to 100% of traffic
        run: echo "Full deployment"
```

---

## まとめ

| 方法 | 用途 |
|------|------|
| workflow_dispatch | 手動でいつでもデプロイ |
| Releases | バージョンタグと連動 |
| Environments | 承認フロー、保護ルール |

### デプロイのベストプラクティス

1. **ステージング環境を用意**: 本番前に必ずテスト
2. **承認フローを設定**: 本番環境は承認必須
3. **ロールバック手段を確保**: 問題発生時に素早く戻せるように
4. **通知を設定**: デプロイ結果をチームに共有
5. **ログを残す**: デプロイ履歴を追跡可能に

次の章では、ブランチ戦略について学びます。
