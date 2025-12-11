---
title: "CODEOWNERS設定"
---

# CODEOWNERS設定

この章では、CODEOWNERSファイルの書き方と活用方法を学びます。ファイルやディレクトリごとにレビュアーを自動割り当てできます。

## CODEOWNERSとは

**CODEOWNERS**は、リポジトリ内のファイルやディレクトリに対して「所有者」を定義するファイルです。PRの変更内容に応じて、自動でレビュアーが割り当てられます。

### メリット

1. **自動レビュアー割り当て**: 手動で指定する手間を削減
2. **専門家の関与**: 該当領域の詳しい人がレビュー
3. **責任の明確化**: 誰がどのコードに責任を持つか明確
4. **品質向上**: 適切な人がレビューすることで品質向上

## ファイルの配置場所

以下のいずれかに配置（上から優先）：

```
1. .github/CODEOWNERS
2. CODEOWNERS（ルート）
3. docs/CODEOWNERS
```

:::message
`.github/CODEOWNERS` への配置を推奨します。リポジトリの設定ファイルが一箇所にまとまります。
:::

## 基本的な書き方

### 構文

```
# コメント
<パターン>  <オーナー1> <オーナー2> ...
```

### オーナーの指定方法

| 形式 | 説明 | 例 |
|------|------|-----|
| @username | ユーザー名 | @taro |
| @org/team-name | チーム名 | @myorg/backend |
| email@example.com | メールアドレス | dev@example.com |

### 基本例

```
# デフォルトオーナー（全ファイル）
*       @default-reviewer

# 特定のファイル
README.md    @docs-team
LICENSE      @legal-team

# 特定のディレクトリ
/src/        @dev-team
/docs/       @docs-team
/tests/      @qa-team
```

## パターンの書き方

### 基本パターン

```
# 完全一致
README.md              # ルートのREADME.mdのみ
/README.md             # 同上（/は明示的にルート）

# 任意の場所のファイル
*.js                   # 全ての.jsファイル
*.test.js              # 全ての.test.jsファイル

# ディレクトリ
/src/                  # srcディレクトリ内の全ファイル
docs/                  # 任意の場所のdocsディレクトリ
```

### 詳細パターン

```
# 再帰的なマッチ
/src/**                # src以下の全ファイル（サブディレクトリ含む）
/src/**/*.js           # src以下の全.jsファイル

# 特定のサブディレクトリ
/src/components/       # componentsディレクトリ
/src/components/**     # components以下の全ファイル

# 除外（後述のルールで上書き）
# 除外専用の構文はないが、後のルールで別のオーナーを指定
```

## 実践的な設定例

### フロントエンド/バックエンド分離

```
# デフォルト
*                           @lead-developer

# フロントエンド
/frontend/                  @frontend-team
*.tsx                       @frontend-team
*.css                       @frontend-team @ui-team

# バックエンド
/backend/                   @backend-team
/api/                       @backend-team

# データベース
/migrations/                @backend-team @dba
*.sql                       @dba
```

### 機能チームごと

```
# 認証機能
/src/auth/                  @auth-team
/src/middleware/auth*       @auth-team

# 決済機能
/src/payment/               @payment-team
/src/billing/               @payment-team

# 管理画面
/src/admin/                 @admin-team

# 共通ライブラリ
/src/lib/                   @core-team
/src/utils/                 @core-team
```

### インフラ/DevOps

```
# CI/CD
/.github/                   @devops-team
.github/workflows/          @devops-team

# Docker
Dockerfile                  @devops-team
docker-compose*.yml         @devops-team

# Kubernetes
/k8s/                       @devops-team
*.yaml                      @devops-team  # 注意: 広すぎる場合がある

# Terraform
/terraform/                 @infra-team
*.tf                        @infra-team
```

### セキュリティ関連

```
# セキュリティ重要ファイル
/src/auth/                  @security-team @backend-team
/src/crypto/                @security-team
SECURITY.md                 @security-team

# 依存関係
package.json                @security-team @lead-developer
package-lock.json           @security-team
yarn.lock                   @security-team
```

## ルールの優先順位

CODEOWNERSは**最後にマッチしたルールが適用**されます：

