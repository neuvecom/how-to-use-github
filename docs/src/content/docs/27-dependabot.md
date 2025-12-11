---
title: "Dependabot"
---

この章では、依存関係の脆弱性検出と自動更新を行うDependabotについて学びます。

## Dependabotとは

**Dependabot**は、GitHubが提供する依存関係管理ツールです。セキュリティ脆弱性の検出と、パッケージの自動更新を行います。

### 主な機能

| 機能 | 説明 |
|------|------|
| **Dependabot alerts** | 脆弱性のあるパッケージを検出・通知 |
| **Dependabot security updates** | 脆弱性を修正するPRを自動作成 |
| **Dependabot version updates** | 最新バージョンへの更新PRを自動作成 |

## Dependabot Alerts

### 有効化

Settings → Security → Code security and analysis:

```
✅ Dependency graph（依存関係グラフ）
✅ Dependabot alerts（脆弱性アラート）
```

### アラートの確認

Security → Dependabot alerts で確認できます：

```
┌─────────────────────────────────────────┐
│ Critical (2)                            │
├─────────────────────────────────────────┤
│ ⚠️ lodash < 4.17.21                     │
│   Prototype Pollution                   │
│   GHSA-xxxx-xxxx-xxxx                   │
│   Severity: Critical                    │
│   Path: package.json > lodash           │
├─────────────────────────────────────────┤
│ ⚠️ axios < 1.6.0                        │
│   Server-Side Request Forgery           │
│   Severity: High                        │
└─────────────────────────────────────────┘
```

### アラートへの対応

1. **Dismiss**: 誤検知や対応不要の場合
2. **Create security update**: 修正PRを作成
3. **手動で修正**: 互換性問題がある場合

## Dependabot Security Updates

### 有効化

Settings → Security → Code security and analysis:

```
✅ Dependabot security updates
```

### 動作

脆弱性が検出されると、自動でPRが作成されます：

```
PR: Bump lodash from 4.17.19 to 4.17.21

This PR fixes a security vulnerability:
- GHSA-xxxx-xxxx-xxxx (Critical)
- Prototype Pollution in lodash

Changes:
- package.json: lodash 4.17.19 → 4.17.21
- package-lock.json: updated
```

## Dependabot Version Updates

### 設定ファイルの作成

```yaml
# .github/dependabot.yml
version: 2
updates:
  # npm パッケージ
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Tokyo"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 主要な設定項目

| 項目 | 説明 | 例 |
|------|------|-----|
| `package-ecosystem` | パッケージマネージャー | npm, pip, docker, etc. |
| `directory` | 設定ファイルの場所 | "/" |
| `schedule.interval` | 更新頻度 | daily, weekly, monthly |
| `open-pull-requests-limit` | 同時PRの上限 | 5（デフォルト） |

### 対応パッケージエコシステム

```yaml
# 各種パッケージマネージャー
package-ecosystem:
  - npm           # Node.js
  - pip           # Python
  - maven         # Java
  - gradle        # Java/Kotlin
  - nuget         # .NET
  - composer      # PHP
  - bundler       # Ruby
  - cargo         # Rust
  - gomod         # Go
  - docker        # Dockerfile
  - github-actions # GitHub Actions
  - terraform     # Terraform
```

## 詳細な設定例

### フル設定例

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Tokyo"

    # PR の上限
    open-pull-requests-limit: 10

    # ラベル
    labels:
      - "dependencies"
      - "automerge"

    # レビュアー
    reviewers:
      - "team-lead"
      - "security-team"

    # アサイン
    assignees:
      - "dependabot-handler"

    # コミットメッセージ
    commit-message:
      prefix: "deps"
      prefix-development: "deps-dev"
      include: "scope"

    # 更新タイプの制限
    versioning-strategy: increase

    # 無視するパッケージ
    ignore:
      - dependency-name: "lodash"
        versions: [">=5.0.0"]
      - dependency-name: "aws-sdk"
        update-types: ["version-update:semver-major"]
```

### モノレポ対応

