---
title: "基本的なGit操作"
quiz:
  - question: "Gitの3つの状態について正しい順序はどれですか?"
    options:
      - "リポジトリ → ステージングエリア → 作業ディレクトリ"
      - "作業ディレクトリ → ステージングエリア → リポジトリ"
      - "ステージングエリア → 作業ディレクトリ → リポジトリ"
      - "作業ディレクトリ → リポジトリ → ステージングエリア"
    answer: 1
  - question: "git pullコマンドは何と何を組み合わせたものですか?"
    options:
      - "add + commit"
      - "fetch + push"
      - "fetch + merge"
      - "commit + push"
    answer: 2
  - question: "コミットメッセージのプレフィックスで、新機能追加を表すものはどれですか?"
    options:
      - "fix:"
      - "feat:"
      - "docs:"
      - "chore:"
    answer: 1
---

この章では、Git の基本操作であるコミット、プッシュ、プルを学びます。これらは日常的に最も使う操作です。

## Gitの初期設定

初めてGitを使う場合、ユーザー情報を設定します。

```bash
# 必須設定
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"

# 推奨設定
git config --global init.defaultBranch main    # デフォルトブランチ名
git config --global core.editor "code --wait"  # エディタ（VS Code）
git config --global pull.rebase false          # pullの挙動

# 設定確認
git config --list
```

## ステージングエリアの理解

Gitには3つの状態があります。

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   作業ディレクトリ  │     │  ステージングエリア │     │   リポジトリ      │
│  (Working Dir)  │────▶│   (Staging Area) │────▶│   (Repository)  │
│                 │ add │                 │commit│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
      ↑                                                │
      └────────────────────────────────────────────────┘
                        checkout / reset
```

| 状態 | 説明 |
|------|------|
| **作業ディレクトリ** | 実際にファイルを編集する場所 |
| **ステージングエリア** | 次のコミットに含める変更を置く場所 |
| **リポジトリ** | コミットされた変更履歴 |

### なぜステージングエリアがあるのか

```bash
# 例：3つのファイルを変更したが、2つだけコミットしたい
git add file1.js file2.js
git commit -m "機能Aを実装"

# 残りは別のコミットに
git add file3.js
git commit -m "機能Bを実装"
```

:::note
ステージングエリアがあることで、1つのコミットに含める変更を細かく制御できます。
:::

## コミットの作成

### 基本的な流れ

```bash
# 1. 変更状態を確認
git status

# 2. 変更をステージングに追加
git add <ファイル名>

# 3. コミット
git commit -m "コミットメッセージ"
```

### addのオプション

```bash
# 特定のファイルを追加
git add file1.js file2.js

# 特定のディレクトリを追加
git add src/

# すべての変更を追加
git add .

# すべての変更を追加（削除も含む）
git add -A

# 対話的に追加（部分的な変更をステージング）
git add -p
```

### commitのオプション

```bash
# 基本
git commit -m "コミットメッセージ"

# 複数行のメッセージ
git commit -m "タイトル" -m "詳細な説明"

# エディタでメッセージを書く
git commit

# add と commit を同時に（追跡済みファイルのみ）
git commit -am "メッセージ"

# 直前のコミットを修正
git commit --amend
```

### コミットメッセージの書き方

```
<種類>: <要約>（50文字以内）

<本文>（任意、72文字で折り返し）

<フッター>（任意）
```

例：
```
feat: ユーザー認証機能を追加

- ログイン/ログアウト機能を実装
- セッション管理を追加
- パスワードハッシュ化を実装

Closes #123
```

<details>
<summary>種類のプレフィックス（Conventional Commits）</summary>
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみ
- `style`: フォーマット変更（動作に影響なし）
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルドプロセスや補助ツールの変更
</details>

## プッシュとプル

### プッシュ（Push）

ローカルのコミットをリモートに送信します。

```bash
# 基本
git push origin main

# 初回（上流ブランチを設定）
git push -u origin main

# 上流ブランチ設定後
git push

# 強制プッシュ（⚠️注意が必要）
git push --force-with-lease
```

### プル（Pull）

リモートの変更をローカルに取り込みます。

```bash
# 基本
git pull origin main

# 上流ブランチ設定後
git pull

# リベースでプル
git pull --rebase
```

### プッシュとプルの関係

```
ローカル                           リモート（GitHub）
┌─────────┐                       ┌─────────┐
│ commit  │                       │ commit  │
│ commit  │─────── push ─────────▶│ commit  │
│ commit  │                       │ commit  │
│         │◀────── pull ──────────│ (新commit)│
└─────────┘                       └─────────┘
```

### フェッチ（Fetch）

リモートの情報を取得するだけ（マージしない）：

```bash
# リモートの最新情報を取得
git fetch origin

