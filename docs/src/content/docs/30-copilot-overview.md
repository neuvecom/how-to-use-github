---
title: "Copilot概要"
quiz:
  - question: "GitHub Copilotの基盤となっているAIモデルは何ですか？"
    options:
      - "BERT"
      - "GPT系の大規模言語モデル"
      - "画像認識AI"
      - "音声認識AI"
    answer: 1
  - question: "GitHub Copilot Individualの月額料金はいくらですか？"
    options:
      - "無料"
      - "$10/月"
      - "$19/月"
      - "$39/月"
    answer: 1
  - question: "GitHub Copilotが対応している主なエディタはどれですか？"
    options:
      - "メモ帳のみ"
      - "VS Code、JetBrains IDE、Neovimなど"
      - "Wordのみ"
      - "Excelのみ"
    answer: 1
---

この章では、GitHub Copilotの概要、料金プラン、対応エディタ、利用規約について学びます。

## GitHub Copilotとは

**GitHub Copilot**は、AIを活用したコーディング支援ツールです。コードの自動補完、生成、説明、リファクタリングなど、開発作業を大幅に効率化します。

### 主な機能

| 機能 | 説明 |
|------|------|
| **コード補完** | リアルタイムでコードを提案 |
| **コード生成** | コメントから関数を生成 |
| **Copilot Chat** | 自然言語でコードを説明・質問 |
| **PR要約** | プルリクエストの内容を要約 |
| **ドキュメント生成** | コメントやドキュメントを自動生成 |

### 仕組み

```
開発者のコード入力
      ↓
コンテキスト分析（ファイル全体、周辺コード）
      ↓
AIモデル（GPT-4ベース）で予測
      ↓
候補を提案
      ↓
開発者が採用/修正/却下
```

## 料金プラン

### プラン比較

| プラン | 価格 | 対象 | 主な機能 |
|--------|------|------|----------|
| **Free** | 無料 | 全ユーザー | 月50メッセージ、月2000コード補完 |
| **Pro** | $10/月 | 個人開発者 | 無制限補完、Chat、CLI |
| **Business** | $19/ユーザー/月 | 組織 | 管理機能、ポリシー設定 |
| **Enterprise** | $39/ユーザー/月 | 大企業 | カスタマイズ、高度な管理 |

### Freeプランの制限

```
月間制限:
- Copilot Chat: 50メッセージ
- コード補完: 2000回
- リセット: 毎月1日

含まれない機能:
- Copilot in CLI
- 高度なモデル選択
- 組織管理機能
```

### Proプラン

```
含まれる機能:
- 無制限のコード補完
- 無制限のCopilot Chat
- Copilot in CLI
- 複数モデル選択（GPT-4、Claude等）
- VS Code、JetBrains、Neovim等

対象:
- 個人開発者
- 学習目的
- 小規模プロジェクト
```

### Businessプラン

```
Proの全機能 +
- 組織単位の管理
- ポリシー設定
- 監査ログ
- IP除外リスト
- SAML SSO連携

対象:
- スタートアップ
- 中小企業
- 開発チーム
```

### Enterpriseプラン

```
Businessの全機能 +
- Copilot Customization（カスタムモデル）
- Knowledge Base（社内ナレッジ連携）
- 高度なセキュリティ
- プレミアムサポート
- SLA保証

対象:
- 大企業
- 厳格なセキュリティ要件
- カスタマイズが必要な組織
```

## 対応エディタ・環境

### 公式サポート

| エディタ | サポート状況 | 機能 |
|----------|-------------|------|
| **VS Code** | ✅ フルサポート | 補完、Chat、Voice |
| **Visual Studio** | ✅ フルサポート | 補完、Chat |
| **JetBrains IDEs** | ✅ フルサポート | 補完、Chat |
| **Neovim** | ✅ サポート | 補完 |
| **Vim** | ✅ サポート | 補完（プラグイン経由） |
| **Xcode** | ✅ サポート | 補完 |
| **Azure Data Studio** | ✅ サポート | 補完 |

### JetBrains対応IDE

- IntelliJ IDEA
- PyCharm
- WebStorm
- PhpStorm
- GoLand
- RubyMine
- CLion
- Rider
- DataGrip

### Copilot in CLI

```bash
# インストール
gh extension install github/gh-copilot

# 使用例
gh copilot suggest "list all files modified in the last week"
gh copilot explain "git rebase -i HEAD~3"
```

### GitHub.com（Web）

```
対応機能:
- PR要約
- Issue要約
- コミットメッセージ提案
- コードレビュー支援
```

## 有効化手順

### 個人アカウント