```yaml
version: 2
updates:
  # ルートの依存関係
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"

  # パッケージA
  - package-ecosystem: "npm"
    directory: "/packages/frontend"
    schedule:
      interval: "weekly"
    labels:
      - "frontend"

  # パッケージB
  - package-ecosystem: "npm"
    directory: "/packages/backend"
    schedule:
      interval: "weekly"
    labels:
      - "backend"
```

### グループ化

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      # 開発依存関係をグループ化
      development-dependencies:
        dependency-type: "development"
        update-types:
          - "minor"
          - "patch"

      # 特定のパッケージをグループ化
      react:
        patterns:
          - "react*"
          - "@types/react*"

      # ESLint関連
      eslint:
        patterns:
          - "eslint*"
          - "@typescript-eslint/*"
```

## 自動マージの設定

### GitHub Actionsとの連携

```yaml
# .github/workflows/dependabot-automerge.yml
name: Dependabot Auto-merge

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: write
  pull-requests: write

jobs:
  automerge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v2
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"

      # パッチ・マイナーアップデートのみ自動マージ
      - name: Auto-merge minor and patch updates
        if: |
          steps.metadata.outputs.update-type == 'version-update:semver-minor' ||
          steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 条件付き自動マージ

```yaml
- name: Auto-merge safe updates
  if: |
    (
      steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
      (
        steps.metadata.outputs.update-type == 'version-update:semver-minor' &&
        steps.metadata.outputs.dependency-type == 'direct:development'
      )
    )
  run: gh pr merge --auto --squash "$PR_URL"
```

## セキュリティ更新の優先度

### 重要度の判断

| 重要度 | 対応目安 | 例 |
|--------|----------|-----|
| Critical | 即時 | リモートコード実行 |
| High | 24時間以内 | 認証バイパス |
| Medium | 1週間以内 | XSS |
| Low | 次回更新時 | 情報漏洩（限定的） |

### 重要度別の通知設定

Settings → Notifications → Dependabot alerts:

```
✅ Critical vulnerabilities
✅ High severity vulnerabilities
✅ Medium severity vulnerabilities
☐ Low severity vulnerabilities
```

---

## 中級者向けTips

### プライベートレジストリ

```yaml
version: 2
registries:
  npm-private:
    type: npm-registry
    url: https://npm.example.com
    token: ${{ secrets.NPM_TOKEN }}

updates:
  - package-ecosystem: "npm"
    directory: "/"
    registries:
      - npm-private
    schedule:
      interval: "weekly"
```

### セキュリティアップデートのみ

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    # セキュリティ更新以外は無視
    open-pull-requests-limit: 0
```

:::note
`open-pull-requests-limit: 0` に設定すると、バージョン更新PRは作成されず、セキュリティ更新のみが作成されます。
:::

### 更新の一時停止

```yaml
ignore:
  # 特定バージョン以上は更新しない
  - dependency-name: "node"
    versions: [">=20.0.0"]

  # メジャーアップデートを無視
  - dependency-name: "*"
    update-types: ["version-update:semver-major"]
```

### Slack通知

```yaml
# .github/workflows/dependabot-notify.yml
name: Notify Dependabot Updates

on:
  pull_request:
    types: [opened]

jobs:
  notify:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🔄 Dependabot PR: ${{ github.event.pull_request.title }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*<${{ github.event.pull_request.html_url }}|${{ github.event.pull_request.title }}>*"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## まとめ

| 機能 | 用途 | 自動化 |
|------|------|--------|
| Alerts | 脆弱性検出 | 検出のみ |
| Security Updates | 脆弱性修正PR | PR自動作成 |
| Version Updates | 最新版更新PR | PR自動作成 |

### Dependabotのベストプラクティス

1. **全機能を有効化**: Alerts + Security + Version Updates
2. **週次更新**: `interval: "weekly"` で負担軽減
3. **グループ化**: 関連パッケージをまとめて更新
4. **自動マージ**: パッチ/マイナーは自動化
5. **重要度別対応**: Critical/Highは即時対応
6. **CI連携**: テスト通過を条件にマージ

### 推奨設定

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Tokyo"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
    groups:
      minor-and-patch:
        update-types:
          - "minor"
          - "patch"
```

次の章では、Code ScanningとSecret Scanningについて学びます。
