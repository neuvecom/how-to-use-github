---
title: "プルリクエスト（PR）"
---

# プルリクエスト（PR）

この章では、プルリクエストの作成からマージまでの流れを学びます。PRはGitHubでのコラボレーションの中心となる機能です。

## プルリクエストとは

**プルリクエスト（Pull Request / PR）**は、あるブランチの変更を別のブランチに取り込んでもらうためのリクエストです。

```
1. 機能ブランチで開発
2. PRを作成
3. レビューを受ける
4. 修正があれば対応
5. 承認されたらマージ
```

:::note
GitLabでは「マージリクエスト（MR）」と呼びます。同じ概念です。


## PRの作成

### GitHub UIから

1. リポジトリページで「Pull requests」タブ
2. 「New pull request」をクリック
3. baseブランチ（マージ先）とcompareブランチ（変更元）を選択
4. 「Create pull request」をクリック
5. タイトルと説明を入力
6. 「Create pull request」で作成

### コマンドラインから

```bash
# プッシュ後にブラウザでPRを開く
git push -u origin feature-branch
# 表示されるURLをクリック

# GitHub CLIでPRを作成
gh pr create --title "機能追加" --body "詳細説明"

# インタラクティブに作成
gh pr create

# ドラフトPRを作成
gh pr create --draft

# レビュアーを指定
gh pr create --reviewer username1,username2
```

### VSCodeから

GitHub Pull Requests 拡張機能をインストールすると、VSCodeから直接PRを作成・管理できます。

## PRの説明の書き方

### 基本構成

```markdown
## 概要
このPRで何を行うかの簡潔な説明

## 変更内容
- 変更点1
- 変更点2
- 変更点3

## 関連Issue
Closes #123

## スクリーンショット（UIの変更がある場合）
| Before | After |
|--------|-------|
| ![before](url) | ![after](url) |

## テスト方法
1. `npm install` を実行
2. `npm run dev` でサーバー起動
3. http://localhost:3000/login にアクセス

## チェックリスト
- [ ] テストを追加した
- [ ] ドキュメントを更新した
- [ ] 破壊的変更がないことを確認した
```

### Issue との連携

特定のキーワードを使うと、PRがマージされたときにIssueが自動的にクローズされます：

```markdown
# 以下のキーワードが使える
Closes #123
Fixes #123
Resolves #123

# 複数のIssue
Closes #123, #456, #789
```

## ドラフトPR

作業中のPRは「ドラフト」として作成できます。

### ドラフトPRの用途

- **WIP（Work In Progress）**: 作業中であることを明示
- **早期フィードバック**: 完成前にレビューをもらいたい
- **CI確認**: テストが通るか確認したい

### ドラフトの作成と解除

```bash
# ドラフトとして作成
gh pr create --draft

# ドラフトを解除してレビュー準備完了
gh pr ready
```

GitHub UIでは「Convert to draft」「Ready for review」ボタンで切り替えます。

## PRテンプレート

リポジトリにテンプレートを設置すると、PR作成時に自動的に適用されます。

### 設置場所

以下のいずれかに配置：
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/PULL_REQUEST_TEMPLATE/default.md`
- `docs/PULL_REQUEST_TEMPLATE.md`

### テンプレート例

```markdown
## 概要
<!-- このPRで何を行うか簡潔に -->

## 変更種別
- [ ] 新機能
- [ ] バグ修正
- [ ] リファクタリング
- [ ] ドキュメント
- [ ] その他

## 関連Issue
<!-- 関連するIssue番号 -->
Closes #

## 変更内容
<!-- 具体的な変更点をリストで -->
-

## テスト方法
<!-- レビュアーが確認できる手順 -->
1.

## スクリーンショット
<!-- UIの変更がある場合 -->

## チェックリスト
- [ ] セルフレビューを行った
- [ ] コードにコメントを追加した（必要な場合）
- [ ] テストを追加・更新した
- [ ] ドキュメントを更新した（必要な場合）
```

### 複数のテンプレート

`.github/PULL_REQUEST_TEMPLATE/` ディレクトリに複数のテンプレートを置くことができます：

```
.github/PULL_REQUEST_TEMPLATE/
├── feature.md
├── bugfix.md
└── documentation.md
```

使用時は `?template=feature.md` をURLに追加します。

## レビュアーの指定

### 指定方法

1. PR作成時またはサイドバーで「Reviewers」
2. ユーザー名またはチーム名を選択

```bash
# GitHub CLI
gh pr create --reviewer username1,username2