1. [github.com/settings/copilot](https://github.com/settings/copilot) にアクセス
2. プランを選択
3. 支払い情報を登録（Proの場合）
4. エディタに拡張機能をインストール

### VS Codeの設定

```bash
# 拡張機能をインストール
1. VS Code を開く
2. Extensions (Ctrl+Shift+X)
3. "GitHub Copilot" を検索
4. Install

# ログイン
1. Copilot アイコンをクリック
2. Sign in to GitHub
3. 認証完了
```

### Organizationでの有効化

```
Organization Settings:
1. Copilot → Policies
2. Copilot for Business を有効化
3. メンバーへの許可設定
   - All members
   - Selected teams
   - Selected members
```

## 利用規約・プライバシー

### コード利用ポリシー

| 設定 | 説明 |
|------|------|
| **Suggestions matching public code** | 公開コードと一致する提案をブロック |
| **Allow GitHub to use my code** | 製品改善のためのコード利用許可 |

### 設定場所

```
個人: Settings → Copilot → Policies

Allow GitHub to use my code snippets for product improvements:
☐ Allow（許可）
☑ Block（ブロック）← プライベートコード重視

Suggestions matching public code:
☑ Block（ブロック）← ライセンス問題回避
☐ Allow（許可）
```

### Businessでのポリシー

```yaml
Organization Policies:

# コードスニペットの収集
Telemetry:
  ☐ Allow telemetry data collection

# 公開コード一致の提案
Public code matching:
  ☑ Block suggestions matching public code

# 許可するエディタ
Allowed editors:
  ☑ VS Code
  ☑ JetBrains
  ☐ Neovim

# ネットワーク制限
IP allow list:
  - 企業ネットワークのみ
```

### データの取り扱い

```
Business/Enterprise プラン:
- プロンプトは保持されない
- コードは学習に使用されない
- 暗号化された通信
- SOC 2 Type 2 認証

Proプラン:
- 設定でデータ収集を制御可能
- デフォルトは収集なし
```

## 対応言語

### フルサポート言語

高精度な補完が期待できる言語：

- JavaScript / TypeScript
- Python
- Java
- C / C++
- C#
- Go
- Ruby
- PHP
- Rust
- Swift
- Kotlin

### 部分サポート

一定の補完が期待できる言語：

- HTML / CSS
- SQL
- Shell (Bash)
- YAML / JSON
- Markdown
- R
- Scala
- Perl
- その他多数

---

## 中級者向けTips

### Copilotの効果測定

```
Dashboard で確認:
Settings → Copilot → Usage

メトリクス:
- Acceptance rate: 提案の採用率
- Lines suggested: 提案された行数
- Time saved: 推定節約時間
```

### 組織での展開計画

```yaml
Phase 1: パイロット（1ヶ月）
- 対象: 10名の開発者
- 目的: 効果検証、課題抽出
- 成功指標: 採用率 > 25%

Phase 2: 限定展開（2ヶ月）
- 対象: 50名（2チーム）
- 目的: ベストプラクティス確立
- 成功指標: 生産性向上 > 10%

Phase 3: 全社展開
- 対象: 全開発者
- ガイドライン整備
- トレーニング実施
```

### コスト試算

```yaml
チーム規模: 20名

Businessプラン:
- $19 × 20名 = $380/月
- 年間: $4,560

ROI試算:
- 1人あたり 1時間/日 の節約
- 20名 × 20日 × 1時間 = 400時間/月
- エンジニア時給 $50 想定
- 節約: $20,000/月
- ROI: 5,163%
```

### セキュリティチェックリスト

```yaml
導入前確認:
☐ セキュリティチームの承認
☐ 法務部門の確認（ライセンス）
☐ データ取り扱いポリシーの確認
☐ 従業員への周知・同意

設定確認:
☐ Public code matching: Block
☐ Telemetry: Block
☐ IP制限の設定
☐ 許可エディタの限定

運用確認:
☐ レビュー必須ルールの維持
☐ セキュリティスキャンの継続
☐ 定期的な監査ログ確認
```

---

## まとめ

| プラン | 価格 | 推奨対象 |
|--------|------|----------|
| Free | 無料 | 試用、学習 |
| Pro | $10/月 | 個人開発者 |
| Business | $19/月 | チーム・企業 |
| Enterprise | $39/月 | 大企業 |

### 導入判断のポイント

1. **セキュリティ要件**: 機密コードを扱うならBusiness以上
2. **チーム規模**: 5名以上ならBusiness推奨
3. **コンプライアンス**: 監査要件があればEnterprise
4. **カスタマイズ**: 社内ナレッジ連携が必要ならEnterprise

### 推奨設定

```yaml
# 企業での推奨設定
Plan: Business

Policies:
  Public code matching: Block
  Telemetry: Block
  Allowed editors: VS Code, JetBrains

Member access:
  - All developers: Allow
  - Contractors: Selected repositories only
```

次の章では、Copilotの基本機能について学びます。
