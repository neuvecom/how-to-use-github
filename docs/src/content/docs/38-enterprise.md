---
title: "Enterprise機能"
---

この章では、GitHub EnterpriseのSAML SSO、監査ログ、その他のエンタープライズ向け機能について学びます。

## GitHub Enterpriseとは

**GitHub Enterprise**は、大企業向けのGitHubプランです。セキュリティ、コンプライアンス、管理機能が強化されています。

### 提供形態

| 形態 | 説明 |
|------|------|
| **Enterprise Cloud** | GitHubがホスト（SaaS） |
| **Enterprise Server** | 自社サーバーにインストール |

### Enterprise Cloudの機能

```yaml
主な機能:
- SAML SSO / SCIM
- 監査ログの長期保存
- IP許可リスト
- EMU（Enterprise Managed Users）
- 高度なセキュリティ機能
- プレミアムサポート
- SLA保証
```

## SAML SSO

### SAML SSOとは

**SAML（Security Assertion Markup Language）SSO**は、企業の認証基盤（IdP）とGitHubを連携させる機能です。

### 対応IdP

| IdP | 対応状況 |
|-----|----------|
| Azure AD | ✅ フルサポート |
| Okta | ✅ フルサポート |
| OneLogin | ✅ サポート |
| PingOne | ✅ サポート |
| その他SAML 2.0対応 | ✅ 汎用設定 |

### 設定手順

```yaml
# Organization での設定
Settings → Authentication security → SAML single sign-on:

1. Enable SAML authentication: ✅

2. IdP設定:
   Sign on URL: https://idp.example.com/sso/saml
   Issuer: https://idp.example.com
   Public certificate: [証明書をペースト]

3. オプション:
   ☑ Require SAML SSO for all members
```

### Azure ADとの連携

```yaml
# Azure AD 側の設定
1. Azure Portal → Enterprise applications
2. New application → GitHub Enterprise Cloud
3. Single sign-on → SAML

設定値:
  Entity ID: https://github.com/orgs/{org}
  Reply URL: https://github.com/orgs/{org}/saml/consume
  Sign on URL: https://github.com/orgs/{org}/sso

属性マッピング:
  - user.email → emails
  - user.userprincipalname → unique_identifier
```

### SCIM プロビジョニング

```yaml
# SCIM（System for Cross-domain Identity Management）
# ユーザーの自動プロビジョニング

Settings → Authentication security → SCIM configuration:

  SCIM URL: https://api.github.com/scim/v2/organizations/{org}
  Token: [生成されたトークン]

機能:
- IdPからのユーザー自動作成
- グループ→チームの同期
- ユーザー無効化時の自動削除
```

## 監査ログ

### 監査ログの機能

```yaml
記録される内容:
- 認証イベント（ログイン/ログアウト）
- リポジトリ操作（作成/削除/設定変更）
- メンバー管理（追加/削除/権限変更）
- チーム操作
- Webhook設定
- シークレット操作
```

### 監査ログの検索

Organization → Settings → Audit log:

```bash
# アクションでフィルタ
action:repo.create
action:org.add_member
action:team.add_member

# ユーザーでフィルタ
actor:username

# 日付でフィルタ
created:>2024-01-01
created:2024-01-01..2024-01-31

# 複合検索
action:repo.delete actor:admin-user created:>2024-01-01
```

### 監査ログのエクスポート

```yaml
# API経由でエクスポート
gh api /orgs/{org}/audit-log \
  --jq '.[] | {timestamp: .["@timestamp"], actor: .actor, action: .action}'

# Enterprise: ストリーミング設定
Settings → Audit log → Stream to:
  - Amazon S3
  - Azure Blob Storage
  - Azure Event Hubs
  - Google Cloud Storage
  - Datadog
  - Splunk
```

### 監査ログの保持期間

| プラン | 保持期間 |
|--------|----------|
| Free/Team | 90日 |
| Enterprise Cloud | 無制限（ストリーミング） |
| Enterprise Server | 設定による |

## IP許可リスト

### IP許可リストとは

特定のIPアドレスからのみGitHubへのアクセスを許可する機能です。

### 設定

```yaml
Organization → Settings → Authentication security → IP allow list:

許可するIP:
  - 203.0.113.0/24    # オフィスネットワーク
  - 10.0.0.0/8        # VPNネットワーク
  - 192.168.1.100/32  # 特定のサーバー

オプション:
  ☑ Enable IP allow list
  ☑ Allow GitHub's IP addresses（GitHub Actionsのため）
```

### 注意点

```yaml
考慮事項:
- GitHub Actionsの実行IPを許可する必要がある
- 在宅勤務者のアクセス方法を検討
- VPNの設定と連携
- 緊急時のアクセス手段を確保

推奨:
- VPN経由でのアクセスを標準化
- IP許可リストとVPNを組み合わせ
- 例外申請プロセスを用意
```

## Enterprise Managed Users（EMU）

### EMUとは

Enterprise Managed Users は、企業のIdPで完全に管理されるユーザーアカウントです。

