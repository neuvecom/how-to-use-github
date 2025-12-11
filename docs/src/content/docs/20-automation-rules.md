---
title: "自動化ルール"
quiz:
  - question: "PRの自動マージ機能を有効にする設定場所はどれですか?"
    options:
      - "Settings → Branches"
      - "Settings → General → Pull Requests"
      - "Settings → Actions"
      - "PRページから直接有効化"
    answer: 1
  - question: "actions/staleツールの主な用途はどれですか?"
    options:
      - "PRを自動マージする"
      - "古いIssue/PRを自動クローズする"
      - "ラベルを自動付与する"
      - "レビュアーを自動アサインする"
    answer: 1
  - question: "Dependabotの自動マージで、一般的に自動マージ対象とするバージョンアップデートはどれですか?"
    options:
      - "MAJOR バージョンアップデートのみ"
      - "MINOR と PATCH バージョンアップデート"
      - "PATCH バージョンアップデートのみ"
      - "すべてのバージョンアップデート"
    answer: 1
---

この章では、GitHub の自動化機能を活用したルール設定について学びます。自動マージ、自動ラベル付け、古いIssue/PRの自動クローズなどを解説します。

## 自動マージ条件の設定

### 自動マージとは

設定した条件（レビュー承認、CIパス等）を満たしたら、自動的にPRをマージする機能です。

### 有効化

1. Settings → General → Pull Requests
2. **Allow auto-merge** にチェック

### 使用方法

PRページで「Enable auto-merge」をクリック：

1. マージ方法を選択（Merge / Squash / Rebase）
2. 「Enable auto-merge」で確定
3. 条件を満たしたら自動マージ

### 自動マージの条件

```
以下の条件をすべて満たすとマージ:
- 必須レビューが承認されている
- 必須ステータスチェックが通っている
- ブランチが最新（設定による）
- コンフリクトがない
```

### GitHub Actions で自動マージ

```yaml
# .github/workflows/auto-merge.yml
name: Auto Merge

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    # dependabotのPRのみ自動マージ
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Enable auto-merge
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 自動ラベル付け

### actions/labeler を使用

```yaml
# .github/workflows/labeler.yml
name: Labeler

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/labeler@v5
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

### ラベル設定ファイル

```yaml
# .github/labeler.yml

# ディレクトリベース
frontend:
  - changed-files:
      - any-glob-to-any-file: 'src/frontend/**'

backend:
  - changed-files:
      - any-glob-to-any-file: 'src/backend/**'

# ファイルタイプベース
documentation:
  - changed-files:
      - any-glob-to-any-file: '**/*.md'

tests:
  - changed-files:
      - any-glob-to-any-file: '**/*.test.{js,ts}'

# 複合条件
api:
  - changed-files:
      - any-glob-to-any-file:
          - 'src/api/**'
          - 'openapi.yaml'

# インフラ
infrastructure:
  - changed-files:
      - any-glob-to-any-file:
          - '.github/**'
          - 'Dockerfile'
          - 'docker-compose*.yml'
          - 'terraform/**'
```

### PRサイズのラベル

```yaml
# .github/workflows/pr-size.yml
name: PR Size

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - name: Label PR size
        uses: codelytv/pr-size-labeler@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          xs_label: 'size/XS'
          xs_max_size: 50
          s_label: 'size/S'
          s_max_size: 200
          m_label: 'size/M'
          m_max_size: 400
          l_label: 'size/L'
          l_max_size: 800
          xl_label: 'size/XL'
          fail_if_xl: false
```

## Stale Issue/PRの自動クローズ

### actions/stale を使用

```yaml
# .github/workflows/stale.yml
name: Stale Issues

on:
  schedule:
    - cron: '0 0 * * *'  # 毎日0時
  workflow_dispatch:  # 手動実行も可能

jobs:
  stale:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
    steps:
      - uses: actions/stale@v9
        with:
          # Issue の設定
          stale-issue-message: |
            このIssueは30日間更新がありません。
            7日以内に更新がない場合、自動的にクローズされます。
          stale-issue-label: 'stale'
          days-before-issue-stale: 30
          days-before-issue-close: 7

          # PR の設定
          stale-pr-message: |
            このPRは14日間更新がありません。
            7日以内に更新がない場合、自動的にクローズされます。
          stale-pr-label: 'stale'
          days-before-pr-stale: 14
          days-before-pr-close: 7

          # 除外設定
          exempt-issue-labels: 'pinned,security,roadmap'
          exempt-pr-labels: 'pinned,wip,dependencies'

          # クローズしない（警告のみ）
          # days-before-issue-close: -1
          # days-before-pr-close: -1
```

