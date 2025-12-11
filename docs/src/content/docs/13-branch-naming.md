---
title: "ブランチ命名規則"
---

この章では、チーム開発で使われるブランチの命名規則と、Issue/チケット番号との連携方法を学びます。

## なぜ命名規則が必要か

1. **一目で目的がわかる**: ブランチ名から作業内容を推測
2. **検索しやすい**: 目的のブランチを素早く見つけられる
3. **自動化との連携**: CI/CDやツールとの統合
4. **チームの一貫性**: 誰が作っても同じ形式

## 基本的な命名パターン

### プレフィックス方式

```
<種類>/<説明>
```

例：
```
feature/add-user-authentication
bugfix/fix-login-validation
hotfix/security-vulnerability
docs/update-readme
```

### 主なプレフィックス

| プレフィックス | 用途 | 例 |
|----------------|------|-----|
| `feature/` | 新機能 | `feature/shopping-cart` |
| `fix/` / `bugfix/` | バグ修正 | `fix/login-error` |
| `hotfix/` | 緊急修正 | `hotfix/security-patch` |
| `release/` | リリース準備 | `release/v1.2.0` |
| `docs/` | ドキュメント | `docs/api-reference` |
| `refactor/` | リファクタリング | `refactor/user-service` |
| `test/` | テスト追加 | `test/payment-flow` |
| `chore/` | 雑務 | `chore/update-dependencies` |

## チケット番号との連携

### Issue番号を含める

```
<種類>/<Issue番号>-<説明>
```

例：
```
feature/123-add-user-authentication
fix/456-login-validation-error
```

### JIRAチケットとの連携

```
<種類>/<プロジェクト>-<番号>-<説明>
```

例：
```
feature/PROJ-123-add-payment
bugfix/PROJ-456-fix-checkout
```

### 自動リンクの設定

JIRAなどと連携している場合、ブランチ名からチケットが自動リンクされます：

```yaml
# .github/workflows/jira-link.yml
name: Link JIRA

on:
  create:
    branches:
      - 'feature/PROJ-*'
      - 'bugfix/PROJ-*'

jobs:
  link:
    runs-on: ubuntu-latest
    steps:
      - name: Extract ticket number
        run: |
          BRANCH="${{ github.ref_name }}"
          TICKET=$(echo $BRANCH | grep -oP 'PROJ-\d+')
          echo "Linking to JIRA ticket: $TICKET"
```

## 説明部分の書き方

### 良い命名

```bash
# 具体的で簡潔
feature/add-google-oauth-login
fix/prevent-duplicate-orders
refactor/extract-validation-service

# ケバブケース（推奨）
feature/user-profile-page

# アンダースコアも可
feature/user_profile_page
```

### 避けるべき命名

```bash
# NG: 曖昧すぎる
feature/fix
feature/update

# NG: 長すぎる
feature/add-new-user-authentication-flow-with-google-oauth-and-facebook-login

# NG: 日本語（一部環境で問題）
feature/ログイン機能

# NG: スペースや特殊文字
feature/add login
feature/add@login
```

## ブランチ名の自動生成

### GitHub Issue から作成

Issue ページの右側サイドバー「Development」セクションで：
1. 「Create a branch」をクリック
2. 自動でブランチ名が提案される
3. 必要に応じて編集
4. 「Create branch」

生成される形式：
```
<issue番号>-<issueタイトル>
# 例: 123-add-user-authentication
```

### 設定のカスタマイズ

リポジトリ設定で、自動生成のフォーマットをカスタマイズ：

1. Settings → General → Pull Requests
2. 「Automatically delete head branches」の近くで設定

## 命名規則の文書化

### CONTRIBUTING.mdの例

