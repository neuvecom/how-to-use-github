---
title: "ブランチ管理"
quiz:
  - question: "ブランチを作成して同時に切り替えるコマンドはどれですか?(Git 2.23以降)"
    options:
      - "git branch -c feature"
      - "git checkout -b feature"
      - "git switch -c feature"
      - "git create feature"
    answer: 2
  - question: "Fast-forwardマージが発生する条件はどれですか?"
    options:
      - "マージ先のブランチが進んでいる場合"
      - "マージ先のブランチが進んでいない場合"
      - "コンフリクトがある場合"
      - "複数人が同時に作業している場合"
    answer: 1
  - question: "リベース(rebase)の注意点として正しいものはどれですか?"
    options:
      - "マージコミットが作成される"
      - "プッシュ済みのブランチでは危険"
      - "履歴が複雑になる"
      - "必ずコンフリクトが発生する"
    answer: 1
---

この章では、ブランチの作成・削除・切り替えと、GitHubでのブランチ保護ルールの設定方法を学びます。

## ブランチとは

**ブランチ（Branch）**は、開発の流れを分岐させる機能です。メインの開発ラインに影響を与えずに、新機能開発やバグ修正を行えます。

```
main     ●────●────●────●────●────●
              │              ↑
feature       └──●──●──●────┘
                    マージ
```

### ブランチを使う理由

1. **並行開発**: 複数の機能を同時に開発
2. **安全な実験**: 失敗してもmainに影響なし
3. **コードレビュー**: PRでレビュー後にマージ
4. **リリース管理**: 本番・開発・機能ごとに分離

## ブランチの作成

### コマンドラインから

```bash
# ブランチを作成
git branch feature-login

# ブランチを作成して切り替え
git checkout -b feature-login

# Git 2.23以降の推奨コマンド
git switch -c feature-login

# 特定のコミットからブランチを作成
git switch -c hotfix abc1234
```

### GitHub UIから

1. リポジトリページで「main」ドロップダウンをクリック
2. 新しいブランチ名を入力
3. 「Create branch: xxx from 'main'」をクリック

## ブランチの切り替え

```bash
# ブランチを切り替え
git checkout feature-login

# Git 2.23以降の推奨コマンド
git switch feature-login

# 1つ前のブランチに戻る
git switch -
```

:::caution
未コミットの変更がある状態で切り替えると、変更が失われる可能性があります。コミットするか `git stash` で退避してください。
:::

## ブランチの一覧と確認

```bash
# ローカルブランチの一覧
git branch

# リモートブランチも含む
git branch -a

# 現在のブランチを確認
git branch --show-current

# 各ブランチの最新コミット
git branch -v

# マージ済みブランチ
git branch --merged

# 未マージブランチ
git branch --no-merged
```

## ブランチの削除

### ローカルブランチの削除

```bash
# マージ済みブランチを削除
git branch -d feature-login

# 強制削除（未マージでも削除）
git branch -D feature-login

# 複数ブランチを一括削除
git branch -d branch1 branch2 branch3
```

### リモートブランチの削除

```bash
# リモートブランチを削除
git push origin --delete feature-login

# GitHub CLI
gh pr close --delete-branch

# 古いリモート追跡ブランチを掃除
git fetch --prune
```

### GitHub UIから削除

1. Code → Branches
2. 削除したいブランチの右側にあるゴミ箱アイコン

:::note
PRがマージされると、「Delete branch」ボタンが表示されます。
:::

## ブランチのマージ

### 基本的なマージ

```bash
# mainブランチに切り替え
git switch main

# featureブランチをマージ
git merge feature-login
```

### マージの種類

#### 1. Fast-forward マージ

mainが進んでいない場合、単純にポインタを移動：

```
Before:
main     ●────●
              │
feature       └──●──●

After:
main     ●────●──●──●
                    ↑
              feature
```

```bash
git merge feature-login
# Fast-forward
```

#### 2. 3-way マージ

mainも進んでいる場合、マージコミットを作成：

```
Before:
main     ●────●────●
              │
feature       └──●──●

After:
main     ●────●────●────●（マージコミット）
              │         │
feature       └──●──●───┘
```

```bash
git merge feature-login
# Merge made by the 'ort' strategy.
```

#### 3. Squash マージ

複数のコミットを1つにまとめてマージ：

```bash
git merge --squash feature-login
git commit -m "feature: ログイン機能を追加"
```