### カスタム設定例

```yaml
- uses: actions/stale@v9
  with:
    # バグはより長く保持
    days-before-issue-stale: 60

    # 機能要望は短め
    only-labels: 'enhancement'
    days-before-issue-stale: 30

    # 重要なラベルは除外
    exempt-issue-labels: 'bug,security,critical'

    # Draftは除外
    exempt-draft-pr: true

    # 最近アクティビティがあれば解除
    remove-stale-when-updated: true
```

## Dependabotの自動マージ

### Dependabot設定

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    # パッチ・マイナーアップデートは自動マージ対象
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "automerge"
```

### 自動マージワークフロー

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

      - name: Auto-merge minor and patch updates
        if: |
          steps.metadata.outputs.update-type == 'version-update:semver-minor' ||
          steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 自動アサイン

### レビュアーの自動割り当て

```yaml
# .github/workflows/auto-assign.yml
name: Auto Assign

on:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - name: Auto-assign reviewers
        uses: kentaro-m/auto-assign-action@v1.2.6
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

```yaml
# .github/auto_assign.yml
# 作成者をアサイン
addAssignees: true
assignees:
  - author

# レビュアーを自動割り当て
addReviewers: true
reviewers:
  - reviewer1
  - reviewer2
  - reviewer3

# レビュアー数
numberOfReviewers: 2

# ランダムに選択
reviewers:
  - reviewer1
  - reviewer2
  - reviewer3
  - reviewer4
numberOfReviewers: 2

# チームからランダム
teams:
  - team-slug
numberOfReviewers: 2
```

## Welcome Bot

### 初コントリビューターへの歓迎

```yaml
# .github/workflows/welcome.yml
name: Welcome

on:
  pull_request_target:
    types: [opened]
  issues:
    types: [opened]

jobs:
  welcome:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
    steps:
      - uses: actions/first-interaction@v1
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          issue-message: |
            @${{ github.actor }} Issue の作成ありがとうございます！
            チームがすぐに確認します。

            回答に役立つ情報：
            - 環境情報（OS、バージョン等）
            - 再現手順
            - 期待する動作
          pr-message: |
            @${{ github.actor }} PRの作成ありがとうございます！
            コントリビューションガイドをご確認ください：
            https://github.com/user/repo/blob/main/CONTRIBUTING.md
```

---

## 中級者向けTips

### 複合的な自動化

```yaml
# PR作成時の総合ワークフロー
name: PR Automation

on:
  pull_request:
    types: [opened, synchronize, ready_for_review]

jobs:
  # ラベル付け
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v5

  # サイズラベル
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: codelytv/pr-size-labeler@v1

  # レビュアー割り当て
  assign:
    runs-on: ubuntu-latest
    if: github.event.action == 'ready_for_review'
    steps:
      - uses: kentaro-m/auto-assign-action@v1.2.6

  # Dependabot自動マージ
  dependabot:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Auto-merge
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### スケジュールベースのクリーンアップ

```yaml
name: Weekly Cleanup

on:
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜日

jobs:
  # 古いブランチの削除
  cleanup-branches:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Delete stale branches
        run: |
          git fetch --prune
          # マージ済みで30日以上前のブランチを削除
          for branch in $(git branch -r --merged origin/main | grep -v main); do
            # 削除ロジック
          done

  # 古いアーティファクトの削除
  cleanup-artifacts:
    runs-on: ubuntu-latest
    steps:
      - uses: c-hive/gha-remove-artifacts@v1
        with:
          age: '30 days'
```

---

## まとめ

| 自動化 | ツール | 用途 |
|--------|--------|------|
| 自動マージ | gh pr merge --auto | 条件を満たしたら自動マージ |
| ラベル付け | actions/labeler | ファイルパスでラベル |
| Stale管理 | actions/stale | 古いIssue/PRの管理 |
| Dependabot | dependabot-automerge | 依存関係更新の自動マージ |
| レビュアー | auto-assign-action | 自動割り当て |

### 自動化のベストプラクティス

1. **段階的に導入**: 一度に全部入れない
2. **除外設定を忘れずに**: 重要なIssue/PRは除外
3. **通知を設定**: 自動化の結果を把握
4. **定期的に見直し**: ルールが適切か確認
5. **ドキュメント化**: チームに周知

次の章では、Issuesについて学びます。
