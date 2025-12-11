---
title: "Rulesets"
quiz:
  - question: "Rulesetsのブランチ保護ルールとの主な違いはどれですか?"
    options:
      - "Rulesetsはブランチのみ対象"
      - "Rulesetsはブランチとタグの両方に対応"
      - "Rulesetsは無料プランでは使用不可"
      - "Rulesetsは個人アカウントでは使用不可"
    answer: 1
  - question: "RulesetsのEnforcement statusで、違反を記録するが強制しないテストモードはどれですか?"
    options:
      - "Active"
      - "Disabled"
      - "Evaluate"
      - "Testing"
    answer: 2
  - question: "Rulesetsで複数のルールセットがマッチする場合、どうなりますか?"
    options:
      - "最初のルールセットのみ適用"
      - "最後のルールセットのみ適用"
      - "すべてのルールが結合される"
      - "エラーになる"
    answer: 2
---

この章では、GitHub の新しいルール管理機能「Rulesets」について学びます。従来のブランチ保護ルールとの違いや、より柔軟な設定方法を解説します。

## Rulesetsとは

**Rulesets**は、2023年に導入されたGitHubの新しいルール管理機能です。ブランチやタグに対するルールを、より柔軟かつ一元的に管理できます。

### ブランチ保護ルールとの違い

| 項目 | ブランチ保護 | Rulesets |
|------|--------------|----------|
| 対象 | ブランチのみ | ブランチ + タグ |
| 適用範囲 | リポジトリ単位 | リポジトリ or Organization |
| バイパス | 管理者のみ | 柔軟に設定可能 |
| UI | 従来型 | 新しいUI |
| API | 従来API | 新しいAPI |
| ステータス | 有効/無効 | 有効/無効 + 評価モード |

### いつRulesetsを使うか

```
Rulesetsが適している:
- 複数リポジトリに同じルールを適用したい
- タグも保護したい
- 細かいバイパス権限を設定したい
- 新機能を活用したい

ブランチ保護が適している:
- シンプルな設定で十分
- 既存の設定を維持したい
- 従来のワークフローを変えたくない
```

## 設定場所

### リポジトリレベル

1. Settings → Rules → Rulesets
2. **New ruleset** → **New branch ruleset** または **New tag ruleset**

### Organizationレベル

1. Organization Settings → Rules → Rulesets
2. 複数リポジトリに一括適用可能

## Rulesetの作成

### 基本設定

| 項目 | 説明 |
|------|------|
| **Ruleset name** | ルールセットの名前 |
| **Enforcement status** | Active / Disabled / Evaluate |
| **Bypass list** | バイパスできるユーザー/チーム |
| **Target branches/tags** | 適用対象のパターン |

### Enforcement status

| ステータス | 説明 |
|------------|------|
| **Active** | ルールを強制 |
| **Disabled** | ルールを無効化 |
| **Evaluate** | 違反を記録するが強制しない（テスト用） |

### 評価モードの活用

新しいルールを導入する前のテストに便利：

```
1. Evaluate モードで設定
2. 1週間程度運用
3. 違反がないか確認
4. 問題なければ Active に変更
```

## 複数ブランチへの一括適用

### ターゲットパターン

```
# 完全一致
main

# ワイルドカード
release/*        # release/v1.0.0 などにマッチ
feature/**       # feature/auth/login などにもマッチ

# 除外パターン（fnmatchではないので注意）
# Includeで追加、Excludeで除外を指定
```

### 設定例

```
Include:
- Default branch (main)
- release/*
- hotfix/*

Exclude:
- release/test-*
```

## タグ保護ルール

### タグを保護する理由

1. **リリースの保護**: タグの誤削除を防止
2. **バージョン管理**: タグの上書きを禁止
3. **監査**: タグの作成者を制限

### 設定手順

1. New ruleset → **New tag ruleset**
2. Target tags にパターンを指定

```
# リリースタグを保護
v*

# セマンティックバージョニングのタグ
v[0-9]*.[0-9]*.[0-9]*
```

### タグルールのオプション

| ルール | 説明 |
|--------|------|
| **Restrict creations** | タグ作成を制限 |
| **Restrict updates** | タグの上書きを禁止 |
| **Restrict deletions** | タグの削除を禁止 |
| **Require signed tags** | 署名必須 |

## バイパス権限の設定

### バイパスリスト

特定のユーザー、チーム、またはアプリにルールのバイパスを許可：