# 既存のPRにレビュアーを追加
gh pr edit --add-reviewer username
```

### CODEOWNERS との連携

CODEOWNERSを設定すると、変更されたファイルに応じて自動でレビュアーが割り当てられます。

## ラベルの活用

ラベルを使ってPRを分類できます。

### よく使うラベル

| ラベル | 用途 |
|--------|------|
| `bug` | バグ修正 |
| `enhancement` | 機能追加 |
| `documentation` | ドキュメント |
| `breaking-change` | 破壊的変更 |
| `needs-review` | レビュー待ち |
| `wip` | 作業中 |

```bash
# ラベルを追加
gh pr edit --add-label "bug,priority-high"
```

## マイルストーンとの連携

マイルストーンを設定すると、リリース計画と連携できます。

1. PR作成時またはサイドバーで「Milestone」
2. 既存のマイルストーンを選択

```bash
gh pr edit --milestone "v1.0.0"
```

## マージ方法の選択

### 3つのマージ方法

#### 1. Create a merge commit

```
main     ●────●────────────●（マージコミット）
              │            ↑
feature       └──●──●──●───┘
```

- すべてのコミット履歴が残る
- マージコミットが作成される
- 最も一般的な方法

#### 2. Squash and merge

```
Before:
feature  ●──●──●──●

After:
main     ●────●────●（1つのコミットに統合）
```

- 複数のコミットが1つにまとまる
- コミット履歴がきれいになる
- 細かい作業コミットを隠せる

#### 3. Rebase and merge

```
main     ●────●────●'──●'──●'
                   ↑
            featureのコミットが付け替え
```

- コミットがmainの先頭に付け替え
- マージコミットが作成されない
- 直線的な履歴になる

### 選択指針

| 状況 | 推奨 |
|------|------|
| チーム開発で履歴を残したい | Merge commit |
| 細かいコミットをまとめたい | Squash |
| 履歴を直線的に保ちたい | Rebase |

### リポジトリ設定で制限

Settings → General → Pull Requests で、許可するマージ方法を設定できます。

## 自動マージ設定

条件を満たしたら自動でマージする設定です。

### 有効化

1. Settings → General → Pull Requests
2. 「Allow auto-merge」にチェック

### 使用方法

PRページで「Enable auto-merge」をクリックし、マージ方法を選択します。

```
自動マージの条件:
- 必須のレビューが承認されている
- 必須のステータスチェックが通っている
- コンフリクトがない
```

---

## 中級者向けTips

### PR の差分を確認

```bash
# PRの差分を表示
gh pr diff 123

# PRをローカルでチェックアウト
gh pr checkout 123
```

### コンフリクトの解決

PRにコンフリクトがある場合：

```bash
# 最新のmainを取り込む
git fetch origin
git checkout feature-branch
git merge origin/main

# コンフリクトを解決してコミット
git add .
git commit -m "resolve conflicts"
git push
```

GitHub UIでも簡単なコンフリクトは解決できます。

### PRのレビューコメントへの対応

```bash
# コメントに対応するコミットを追加
git commit -m "address review comments"
git push

# またはコミットを修正
git commit --amend
git push --force-with-lease
```

### PR の状態確認

```bash
# PRの一覧
gh pr list

# 自分がレビュアーのPR
gh pr list --reviewer @me

# 特定のPRの詳細
gh pr view 123

# PRのチェック状態
gh pr checks 123
```

### ブランチ削除の自動化

Settings → General → Pull Requests で「Automatically delete head branches」を有効にすると、マージ後にブランチが自動削除されます。

---

## まとめ

| 項目 | ポイント |
|------|----------|
| PR作成 | 明確なタイトルと説明を書く |
| ドラフト | 作業中は Draft PR を活用 |
| テンプレート | チームで統一フォーマット |
| レビュアー | CODEOWNERS で自動割り当て |
| マージ方法 | チームで方針を決める |

### PRのベストプラクティス

1. **小さく保つ**: レビューしやすいサイズ（300行以下推奨）
2. **1つの目的**: 1PR = 1機能 or 1修正
3. **説明を丁寧に**: レビュアーの時間を節約
4. **セルフレビュー**: 提出前に自分で確認

次の章では、コードレビューの方法を学びます。
