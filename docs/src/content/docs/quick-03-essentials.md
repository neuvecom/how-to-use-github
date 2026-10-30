---
title: "毎日使う5つの操作"
quiz:
  - question: "作業を始める前に、まず実行しておくべき操作はどれですか?"
    options:
      - "git push --force"
      - "mainを最新にしてから作業用ブランチを作る"
      - "リポジトリを削除して作り直す"
      - "すべてのブランチを削除する"
    answer: 1
  - question: "コミットする前に、何が変更されたかを確認するコマンドの組み合わせはどれですか?"
    options:
      - "git status と git diff"
      - "git clone と git init"
      - "git merge と git rebase"
      - "git tag と git log --graph"
    answer: 0
  - question: "pushしたあとに同じブランチで修正を重ねたとき、PRはどうなりますか?"
    options:
      - "新しいPRを作り直す必要がある"
      - "同じブランチにpushすれば、既存のPRに自動で追加される"
      - "PRは自動的に閉じられる"
      - "mainに直接反映される"
    answer: 1
---

この章で学ぶこと

- 毎日の作業でくり返す5つの操作
- それぞれの操作で使うコマンドと画面
- 1日の作業の流れ

## なぜ5つに絞るのか

Gitには数百のコマンドとオプションがありますが、毎日の作業で使うものはごく一部です。まずは次の5つを、手が覚えるまでくり返すのが近道です。

| 操作 | やること | 主なコマンド |
|------|----------|--------------|
| 1. 最新にする | mainを最新にしてからブランチを作る | `git pull` / `git switch -c` |
| 2. 確認する | 何が変わったかを見る | `git status` / `git diff` |
| 3. 記録する | 変更をコミットする | `git add` / `git commit` |
| 4. 共有する | GitHubに送ってPRを出す | `git push` |
| 5. 取り込む | レビューを受けてマージする | 「Pull requests」タブ |

## 1. 最新にする

作業を始める前に、必ずmainを最新にしてからブランチを作ります。古いmainから作業を始めると、あとで衝突（コンフリクト）が起きやすくなります。

```bash
git switch main
git pull
git switch -c feature/add-login
```

ブランチ名は「何をするか」がわかる名前にします（[ブランチ命名規則](/how-to-use-github/13-branch-naming/)）。

## 2. 確認する

コミットする前に、何が変わったかを必ず確認します。

```bash
git status   # どのファイルが変わったか
git diff     # 具体的にどの行が変わったか
```

:::note
意図しないファイル（パスワードを書いた設定ファイル、ビルド結果など）が混ざっていないかは、ここで見つけます。混ぜたくないファイルは `.gitignore` に書いておきましょう。
:::

## 3. 記録する

意味のある区切りごとにコミットします。1つのコミットには1つの目的、を心がけます。

```bash
git add src/login.js
git commit -m "ログインフォームを追加"
```

メッセージは「何をしたか」が一目でわかるように書きます（[コミットメッセージ規約](/how-to-use-github/14-commit-conventions/)）。

## 4. 共有する

```bash
git push -u origin feature/add-login   # 初回
git push                               # 2回目以降
```

初回のpush後にGitHubでPRを作ります。レビューで修正を頼まれたら、同じブランチでコミットしてpushするだけで、既存のPRに自動で追加されます。

## 5. 取り込む

1. 「Pull requests」タブで自分のPRを開く
2. レビューのコメントに対応し、承認（Approve）をもらう
3. 自動テスト（Actions）が通っていることを確認する
4. 「Merge pull request」を押し、不要になったブランチを削除する

:::caution
`git push --force` は他の人の作業を消してしまうことがあります。共有しているブランチでは使わないのが原則です（[よくあるトラブルと解決法](/how-to-use-github/46-troubleshooting/)）。
:::

## 1日の作業の流れ

```
朝      : git switch main && git pull → git switch -c 作業ブランチ
作業中  : 編集 → git status / git diff → git add → git commit（くり返す）
区切り  : git push → PRを作成・更新
レビュー: コメントに対応 → push → 承認されたらマージ
```

## まとめ

| 操作 | 覚え方 |
|------|--------|
| 最新にする | 作業前に必ず `git pull` |
| 確認する | コミット前に `git status` と `git diff` |
| 記録する | 1コミット1目的 |
| 共有する | 同じブランチにpushすればPRに追加される |
| 取り込む | レビューとテストが通ってからマージ |

次の章では、クイックマスターのあとに本編のどこから読めばよいかを、役割別のルートで案内します。
