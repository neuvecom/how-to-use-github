---
title: "最初の1時間でやること"
quiz:
  - question: "アカウント作成直後に、まず設定しておくべきセキュリティ対策はどれですか?"
    options:
      - "プロフィール画像の設定"
      - "2要素認証（2FA）の有効化"
      - "リポジトリをすべて公開にする"
      - "通知をすべてオフにする"
    answer: 1
  - question: "コミットに表示される名前とメールアドレスを設定するコマンドはどれですか?"
    options:
      - "git init"
      - "git config --global user.name / user.email"
      - "git remote add"
      - "git status"
    answer: 1
  - question: "最初のPRの練習として最も適切な進め方はどれですか?"
    options:
      - "mainに直接コミットしてから、あとでPRを作る"
      - "練習用リポジトリでブランチを作り、READMEを1行直してPRを出し、自分でマージする"
      - "他人の大きなプロジェクトにいきなりPRを送る"
      - "PRは使わず、ファイルをメールで送る"
    answer: 1
---

この章で学ぶこと

- アカウントを安全に使い始めるための設定
- 手元のGitの初期設定
- 練習用リポジトリで「ブランチ → コミット → PR → マージ」を1周する方法
- 作業漏れを防ぐチェックリスト

## 作業の全体像

最初の1時間で、次の4ステップを終わらせます。

| ステップ | やること | 目安 | 詳しくは |
|---|---|---|---|
| 1 | アカウントを作り、安全にする | 15分 | [アカウントの作成と設定](/how-to-use-github/02-account-setup/) |
| 2 | 手元のGitを設定する | 10分 | [基本的なGit操作](/how-to-use-github/04-git-basics/) |
| 3 | 練習用リポジトリを作る | 10分 | [リポジトリの基本](/how-to-use-github/03-repository-basics/) |
| 4 | 最初のPRを出してマージする | 25分 | [プルリクエスト（PR）](/how-to-use-github/06-pull-requests/) |

## ステップ1：アカウントを作り、安全にする

1. github.com でアカウントを作成する（ユーザー名は後から変えると URL が変わるので慎重に）
2. 「Settings」→「Password and authentication」で **2要素認証（2FA）** を有効にする
3. リカバリーコードを安全な場所に保存する
4. 「Settings」→「Emails」で「Keep my email addresses private」をオンにする

:::caution
2FAのリカバリーコードをなくすと、スマホを紛失したときにアカウントへ入れなくなることがあります。パスワード管理ツールなどに必ず保管しましょう。
:::

## ステップ2：手元のGitを設定する

ターミナルで次のコマンドを実行し、コミットに記録される名前とメールアドレスを設定します。

```bash
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"
git config --global init.defaultBranch main

# 設定を確認する
git config --global --list
```

メールアドレスを公開したくない場合は、GitHubの「Settings」→「Emails」に表示される `xxxx@users.noreply.github.com` 形式のアドレスを使います。

GitHubとの認証は、**GitHub CLI（`gh auth login`）** を使うのがいちばん簡単です（[GitHub CLI（gh）](/how-to-use-github/44-github-cli/)）。

## ステップ3：練習用リポジトリを作る

1. 右上の「+」→「New repository」を開く
2. 名前を `practice` などにし、「Private」を選ぶ
3. 「Add a README file」にチェックを入れて作成する
4. 手元に取り込む

```bash
git clone https://github.com/<ユーザー名>/practice.git
cd practice
```

## ステップ4：最初のPRを出してマージする

本番と同じ流れを、ひとりで1周してみます。

```bash
# 1. 作業用のブランチを作る
git switch -c first-change

# 2. README.md を1行書き足してからコミットする
git add README.md
git commit -m "READMEに自己紹介を追加"

# 3. GitHubに送る
git push -u origin first-change
```

1. GitHubのリポジトリを開くと「Compare & pull request」ボタンが出ているので押す
2. タイトルと説明を書いて「Create pull request」を押す
3. 「Files changed」タブで差分を確認する
4. 「Merge pull request」を押してmainに取り込む
5. 手元でも `git switch main && git pull` で最新にする

:::note
コマンドがまだ不安な人は、ブラウザだけでも同じ流れを体験できます（[WebUIでのブランチ・PR操作](/how-to-use-github/10-webui-branch-pr/)）。
:::

## チェックリスト

| チェック | 項目 |
|---|---|
| ☐ | 2要素認証を有効にし、リカバリーコードを保管した |
| ☐ | メールアドレスを非公開にした |
| ☐ | `git config` で名前とメールアドレスを設定した |
| ☐ | 練習用リポジトリを作り、手元にcloneした |
| ☐ | ブランチを作ってコミットし、pushした |
| ☐ | PRを作ってマージし、手元のmainを更新した |

## まとめ

- 最初にやるのは「2FA」「メールの非公開」「git configの設定」の3つ
- 練習用リポジトリで、ブランチ → コミット → push → PR → マージを1周しておくと、本番で迷わない
- コマンドが不安なら、まずブラウザだけで流れを体験してもよい

次の章では、毎日の作業で使う5つの操作を押さえます。
