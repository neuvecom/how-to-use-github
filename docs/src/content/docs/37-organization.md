---
title: "Organization"
quiz:
  - question: "GitHub Organizationの主な用途は何ですか？"
    options:
      - "個人プロジェクトの管理"
      - "チームや企業でのリポジトリとメンバーの一元管理"
      - "ファイルのバックアップ"
      - "メールの送信"
    answer: 1
  - question: "Organization内のチームの役割は何ですか？"
    options:
      - "コードのコンパイル"
      - "メンバーをグループ化しリポジトリへのアクセス権限を管理"
      - "自動テストの実行"
      - "ドキュメントの生成"
    answer: 1
  - question: "Organization Ownerができることは何ですか？"
    options:
      - "リポジトリの閲覧のみ"
      - "組織の全設定、メンバー管理、課金管理"
      - "コードの編集のみ"
      - "Issueの作成のみ"
    answer: 1
---

この章では、GitHub Organizationの作成、メンバー管理、チーム階層、権限設定について学びます。

## Organizationとは

**Organization**は、複数のリポジトリとメンバーを一元管理するためのアカウント種別です。企業やチーム、オープンソースプロジェクトで利用されます。

### 個人アカウントとの違い

| 項目 | 個人アカウント | Organization |
|------|---------------|--------------|
| 所有者 | 1人 | 複数人可能 |
| リポジトリ | 個人所有 | 組織所有 |
| メンバー管理 | コラボレーター | チーム単位 |
| 権限設定 | 基本的 | 詳細 |
| 請求 | 個人 | 組織一括 |

## Organizationの作成

### 作成手順

1. 右上のプロフィールアイコン → Settings
2. 左メニューの「Organizations」
3. 「New organization」をクリック

### プラン選択

| プラン | 価格 | 主な機能 |
|--------|------|----------|
| **Free** | 無料 | 公開リポジトリ無制限、プライベート制限あり |
| **Team** | $4/ユーザー/月 | プライベート無制限、高度な権限管理 |
| **Enterprise** | $21/ユーザー/月 | SAML SSO、監査ログ、高度なセキュリティ |

### 初期設定

```yaml
# Organization 作成時の設定項目
Organization name: my-company
Billing email: billing@company.com
Organization URL: github.com/my-company

# プロフィール設定
Display name: My Company
Description: We build amazing software
Website: https://company.com
Location: Tokyo, Japan
```

## メンバー管理

### メンバーの招待

Organization → People → Invite member:

```yaml
招待方法:
1. GitHubユーザー名またはメールで検索
2. 役割を選択（Owner / Member）
3. チームを選択（オプション）
4. 招待を送信

招待の有効期限: 7日間
```

### メンバーの役割

| 役割 | 説明 |
|------|------|
| **Owner** | 全権限を持つ管理者 |
| **Member** | 通常のメンバー |
| **Billing manager** | 請求管理のみ |
| **Security manager** | セキュリティ設定のみ |

### Ownerの責任

```yaml
Ownerができること:
- メンバーの追加/削除
- チームの作成/管理
- リポジトリの作成/削除
- 組織設定の変更
- 請求情報の管理
- Webhookの設定
- 2要素認証の強制

推奨:
- Ownerは2-3人に限定
- 重要な操作は複数人で確認
- 監査ログを定期確認
```

### メンバーの削除

```yaml
削除手順:
1. People → メンバーを選択
2. 「Remove from organization」
3. 確認ダイアログで承認

削除時の影響:
- 組織のリポジトリへのアクセス喪失
- チームからも自動削除
- 個人フォークは保持される
- 過去のコミット履歴は残る
```

## チーム管理

### チームの作成

Organization → Teams → New team:

```yaml
Team name: backend-team
Description: バックエンド開発チーム
Team visibility: Visible（全メンバーに表示）
Parent team: engineering（オプション）
```

### チームの階層構造

```
engineering (親チーム)
├── frontend-team
│   ├── react-team
│   └── design-system-team
├── backend-team
│   ├── api-team
│   └── database-team
└── devops-team
    ├── infrastructure-team
    └── ci-cd-team
```

### 階層の利点

```yaml
権限の継承:
- 親チームの権限は子チームに継承
- 子チームに追加権限を付与可能
- 一括での権限変更が容易

通知:
- 親チームへのメンションで全員に通知
- @engineering で engineering 以下全員に通知

管理:
- 組織構造を反映した管理
- 人事異動への対応が容易
```

### チームへのリポジトリ割り当て

```yaml
チーム → Repositories → Add repository:

設定:
  Repository: my-company/backend-api
  Permission: Write

権限レベル:
  - Read: 閲覧のみ
  - Triage: Issue/PR管理
  - Write: プッシュ可能
  - Maintain: リポジトリ設定の一部
  - Admin: 全権限
```

## 権限設定

### ベース権限

Organization → Settings → Member privileges:

```yaml
Base permissions:
  ☐ No permission（アクセスなし）
  ☑ Read（読み取りのみ）
  ☐ Write（書き込み可能）
  ☐ Admin（管理者）

推奨: Read または No permission
理由: 最小権限の原則
```

### リポジトリ作成権限