### 特徴

```yaml
通常のSSO:
- 既存のGitHubアカウントと連携
- 個人アカウントとして存在
- 複数組織に所属可能

EMU:
- 企業専用のアカウント
- IdPで完全管理
- 企業データの分離
- 退職時に自動無効化
```

### ユースケース

```yaml
EMUが適している場合:
- 厳格なデータ分離が必要
- コンプライアンス要件が厳しい
- ユーザー管理を完全に一元化したい
- BYOD（個人アカウント）を許可しない

通常SSOが適している場合:
- オープンソース活動も奨励
- 柔軟な働き方を重視
- 既存のGitHubアカウントを活用したい
```

## 高度なセキュリティ機能

### GitHub Advanced Security（GHAS）

```yaml
含まれる機能:
- Code scanning（CodeQL）
- Secret scanning
- Push protection
- Dependency review
- Security overview

対象:
- Enterprise プランで利用可能
- パブリックリポジトリは無料
```

### セキュリティ概要ダッシュボード

```yaml
Enterprise → Code security:

表示される情報:
- 全リポジトリのセキュリティアラート
- 脆弱性の傾向
- 対応状況の追跡
- チーム別のセキュリティスコア
```

## コンプライアンス

### リポジトリポリシー

```yaml
Enterprise → Policies → Repositories:

設定可能な項目:
- リポジトリの可視性制限
- フォークの制限
- Issue/PRテンプレートの強制
- ブランチ保護の強制
```

### データ保存場所

```yaml
# Enterprise Cloud のデータ保存
Data residency:
- US（デフォルト）
- EU（GDPR対応）

設定:
Enterprise → Settings → Data residency
```

### SOC 2 / ISO 27001

```yaml
GitHub の認証:
- SOC 2 Type 2
- ISO 27001
- FedRAMP（米国政府向け）

レポートの取得:
Enterprise → Settings → Compliance reports
```

---

## 中級者向けTips

### Enterprise API

```bash
# Enterprise統計の取得
gh api /enterprises/{enterprise}/settings/billing/actions

# ライセンス使用状況
gh api /enterprises/{enterprise}/consumed-licenses

# Organization一覧
gh api /enterprises/{enterprise}/organizations
```

### REST API vs GraphQL

```graphql
# GraphQL での Organization 情報取得
query {
  enterprise(slug: "my-enterprise") {
    organizations(first: 100) {
      nodes {
        login
        membersWithRole {
          totalCount
        }
        repositories {
          totalCount
        }
      }
    }
  }
}
```

### 自動化スクリプト

```python
# enterprise_audit.py
import requests

def get_audit_log(org, token):
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    url = f"https://api.github.com/orgs/{org}/audit-log"
    response = requests.get(url, headers=headers)

    return response.json()

def check_security_alerts(enterprise, token):
    # Advanced Security アラートの確認
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    url = f"https://api.github.com/enterprises/{enterprise}/code-scanning/alerts"
    response = requests.get(url, headers=headers)

    alerts = response.json()
    critical = [a for a in alerts if a["rule"]["severity"] == "critical"]

    return critical
```

### Terraform での Enterprise 管理

```hcl
# terraform/enterprise.tf
provider "github" {
  owner = "my-enterprise"
}

resource "github_enterprise_organization" "org" {
  enterprise_id = data.github_enterprise.main.id
  name          = "new-org"
  description   = "New organization"
  billing_email = "billing@company.com"

  admin_logins = ["admin-user"]
}
```

---

## まとめ

| 機能 | 用途 |
|------|------|
| SAML SSO | 企業認証との連携 |
| SCIM | ユーザー自動プロビジョニング |
| 監査ログ | コンプライアンス対応 |
| IP許可リスト | アクセス制御 |
| EMU | 完全管理されたユーザー |

### Enterprise導入チェックリスト

```markdown
# Enterprise導入前チェックリスト

## 要件確認
- [ ] ユーザー数の見積もり
- [ ] 必要な機能の洗い出し
- [ ] コンプライアンス要件の確認
- [ ] 予算の確保

## IdP連携
- [ ] IdPの選定/確認
- [ ] SAML設定のテスト
- [ ] SCIM連携のテスト
- [ ] グループ→チームマッピング設計

## セキュリティ
- [ ] IP許可リストの設計
- [ ] VPN連携の確認
- [ ] 監査ログの保存先決定
- [ ] アラート通知の設定

## 運用
- [ ] 管理者の選定
- [ ] 運用マニュアルの作成
- [ ] 障害対応手順の策定
- [ ] 定期レビューのスケジュール
```

### Enterprise vs Team の選択基準

```yaml
Teamプランが適している:
- 100人未満の組織
- SAML SSO不要
- 基本的なセキュリティで十分
- コスト重視

Enterpriseが必要:
- 100人以上の組織
- SAML SSO/SCIM必須
- 高度なセキュリティ要件
- コンプライアンス対応必須
- 監査ログの長期保存
```

次の章では、GitHub Pagesについて学びます。
