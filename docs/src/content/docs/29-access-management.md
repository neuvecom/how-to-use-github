---
title: "アクセス管理"
quiz:
  - question: "リポジトリの権限レベルで「Write」ができることは何ですか？"
    options:
      - "リポジトリの削除"
      - "コードのプッシュとPRのマージ"
      - "リポジトリ設定の変更"
      - "コラボレーターの追加"
    answer: 1
  - question: "Deploy Keysの特徴として正しいものはどれですか？"
    options:
      - "複数のリポジトリにアクセスできる"
      - "特定のリポジトリ専用のSSHキー"
      - "パスワードの代わりに使用する"
      - "GitHub Actionsでのみ使用可能"
    answer: 1
  - question: "GitHub Appsと個人アクセストークン(PAT)の違いは何ですか？"
    options:
      - "PATは無料、GitHub Appsは有料"
      - "GitHub Appsはより細かい権限制御と監査が可能"
      - "違いはない"
      - "PATの方がセキュリティが高い"
    answer: 1
---

この章では、GitHubの権限レベル、Deploy Keys、GitHub Appsなど、アクセス管理について学びます。

## 権限レベル

### リポジトリの権限

| 権限 | できること |
|------|------------|
| **Read** | コードの閲覧、Issue作成、PR作成 |
| **Triage** | Issue/PRの管理（ラベル、アサイン等） |
| **Write** | プッシュ、ブランチ作成、マージ |
| **Maintain** | リポジトリ設定の一部変更 |
| **Admin** | すべての設定変更、削除 |

### 権限の詳細比較

| 操作 | Read | Triage | Write | Maintain | Admin |
|------|:----:|:------:|:-----:|:--------:|:-----:|
| コード閲覧 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Issue作成 | ✅ | ✅ | ✅ | ✅ | ✅ |
| PR作成 | ✅ | ✅ | ✅ | ✅ | ✅ |
| ラベル管理 | ❌ | ✅ | ✅ | ✅ | ✅ |
| プッシュ | ❌ | ❌ | ✅ | ✅ | ✅ |
| ブランチ削除 | ❌ | ❌ | ✅ | ✅ | ✅ |
| マージ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Secrets管理 | ❌ | ❌ | ❌ | ❌ | ✅ |
| Webhooks設定 | ❌ | ❌ | ❌ | ✅ | ✅ |
| リポジトリ削除 | ❌ | ❌ | ❌ | ❌ | ✅ |

### Organizationの役割

| 役割 | 説明 |
|------|------|
| **Owner** | Organization全体の管理者 |
| **Member** | 通常のメンバー |
| **Billing manager** | 請求管理のみ |
| **Security manager** | セキュリティ設定のみ |

## コラボレーターの追加

### 個人リポジトリ

Settings → Collaborators:

```
1. Add people をクリック
2. ユーザー名/メールで検索
3. 権限レベルを選択
4. Add to repository
```

### Organizationリポジトリ

Settings → Collaborators and teams:

```
チーム単位での追加（推奨）:
1. Add teams
2. チームを選択
3. 権限レベルを選択

個人追加:
1. Add people
2. ユーザーを検索
3. 権限レベルを選択
```

## チームの管理

### チームの作成

Organization → Teams → New team:

```yaml
Team name: backend-team
Description: バックエンド開発チーム
Visibility: Visible  # または Secret
Parent team: engineering  # 親チームを設定可能
```

### チーム階層

```
engineering (親チーム)
├── frontend-team
├── backend-team
└── devops-team

権限の継承:
- 子チームは親チームの権限を継承
- 子チームに追加の権限を付与可能
```

### チームの権限設定

```
engineering → Write
└── backend-team → Write（継承）+ backend/ に Maintain
```

## Deploy Keys

### Deploy Keysとは

特定のリポジトリへのアクセス専用のSSHキーです。サーバーからのCI/CDやデプロイに使用します。

### 特徴

| 項目 | Deploy Key | PAT | GitHub App |
|------|------------|-----|------------|
| スコープ | 1リポジトリ | 全リポジトリ | 選択可能 |
| 権限 | Read/Write | 細かく設定 | 細かく設定 |
| 有効期限 | なし | あり | なし |
| 用途 | サーバー連携 | 個人利用 | アプリ連携 |

### 作成手順

1. SSHキーを生成：
```bash
ssh-keygen -t ed25519 -C "deploy@example.com" -f deploy_key
```

2. Settings → Deploy keys → Add deploy key

3. 公開鍵を登録：
```
Title: Production Server
Key: ssh-ed25519 AAAA... deploy@example.com
✅ Allow write access（書き込みが必要な場合）
```

### GitHub Actionsでの使用

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DEPLOY_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Clone and deploy
        run: |
          git clone git@github.com:user/repo.git
          cd repo && ./deploy.sh
```

## GitHub Apps

### GitHub Appsとは

GitHubと連携するアプリケーションです。ボットやCI/CDツール、統合サービスなどに使用されます。

### Personal Access Token（PAT）との違い

| 項目 | PAT | GitHub App |
|------|-----|------------|
| 紐付け | 個人アカウント | アプリ |
| 権限 | ユーザーの権限内 | 細かく設定 |
| レート制限 | ユーザー共通 | アプリ専用 |
| 監査 | ユーザー名 | アプリ名 |
| 管理 | 個人 | Organization |

### GitHub Appの作成

Settings → Developer settings → GitHub Apps → New GitHub App:

```yaml
App name: My CI Bot
Homepage URL: https://example.com
Webhook URL: https://example.com/webhook
Webhook secret: [生成した秘密鍵]