# 全てのリモートを取得
git fetch --all

# 削除されたブランチの参照を削除
git fetch --prune
```

```
pull = fetch + merge
```

## 変更の確認

### status - 現在の状態

```bash
git status

# 短縮形式
git status -s
# M  modified.js      # 変更あり（ステージング済み）
# A  new-file.js      # 新規追加
# D  deleted.js       # 削除
# ?? untracked.js     # 追跡されていない
```

### diff - 差分の確認

```bash
# 作業ディレクトリの変更（ステージング前）
git diff

# ステージングエリアの変更
git diff --staged

# 特定のコミット間の差分
git diff commit1 commit2

# ファイル名のみ表示
git diff --name-only
```

### log - 履歴の確認

```bash
# 基本
git log

# 1行表示
git log --oneline

# グラフ表示
git log --oneline --graph

# 直近n件
git log -n 5

# 特定ファイルの履歴
git log -- path/to/file

# 検索
git log --grep="キーワード"
```

## 変更の取り消し

### ステージングの取り消し

```bash
# 特定のファイルをステージングから除外
git restore --staged file.js

# すべてをステージングから除外
git restore --staged .

# 旧コマンド
git reset HEAD file.js
```

### 作業ディレクトリの変更を取り消し

```bash
# 特定のファイルの変更を破棄
git restore file.js

# すべての変更を破棄
git restore .

# 旧コマンド
git checkout -- file.js
```

:::caution
`git restore` で破棄した変更は復元できません。注意してください。
:::

### コミットの取り消し

```bash
# 直前のコミットを取り消し（変更は残す）
git reset --soft HEAD~1

# 直前のコミットを取り消し（ステージングも解除）
git reset HEAD~1

# 直前のコミットを完全に取り消し（変更も破棄）⚠️
git reset --hard HEAD~1

# 取り消しをコミットとして記録（安全）
git revert HEAD
```

| コマンド | 変更 | ステージング | コミット |
|----------|------|--------------|----------|
| `reset --soft` | 残る | 残る | 消える |
| `reset (--mixed)` | 残る | 消える | 消える |
| `reset --hard` | 消える | 消える | 消える |
| `revert` | 新コミット | - | 履歴に残る |

## 一時的な変更の退避（Stash）

作業中の変更を一時的に退避できます。

```bash
# 変更を退避
git stash

# メッセージ付きで退避
git stash save "作業中の機能"

# 退避した一覧
git stash list

# 最新のstashを復元
git stash pop

# 特定のstashを復元
git stash apply stash@{1}

# stashの内容を確認
git stash show -p stash@{0}

# stashを削除
git stash drop stash@{0}

# 全てのstashを削除
git stash clear
```

:::note
ブランチを切り替える前に、コミットできない変更がある場合に便利です。
:::

---

## 中級者向けTips

### インタラクティブなステージング

```bash
git add -p

# 選択肢
# y - このハンクをステージング
# n - スキップ
# s - ハンクを分割
# e - 手動で編集
```

### コミットの整理（rebase -i）

```bash
# 直近3つのコミットを整理
git rebase -i HEAD~3

# エディタで操作を選択
# pick - そのまま
# reword - メッセージ変更
# squash - 前のコミットと統合
# drop - 削除
```

### reflog - 全ての操作履歴

`reset --hard` で消したコミットも復元可能：

```bash
git reflog
# abc1234 HEAD@{0}: reset: moving to HEAD~1
# def5678 HEAD@{1}: commit: 重要なコミット

# 復元
git reset --hard def5678
```

### エイリアスの設定

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm "commit -m"
git config --global alias.lg "log --oneline --graph --all"

# 使用例
git st
git lg
```

---

## まとめ

| 操作 | コマンド | 説明 |
|------|----------|------|
| 状態確認 | `git status` | 変更状態を確認 |
| 差分確認 | `git diff` | 変更内容を確認 |
| ステージング | `git add` | コミット対象に追加 |
| コミット | `git commit` | 変更を記録 |
| プッシュ | `git push` | リモートに送信 |
| プル | `git pull` | リモートから取得 |
| 取り消し | `git restore` | 変更を破棄 |
| 退避 | `git stash` | 一時保存 |

次の章では、ブランチ管理について学びます。
