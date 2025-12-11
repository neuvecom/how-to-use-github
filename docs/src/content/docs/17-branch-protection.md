---
title: "ブランチ保護ルール"
---

# ブランチ保護ルール

この章では、mainブランチへの直接プッシュ禁止、PR必須化、必須レビュー数の設定など、ブランチ保護ルールの詳細を学びます。

## ブランチ保護とは

**ブランチ保護**は、重要なブランチ（通常はmain）に対して、特定のルールを強制する機能です。

### 保護する目的

1. **コード品質の維持**: レビューなしのマージを防止
2. **CI/CDの確保**: テストが通らないコードをブロック
3. **事故の防止**: 誤った force push から保護
4. **コンプライアンス**: 監査要件への対応

## 設定場所

1. リポジトリの **Settings**
2. 左メニューの **Branches**
3. **Branch protection rules** セクション
4. **Add rule** または既存ルールを編集

## mainへの直接プッシュ禁止

### 設定手順

1. Branch name pattern に `main` を入力
2. **Require a pull request before merging** にチェック

```
これにより:
✅ PRを経由したマージのみ許可
❌ git push origin main は拒否される
```

### 動作確認

```bash
# 直接プッシュしようとすると...
git push origin main

# エラーになる
remote: error: GH006: Protected branch update failed
remote: error: Required pull request reviews not satisfied
```

## PR必須化の設定

### Require a pull request before merging

| サブオプション | 説明 |
|----------------|------|
| **Require approvals** | 承認が必要 |
| **Dismiss stale pull request approvals** | 新コミットで承認を無効化 |
| **Require review from Code Owners** | CODEOWNERSの承認必須 |
| **Require approval of the most recent push** | 最新プッシュの承認必須 |

### 必須承認数の設定

「Required number of approvals before merging」で1〜6を選択：

| チーム規模 | 推奨承認数 |
|------------|------------|
| 1〜3人 | 1 |
| 4〜10人 | 1〜2 |
| 10人以上 | 2以上 |

### 承認の取り消し（Dismiss stale approvals）

新しいコミットがプッシュされたら、既存の承認を無効にする設定：

```
メリット:
- 承認後の変更も必ずレビューされる
- 意図しない変更の混入を防止

デメリット:
- 軽微な修正でも再承認が必要
- レビュアーの負担増
```

## ステータスチェック必須化

### Require status checks to pass before merging

CI/CDの結果をマージ条件にします。

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:  # ← このジョブ名を必須チェックに設定
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test

  lint:  # ← このジョブ名も必須チェックに追加可能
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        run: npm run lint
```

### 設定手順

1. **Require status checks to pass before merging** にチェック
2. 検索ボックスでジョブ名を検索（例: `test`, `lint`）
3. 必須にしたいチェックを選択

### Require branches to be up to date before merging

マージ前にbaseブランチ（main）と同期することを必須にします：

```
有効にすると:
- PRブランチがmainの最新に追随している必要がある
- 「Update branch」ボタンでワンクリック同期
```

## 管理者への適用

### Do not allow bypassing the above settings

デフォルトでは、リポジトリ管理者（Admin）は保護ルールをバイパスできます。

このオプションを有効にすると、管理者も同じルールに従う必要があります。

```
推奨:
- 本番環境に影響するリポジトリ → 有効
- 個人プロジェクト → 無効でも可
```

## 署名付きコミット必須化

### Require signed commits

すべてのコミットにGPG署名を必須にします。

```bash
# 署名付きコミットの確認
git log --show-signature

# 署名付きでコミット
git commit -S -m "メッセージ"

# 常に署名する設定
git config --global commit.gpgsign true
```

### 設定する理由

1. **なりすまし防止**: コミッターの本人確認
2. **監査対応**: コードの出所を証明
3. **セキュリティ**: サプライチェーン攻撃対策

## 線形履歴の強制

### Require linear history

マージコミットを禁止し、履歴を直線的に保ちます。

```
許可されるマージ方法:
✅ Squash and merge
✅ Rebase and merge
❌ Create a merge commit
```

### 効果

```
非線形履歴:
●────●────●
     │    ↑
     └──●─┘

線形履歴:
●────●────●────●────●
```

## Force Push の制限

### Allow force pushes

| 設定 | 説明 |
|------|------|
| **Disabled** | 完全に禁止（推奨） |
| **Everyone** | 全員に許可（非推奨） |
| **Specify who can force push** | 特定ユーザーのみ許可 |

### ブランチ削除の制限

**Allow deletions** をオフにすると、保護ブランチの削除を禁止できます。

## ルールの優先順位

複数のルールがある場合、**最も制限的なルール**が適用されます：

```
例:
ルール1: main → 承認1件必須
ルール2: main* → 承認2件必須

main ブランチには両方がマッチ → 2件必須（より制限的）
```

---

## 中級者向けTips

### ワイルドカードパターン

```
main          # 完全一致
release/*     # release/v1.0.0 などにマッチ
feature/**    # feature/auth/login などにもマッチ
*             # 全ブランチ
```

### 設定のエクスポート/インポート

GitHub CLI でルールを確認：

```bash
gh api repos/{owner}/{repo}/branches/main/protection
```

### 一時的なルール緩和

緊急時に管理者がバイパスする場合：

1. 「Do not allow bypassing」を一時的にオフ
2. 緊急修正を実施
3. 設定を元に戻す
4. 監査ログに記録

:::caution
緊急時でもルールを緩和した理由を必ず記録してください。


### Terraformでの管理

```hcl
resource "github_branch_protection" "main" {
  repository_id = github_repository.example.node_id
  pattern       = "main"

  required_pull_request_reviews {
    required_approving_review_count = 2
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = true
  }

  required_status_checks {
    strict   = true
    contexts = ["test", "lint"]
  }

  enforce_admins = true
}
```

---

## まとめ

| 設定 | 説明 | 推奨 |
|------|------|------|
| PR必須 | 直接プッシュを禁止 | ✅ 必須 |
| 承認必須 | レビューなしマージを禁止 | ✅ 必須 |
| ステータスチェック | CI通過を必須 | ✅ 必須 |
| 承認取り消し | 新コミットで再レビュー | プロジェクトによる |
| 管理者適用 | 管理者もルールに従う | ✅ 推奨 |
| 署名必須 | GPG署名を強制 | セキュリティ要件による |

### 推奨設定（小〜中規模チーム）

```
Branch name pattern: main

✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale pull request approvals when new commits are pushed
  ✅ Require review from Code Owners

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  - test
  - lint

✅ Do not allow bypassing the above settings
```

次の章では、Rulesetsについて学びます。