Permissions:
  Repository:
    Contents: Read and write
    Pull requests: Read and write
    Issues: Read and write
  Organization:
    Members: Read

Subscribe to events:
  ✅ Push
  ✅ Pull request
```

### インストール

1. Install App → 対象Organization/リポジトリを選択
2. リポジトリごとに許可

### GitHub Actionsでの使用

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Generate token
        id: app-token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ vars.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Use token
        run: |
          gh pr list
        env:
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
```

## Personal Access Token（PAT）

### クラシックトークン vs Fine-grained

| 項目 | Classic | Fine-grained |
|------|---------|--------------|
| スコープ | 大まかな権限 | リポジトリ単位 |
| 有効期限 | 設定可能/無期限 | 必須（最大1年） |
| 組織承認 | 不要 | 管理者承認可能 |
| 推奨 | レガシー | 新規利用 |

### Fine-grained PATの作成

Settings → Developer settings → Personal access tokens → Fine-grained tokens:

```yaml
Token name: CI Token
Expiration: 90 days
Resource owner: my-org

Repository access:
  - Only select repositories
  - my-org/my-repo

Permissions:
  Repository:
    Contents: Read and write
    Pull requests: Read and write
```

### セキュリティのベストプラクティス

```yaml
# 最小権限の原則
✅ 必要なリポジトリのみ
✅ 必要な権限のみ
✅ 短い有効期限

# 管理
✅ 定期的なローテーション
✅ 未使用トークンの削除
✅ 監査ログの確認
```

## Outside Collaborators

### 外部コラボレーターとは

Organizationのメンバーではないが、特定リポジトリへのアクセス権を持つユーザーです。

### 制限

- Organizationの設定には影響なし
- 招待したリポジトリのみアクセス可能
- シートを消費しない（Enterpriseの場合を除く）

### 管理

Organization → People → Outside collaborators:

```
招待:
1. Repository → Settings → Collaborators
2. Add people → 外部ユーザーを検索
3. 権限を設定

一覧確認:
Organization → People → Outside collaborators
```

---

## 中級者向けTips

### SAML SSO連携

Enterprise/Organization で SAML SSO を設定：

```yaml
Settings → Authentication security:

SAML single sign-on:
  ✅ Enable SAML authentication
  Sign on URL: https://idp.example.com/sso
  Issuer: https://idp.example.com
  Public certificate: [証明書]

Enforce SAML SSO:
  ✅ Require SAML SSO for all members
```

### IP許可リスト

```yaml
Settings → Authentication security:

IP allow list:
  - 203.0.113.0/24  # オフィスIP
  - 10.0.0.0/8      # VPN

# GitHub Actions IPを許可
  ✅ Enable IP allow list for installed GitHub Apps
```

### 監査ログの活用

```bash
# 監査ログの取得（Enterprise）
gh api /orgs/{org}/audit-log \
  --jq '.[] | select(.action | startswith("repo.")) | {action, actor, repo}'

# 重要なイベント
- repo.access: アクセス権変更
- repo.add_member: メンバー追加
- repo.remove_member: メンバー削除
- team.add_repository: チームにリポジトリ追加
```

### 権限の定期レビュー

```yaml
# .github/workflows/access-review.yml
name: Monthly Access Review

on:
  schedule:
    - cron: '0 0 1 * *'  # 毎月1日

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: List collaborators
        run: |
          gh api repos/${{ github.repository }}/collaborators \
            --jq '.[] | {login, role_name}' > collaborators.json

          echo "Current collaborators:"
          cat collaborators.json
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create review issue
        run: |
          gh issue create \
            --title "Monthly Access Review - $(date +%Y-%m)" \
            --body "Please review the current collaborators list."
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 最小権限の設計

```
プロジェクト構成例:

チーム構造:
├── core-team (Admin)
│   └── リポジトリ全体の管理
├── developers (Write)
│   └── コード開発、PR作成
├── reviewers (Triage + CODEOWNERS)
│   └── レビュー、Issue管理
└── ci-bot (GitHub App)
    └── CI/CD操作のみ

リポジトリ設定:
- Branch protection: core-team のみバイパス可能
- CODEOWNERS: reviewers の承認必須
- Secrets: core-team のみアクセス
```

---

## まとめ

| 認証方法 | 用途 | 推奨場面 |
|----------|------|----------|
| Deploy Key | サーバー連携 | 1リポジトリのみ |
| PAT (Fine-grained) | 個人利用、スクリプト | 限定的な自動化 |
| GitHub App | アプリ連携 | CI/CD、ボット |

### アクセス管理のベストプラクティス

1. **最小権限の原則**: 必要最小限の権限のみ付与
2. **チーム単位で管理**: 個人ではなくチームに権限付与
3. **定期レビュー**: 月次でアクセス権を見直し
4. **GitHub Apps推奨**: PATよりもGitHub Appsを使用
5. **短い有効期限**: トークンは90日以内に設定
6. **監査ログ確認**: 権限変更を定期的に監視

### 推奨設定

```yaml
# Organization設定
Base permissions: Read
# メンバーのデフォルト権限は最小限に

# リポジトリ設定
- core-team: Admin
- developers: Write
- contractors: Triage（外部コラボレーター）

# 認証
- SAML SSO: 有効（Enterpriseの場合）
- 2FA: 必須
```

次の章では、GitHub Copilotについて学びます。