### マージの選択指針

| 状況 | 推奨 |
|------|------|
| 単純な機能追加 | Fast-forward または Squash |
| 長期間の開発ブランチ | 3-way マージ |
| 細かいコミット履歴を残したくない | Squash |

## デフォルトブランチの設定

### GitHubでの設定

1. リポジトリの **Settings**
2. **General** → **Default branch**
3. 変更したいブランチを選択 → **Update**

### ローカルの設定

```bash
# 新規リポジトリのデフォルトブランチ
git config --global init.defaultBranch main
```

## ブランチ保護ルール（基本）

:::note
詳細な設定は「第5部：ルール設定編」で解説します。ここでは基本的な概念を紹介します。
:::

### ブランチ保護とは

特定のブランチ（通常はmain）に対して、直接プッシュを禁止したり、PRを必須にしたりする設定です。

### 基本的な設定項目

| 設定 | 説明 |
|------|------|
| **Require a pull request** | 直接プッシュ禁止、PR必須 |
| **Require approvals** | レビュー承認が必要 |
| **Require status checks** | CIが通らないとマージ不可 |
| **Require branches to be up to date** | main と同期必須 |

### 設定場所

1. リポジトリの **Settings**
2. **Branches** → **Branch protection rules**
3. **Add rule**

```
Branch name pattern: main
```

## ブランチの同期

### リモートの変更を取り込む

```bash
# 現在のブランチにリモートの変更をマージ
git pull origin main

# リベースで取り込む
git pull --rebase origin main
```

### 他のブランチの変更を取り込む

```bash
# featureブランチにいる状態で
# mainの最新を取り込む

# マージで取り込む
git merge main

# リベースで取り込む（履歴がきれいになる）
git rebase main
```

### リベース vs マージ

```
マージ:
main     ●────●────●────────●
              │              ↑マージコミット
feature       └──●──●────────┘

リベース:
main     ●────●────●
                   │
feature            └──●'──●'（コミットが付け替えられる）
```

| 方法 | メリット | デメリット |
|------|----------|------------|
| マージ | 履歴が正確、安全 | マージコミットで履歴が複雑 |
| リベース | 履歴がきれい | プッシュ済みブランチでは危険 |

:::caution
**リベースの注意点**: プッシュ済みのブランチをリベースすると、チームメンバーとの同期が困難になります。ローカルのみ、または個人ブランチでのみ使用してください。
:::

---

## 中級者向けTips

### ブランチの追跡設定

```bash
# 上流ブランチを設定
git branch --set-upstream-to=origin/feature feature

# または
git push -u origin feature
```

### ブランチ名の変更

```bash
# ローカルブランチの名前を変更
git branch -m old-name new-name

# 現在のブランチの名前を変更
git branch -m new-name

# リモートに反映（旧ブランチ削除＋新ブランチプッシュ）
git push origin :old-name new-name
git push -u origin new-name
```

### Cherry-pick

特定のコミットだけを取り込む：

```bash
# 特定のコミットを現在のブランチに適用
git cherry-pick abc1234

# 複数のコミット
git cherry-pick abc1234 def5678

# コミットせずに変更だけ適用
git cherry-pick -n abc1234
```

### ブランチの比較

```bash
# 2つのブランチの差分
git diff main..feature

# コミット数の差分
git rev-list --count main..feature

# 共通の祖先からの差分
git diff main...feature
```

### Worktree（複数ブランチを同時に作業）

```bash
# 別ディレクトリで別ブランチをチェックアウト
git worktree add ../project-feature feature-branch

# worktreeの一覧
git worktree list

# 削除
git worktree remove ../project-feature
```

---

## まとめ

| 操作 | コマンド |
|------|----------|
| ブランチ作成 | `git switch -c <name>` |
| ブランチ切り替え | `git switch <name>` |
| ブランチ一覧 | `git branch -a` |
| ブランチ削除 | `git branch -d <name>` |
| マージ | `git merge <name>` |
| リベース | `git rebase <name>` |

### ベストプラクティス

1. **mainブランチを保護**: 直接プッシュを禁止
2. **小さなブランチ**: 1つの機能につき1ブランチ
3. **こまめにマージ**: 長期間分岐しない
4. **命名規則を決める**: `feature/`, `fix/`, `hotfix/` など

次の章では、プルリクエスト（PR）の作成方法を学びます。