```
# 例
*                   @default-owner
/src/               @src-owner
/src/auth/          @auth-team
/src/auth/admin.js  @admin-team

# /src/auth/admin.js のオーナーは @admin-team
# /src/auth/login.js のオーナーは @auth-team
# /src/utils.js のオーナーは @src-owner
# /README.md のオーナーは @default-owner
```

### 複数オーナーの指定

```
# 複数人/チームを指定（全員がレビュアーになる）
/src/critical/      @team-lead @senior-dev @qa-team

# 最低1人の承認が必要（ブランチ保護の設定による）
```

## 必須レビューとの連携

### ブランチ保護ルールでの設定

Settings → Branches → Branch protection rules:

```
✅ Require a pull request before merging
  ✅ Require review from Code Owners
```

これにより、CODEOWNERSに指定されたユーザーの承認が必須になります。

### 動作

```
PRで /src/auth/login.js を変更

CODEOWNERSの設定:
/src/auth/    @auth-team

結果:
- @auth-teamがレビュアーとして自動割り当て
- @auth-teamからの承認が必要
```

## 注意事項

### オーナーの権限

CODEOWNERSに指定するユーザー/チームは、リポジトリへの**書き込み権限（Write以上）**が必要です。

```
権限がない場合:
- レビュアーとして割り当てられない
- 警告が表示される
```

### チーム名の書き方

```
# Organization内のチーム
@org-name/team-name

# 例
@mycompany/backend
@mycompany/frontend
@mycompany/devops
```

### 大きなファイルの除外

```
# パッケージロックファイルはオーナーなし
# （空にすることで、デフォルトオーナーを上書き）
package-lock.json
yarn.lock
```

---

## 中級者向けTips

### CODEOWNERS の検証

```bash
# GitHub CLI でCODEOWNERSの構文エラーをチェック
# （リポジトリページでも警告が表示される）

# PR作成時に自動でチェックされる
# 無効なユーザー/チームがあると警告
```

### 複雑なパターンの例

```
# monorepo での設定
/packages/frontend/**       @frontend-team
/packages/backend/**        @backend-team
/packages/shared/**         @core-team @frontend-team @backend-team

# 特定のファイルタイプを除外
/packages/frontend/**       @frontend-team
/packages/frontend/**/*.md  @docs-team  # ドキュメントは別チーム
```

### GitHub Actions での CODEOWNERS チェック

```yaml
name: CODEOWNERS Check

on:
  pull_request:
    paths:
      - 'CODEOWNERS'
      - '.github/CODEOWNERS'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate CODEOWNERS
        uses: mszostok/codeowners-validator@v0.7.4
        with:
          checks: "files,owners,duppatterns"
          github_access_token: "${{ secrets.GITHUB_TOKEN }}"
```

### オーナー情報の可視化

```yaml
# PRにオーナー情報をコメント
name: Show CODEOWNERS

on:
  pull_request:
    types: [opened]

jobs:
  show-owners:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Get changed files owners
        run: |
          # 変更ファイルとオーナーを表示
          gh pr view ${{ github.event.pull_request.number }} \
            --json files \
            --jq '.files[].path' | while read file; do
            echo "File: $file"
            # オーナーを検索するロジック
          done
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## まとめ

| 項目 | 内容 |
|------|------|
| 配置場所 | `.github/CODEOWNERS` |
| 構文 | `<パターン> <オーナー>` |
| 優先順位 | 最後にマッチしたルール |
| 必要権限 | Write以上 |

### CODEOWNERSのベストプラクティス

1. **`.github/` に配置**: 設定ファイルを一箇所に
2. **デフォルトオーナーを設定**: `*` で漏れを防ぐ
3. **チーム単位で指定**: 個人より柔軟
4. **定期的に見直し**: チーム構成変更に追随
5. **ブランチ保護と連携**: 承認を必須に

### 推奨設定例

```
# デフォルト - チームリーダー
*                       @myorg/team-leads

# ドキュメント
/docs/                  @myorg/docs-team
*.md                    @myorg/docs-team

# フロントエンド
/src/frontend/          @myorg/frontend
/src/components/        @myorg/frontend

# バックエンド
/src/backend/           @myorg/backend
/src/api/               @myorg/backend

# インフラ
/.github/               @myorg/devops
/infrastructure/        @myorg/devops

# セキュリティ重要
/src/auth/              @myorg/security @myorg/backend
```

次の章では、自動化ルールについて学びます。