```yaml
Repository creation:
  ☐ Members can create public repositories
  ☑ Members can create private repositories
  ☐ Members can create internal repositories

理由:
- パブリックリポジトリは誤って機密情報を公開するリスク
- プライベートリポジトリは比較的安全
```

### フォーク設定

```yaml
Repository forking:
  ☐ Allow forking of private repositories

理由:
- フォークはコードの複製
- 管理外に機密コードが流出するリスク
```

## 組織のプロフィール

### プロフィール設定

Organization → Settings → Profile:

```yaml
Organization profile:
  Display name: My Company Inc.
  Email: contact@company.com
  Description: Building the future of software
  URL: https://company.com
  Location: Tokyo, Japan

Profile README:
  # .github リポジトリに profile/README.md を配置
```

### プロフィールREADME

```markdown
<!-- .github/profile/README.md -->
# Welcome to My Company

私たちは革新的なソフトウェアを開発しています。

## 主要プロジェクト
- [product-a](https://github.com/my-company/product-a) - メインプロダクト
- [open-source-lib](https://github.com/my-company/open-source-lib) - OSSライブラリ

## Join Us
- [採用情報](https://company.com/careers)
- [ブログ](https://blog.company.com)

## Contact
- Email: dev@company.com
- Twitter: @mycompany
```

## セキュリティ設定

### 2要素認証の強制

```yaml
Organization → Settings → Authentication security:

Two-factor authentication:
  ☑ Require two-factor authentication for everyone

結果:
- 2FAなしのメンバーは組織から除外
- 新規メンバーは2FA設定が必須
- セキュリティの大幅な向上
```

### SSHキーと個人アクセストークン

```yaml
SSH certificate authorities:
  # 組織用SSH CA を設定可能（Enterprise）

Personal access token requirements:
  ☑ Require approval for fine-grained personal access tokens
  # メンバーのPAT使用を管理
```

### 監査ログ

```yaml
Organization → Settings → Audit log:

確認できる内容:
- メンバーの追加/削除
- リポジトリの作成/削除
- 権限の変更
- Webhookの設定
- 2FA の有効化/無効化

フィルタリング:
  action:repo.create
  action:org.add_member
  actor:username
```

---

## 中級者向けTips

### 大規模組織の管理

```yaml
# 100人以上の組織での推奨設定

チーム構造:
  - 部門ごとの親チーム
  - プロジェクトごとの子チーム
  - クロスファンクショナルチーム

権限管理:
  - CODEOWNERS の活用
  - ブランチ保護ルール
  - Required reviewers

自動化:
  - メンバー同期（SAML/LDAP）
  - チーム同期（GitHub Teams Sync）
  - Terraform での管理
```

### Terraformでの管理

```hcl
# terraform/github.tf
resource "github_organization_settings" "org" {
  billing_email = "billing@company.com"
  name          = "My Company"
  description   = "Building amazing software"

  default_repository_permission = "read"
  members_can_create_repositories = false
  members_can_create_public_repositories = false
}

resource "github_team" "engineering" {
  name        = "engineering"
  description = "Engineering team"
  privacy     = "closed"
}

resource "github_team" "backend" {
  name           = "backend"
  description    = "Backend team"
  privacy        = "closed"
  parent_team_id = github_team.engineering.id
}
```

### GitHub CLI での管理

```bash
# メンバー一覧
gh api /orgs/{org}/members --jq '.[].login'

# チーム一覧
gh api /orgs/{org}/teams --jq '.[].name'

# メンバー招待
gh api /orgs/{org}/invitations -f email="user@example.com" -f role="direct_member"

# チーム作成
gh api /orgs/{org}/teams -f name="new-team" -f description="New team"
```

### 監査ログの自動エクスポート

```yaml
# GitHub Enterprise の場合
Settings → Audit log → Stream to:
  - Amazon S3
  - Azure Blob Storage
  - Datadog
  - Splunk
  - Google Cloud Storage
```

---

## まとめ

| 項目 | 推奨設定 |
|------|----------|
| Ownerの数 | 2-3人に限定 |
| Base permission | Read または None |
| 2FA | 必須 |
| リポジトリ作成 | 制限推奨 |

### Organizationのベストプラクティス

1. **最小権限**: ベース権限は最小限に
2. **チーム単位管理**: 個人ではなくチームに権限付与
3. **階層構造**: 組織構造を反映したチーム階層
4. **2FA必須**: セキュリティの基本
5. **定期監査**: 権限とメンバーを定期的にレビュー
6. **ドキュメント化**: 組織ポリシーを明文化

### 推奨設定チェックリスト

```markdown
# Organization 設定チェックリスト

## 基本設定
- [ ] プロフィール完成
- [ ] プロフィールREADME作成
- [ ] 請求情報設定

## セキュリティ
- [ ] 2FA必須化
- [ ] ベース権限を最小化
- [ ] フォーク制限
- [ ] 監査ログ確認体制

## チーム
- [ ] チーム階層の設計
- [ ] 権限の割り当て
- [ ] CODEOWNERSの設定

## 運用
- [ ] Ownerのバックアップ
- [ ] 退職者対応プロセス
- [ ] 定期レビューのスケジュール
```

次の章では、Enterprise機能について学びます。