```
バイパスできるアクター:
- Organization admin
- Repository admin
- 特定のチーム（例: release-managers）
- 特定のユーザー
- GitHub Apps（例: dependabot）
```

### バイパスモード

| モード | 説明 |
|--------|------|
| **Always** | 常にバイパス可能 |
| **Pull request only** | PR経由のみバイパス可能 |

### 設定例

```yaml
Bypass list:
- Organization admins: Always
- release-managers team: Pull request only
- dependabot[bot]: Always  # 自動PRのため
```

## ルールの種類

### ブランチルール

| ルール | 説明 |
|--------|------|
| **Restrict creations** | ブランチ作成を制限 |
| **Restrict updates** | 直接プッシュを制限 |
| **Restrict deletions** | ブランチ削除を禁止 |
| **Require linear history** | マージコミット禁止 |
| **Require deployments to succeed** | デプロイ成功を必須 |
| **Require signed commits** | 署名必須 |
| **Require a pull request before merging** | PR必須 |
| **Require status checks to pass** | CIチェック必須 |
| **Block force pushes** | force push禁止 |

### Pull Request ルール

| ルール | 説明 |
|--------|------|
| **Required approvals** | 必須承認数 |
| **Dismiss stale reviews** | 新コミットで承認取消 |
| **Require review from Code Owners** | CODEOWNERS承認必須 |
| **Require last push approval** | 最終プッシュの承認必須 |
| **Require conversation resolution** | 会話の解決必須 |

## 複数Rulesetの優先順位

複数のRulesetがマッチする場合、**すべてのルールが結合**されます：

```
例:
Ruleset A (main): 承認1件、CIチェック必須
Ruleset B (release/*): 承認2件

release/v1.0.0 にマッチ:
- 承認2件（より制限的な方）
- CIチェック必須（Ruleset Aから）
```

### 競合の解決

同じ設定で異なる値がある場合：
- 数値: より制限的な値を採用
- ブール: 制限的な方を採用（true > false）

---

## 中級者向けTips

### GitHub API での管理

```bash
# Rulesetの一覧を取得
gh api repos/{owner}/{repo}/rulesets

# Rulesetの詳細を取得
gh api repos/{owner}/{repo}/rulesets/{ruleset_id}

# Rulesetを作成
gh api repos/{owner}/{repo}/rulesets \
  --method POST \
  --field name='main-protection' \
  --field enforcement='active' \
  ...
```

### Organization全体への適用

```yaml
# Organization Ruleset
name: org-wide-protection
enforcement: active
target_repositories:
  - all  # 全リポジトリに適用

conditions:
  ref_name:
    include:
      - refs/heads/main
    exclude: []

rules:
  - type: pull_request
    parameters:
      required_approving_review_count: 1
      dismiss_stale_reviews_on_push: true
```

### 評価モードのログ確認

```bash
# ルール評価のログを取得
gh api repos/{owner}/{repo}/rulesets/rule-suites
```

### ブランチ保護からの移行

```bash
# 既存のブランチ保護ルールを確認
gh api repos/{owner}/{repo}/branches/main/protection

# Rulesetに設定を移行後
# ブランチ保護ルールを削除
gh api repos/{owner}/{repo}/branches/main/protection \
  --method DELETE
```

---

## まとめ

| 項目 | 内容 |
|------|------|
| 対象 | ブランチ + タグ |
| 適用範囲 | リポジトリ / Organization |
| バイパス | ユーザー/チーム/アプリ単位で柔軟に |
| ステータス | Active / Disabled / Evaluate |

### Rulesetsのベストプラクティス

1. **評価モードでテスト**: 本番適用前に影響を確認
2. **Organization レベルで管理**: 複数リポジトリに一括適用
3. **バイパスは最小限に**: 必要な場合のみ許可
4. **タグも保護**: リリースタグの誤操作を防止
5. **命名規則を統一**: ルールセット名でわかりやすく

### 推奨設定例

```yaml
Ruleset: main-protection
Enforcement: Active

Bypass list:
- Organization admins (Always)

Target branches:
- Include: Default branch

Rules:
- Require a pull request before merging
  - Required approvals: 1
  - Dismiss stale reviews on push: true
  - Require review from Code Owners: true
- Require status checks to pass
  - Required checks: test, lint
  - Require branches to be up to date: true
- Block force pushes
- Restrict deletions
```

次の章では、CODEOWNERS設定について学びます。