```markdown
# ブランチ命名規則

## 形式

\`\`\`
<種類>/<Issue番号>-<説明>
\`\`\`

## 種類

| プレフィックス | 用途 |
|----------------|------|
| `feature/` | 新機能追加 |
| `fix/` | バグ修正 |
| `hotfix/` | 緊急修正（main直接） |
| `docs/` | ドキュメント更新 |
| `refactor/` | リファクタリング |
| `chore/` | 依存関係更新等 |

## 例

- `feature/123-add-oauth-login`
- `fix/456-prevent-xss-attack`
- `docs/789-update-api-docs`

## 注意事項

- 英小文字とハイフンを使用
- 50文字以内を目安に
- Issue/チケット番号を必ず含める
```

## CI/CDでの活用

### ブランチ名でワークフローを制御

```yaml
name: CI

on:
  push:
    branches:
      - main
      - 'feature/**'
      - 'fix/**'
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test

  deploy-preview:
    if: startsWith(github.head_ref, 'feature/')
    runs-on: ubuntu-latest
    steps:
      - name: Deploy preview
        run: echo "Deploying preview..."
```

### ブランチ名から環境を決定

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Determine environment
        id: env
        run: |
          if [[ "${{ github.ref_name }}" == "main" ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref_name }}" == release/* ]]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
          else
            echo "environment=development" >> $GITHUB_OUTPUT
          fi

      - name: Deploy to ${{ steps.env.outputs.environment }}
        run: echo "Deploying to ${{ steps.env.outputs.environment }}"
```

---

## 中級者向けTips

### pre-commitフックでブランチ名をチェック

```bash
#!/bin/bash
# .git/hooks/pre-commit

branch=$(git rev-parse --abbrev-ref HEAD)
pattern="^(feature|fix|hotfix|docs|refactor|chore)/[0-9]+-[a-z0-9-]+$"

if [[ ! $branch =~ $pattern ]]; then
  echo "Error: Branch name '$branch' does not match pattern."
  echo "Expected: <type>/<issue-number>-<description>"
  exit 1
fi
```

### Huskyでチーム全体に適用

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-push": "scripts/check-branch-name.sh"
    }
  }
}
```

### GitHub Actionsでブランチ名を検証

```yaml
name: Validate Branch Name

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Check branch name
        run: |
          BRANCH="${{ github.head_ref }}"
          PATTERN="^(feature|fix|hotfix|docs|refactor|chore)/[0-9]+-[a-z0-9-]+$"

          if [[ ! $BRANCH =~ $PATTERN ]]; then
            echo "::error::Invalid branch name: $BRANCH"
            echo "Expected format: <type>/<issue-number>-<description>"
            exit 1
          fi
```

### 古いブランチの自動削除

```yaml
name: Cleanup Old Branches

on:
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜日

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Delete stale branches
        run: |
          # 30日以上更新のないfeature/fixブランチを削除
          git fetch --prune
          for branch in $(git branch -r --merged origin/main | grep -E 'origin/(feature|fix)/' | sed 's/origin\///'); do
            last_commit=$(git log -1 --format=%ct origin/$branch)
            now=$(date +%s)
            days=$(( (now - last_commit) / 86400 ))

            if [ $days -gt 30 ]; then
              echo "Deleting $branch (inactive for $days days)"
              git push origin --delete $branch
            fi
          done
```

---

## まとめ

| 項目 | 推奨ルール |
|------|------------|
| 形式 | `<種類>/<Issue番号>-<説明>` |
| 種類 | feature, fix, hotfix, docs, refactor, chore |
| 説明 | ケバブケース、英小文字、50文字以内 |
| Issue連携 | ブランチ名に番号を含める |

### 命名規則のベストプラクティス

1. **シンプルに保つ**: 複雑すぎるルールは守られない
2. **自動化する**: フックやCIで検証
3. **文書化する**: CONTRIBUTING.mdに記載
4. **例外を認める**: hotfixなど緊急時のルール
5. **定期的に見直す**: チームの成長に合わせて調整

次の章では、コミットメッセージ規約について学びます。
