---
title: "GitHub CLI（gh）"
quiz:
  - question: "GitHub CLIの認証を開始するコマンドはどれですか？"
    options:
      - "gh login"
      - "gh auth login"
      - "gh authenticate"
      - "gh connect"
    answer: 1
  - question: "GitHub CLIでPRを作成してコミットメッセージから自動入力するオプションはどれですか？"
    options:
      - "gh pr create --auto"
      - "gh pr create --message"
      - "gh pr create --fill"
      - "gh pr create --commit"
    answer: 2
  - question: "GitHub CLIでREST APIを直接呼び出す方法はどれですか？"
    options:
      - "gh rest /user"
      - "gh call /user"
      - "gh api /user"
      - "gh request /user"
    answer: 2
---

この章では、GitHub公式CLIツール「gh」のインストール、主要コマンド、エイリアスについて学びます。

## GitHub CLIとは

**GitHub CLI（gh）**は、GitHubの操作をターミナルから行える公式コマンドラインツールです。Issue、PR、リリースなどの操作をコマンドラインで完結できます。

### 特徴

| 特徴 | 説明 |
|------|------|
| **公式ツール** | GitHub公式サポート |
| **統合認証** | ブラウザ認証でセットアップ簡単 |
| **高機能** | REST/GraphQL API直接アクセス |
| **拡張性** | エイリアスと拡張機能 |

## インストール

### macOS

```bash
# Homebrew
brew install gh

# MacPorts
sudo port install gh
```

### Windows

```bash
# winget
winget install --id GitHub.cli

# Chocolatey
choco install gh

# Scoop
scoop install gh
```

### Linux

```bash
# Ubuntu/Debian
type -p curl >/dev/null || sudo apt install curl -y
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Fedora
sudo dnf install gh

# Arch Linux
sudo pacman -S github-cli
```

### 認証

```bash
# 認証（ブラウザが開く）
gh auth login

# 認証状況の確認
gh auth status

# 複数アカウントの管理
gh auth login --hostname github.company.com
gh auth switch
```

## 主要コマンド

### リポジトリ操作

```bash
# リポジトリのクローン
gh repo clone owner/repo

# リポジトリの作成
gh repo create my-repo --public
gh repo create my-repo --private
gh repo create my-repo --template owner/template

# リポジトリの表示
gh repo view
gh repo view owner/repo --web  # ブラウザで開く

# リポジトリの一覧
gh repo list
gh repo list owner --limit 20

# リポジトリのフォーク
gh repo fork owner/repo
gh repo fork owner/repo --clone
```

### Issue操作

```bash
# Issue一覧
gh issue list
gh issue list --state open
gh issue list --assignee @me
gh issue list --label bug

# Issue作成
gh issue create
gh issue create --title "Bug report" --body "Description"
gh issue create --title "Bug" --label bug --assignee @me

# Issue表示
gh issue view 123
gh issue view 123 --web

# Issue編集
gh issue edit 123 --title "New title"
gh issue edit 123 --add-label enhancement
gh issue edit 123 --add-assignee user1

# Issueのクローズ/再開
gh issue close 123
gh issue reopen 123

# Issueへのコメント
gh issue comment 123 --body "Comment text"
```

### Pull Request操作

```bash
# PR一覧
gh pr list
gh pr list --state merged
gh pr list --author @me
gh pr list --draft

# PR作成
gh pr create
gh pr create --title "Feature" --body "Description"
gh pr create --fill  # コミットメッセージから自動入力
gh pr create --draft
gh pr create --base develop --head feature/auth

# PR表示
gh pr view 123
gh pr view 123 --web
gh pr view --comments

# PRのチェックアウト
gh pr checkout 123

# PRのマージ
gh pr merge 123
gh pr merge 123 --squash
gh pr merge 123 --rebase
gh pr merge 123 --auto --squash  # 自動マージ有効化

# PRのレビュー
gh pr review 123 --approve
gh pr review 123 --request-changes --body "Please fix..."
gh pr review 123 --comment --body "Looks good!"

# PRの差分
gh pr diff 123
```

### ワークフロー操作

```bash
# ワークフロー一覧
gh workflow list

# ワークフロー実行履歴
gh run list

# 特定のワークフロー実行
gh workflow run deploy.yml
gh workflow run build.yml --ref feature-branch
gh workflow run deploy.yml -f environment=production

# 実行結果の確認
gh run view
gh run view 12345
gh run view 12345 --log
gh run watch 12345  # リアルタイム監視

# 実行の再実行
gh run rerun 12345
gh run rerun 12345 --failed  # 失敗したジョブのみ
```

### リリース操作

```bash
# リリース一覧
gh release list

# リリース作成
gh release create v1.0.0
gh release create v1.0.0 --title "Version 1.0.0" --notes "Release notes"
gh release create v1.0.0 --generate-notes
gh release create v1.0.0 ./dist/app-linux ./dist/app-macos

# リリース表示
gh release view v1.0.0

# アセットのダウンロード
gh release download v1.0.0
gh release download v1.0.0 --pattern "*.zip"

# リリース削除
gh release delete v1.0.0
```

### Gist操作

```bash
# Gist一覧
gh gist list

# Gist作成
gh gist create script.py
gh gist create script.py --desc "Utility script"
gh gist create file1.js file2.js

# Gist表示
gh gist view <gist-id>

# Gist編集
gh gist edit <gist-id>

# Gist削除
gh gist delete <gist-id>
```

### Codespace操作

```bash
# Codespace一覧
gh codespace list

# Codespace作成
gh codespace create --repo owner/repo
gh codespace create --repo owner/repo --machine largePremiumLinux

# Codespaceに接続
gh codespace ssh -c <codespace-name>
gh codespace code -c <codespace-name>

# Codespace停止/削除
gh codespace stop -c <codespace-name>
gh codespace delete -c <codespace-name>
```

## API直接アクセス

### REST API

```bash
# GET リクエスト
gh api /repos/owner/repo

# POST リクエスト
gh api /repos/owner/repo/issues --method POST \
  -f title="Issue title" \
  -f body="Issue body"

# ページネーション
gh api /repos/owner/repo/issues --paginate

# JQでフィルタリング
gh api /repos/owner/repo/issues --jq '.[].title'
gh api /repos/owner/repo/contributors --jq '.[].login'

# 生のJSON出力
gh api /user --jq '.'
```

### GraphQL API

```bash
# GraphQLクエリ
gh api graphql -f query='
  query {
    viewer {
      login
      repositories(first: 10) {
        nodes {
          name
          stargazerCount
        }
      }
    }
  }
'

# 変数を使ったクエリ
gh api graphql -f query='
  query($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      issues(first: 10, states: OPEN) {
        nodes {
          title
          number
        }
      }
    }
  }
' -f owner=octocat -f repo=Hello-World
```

## エイリアス

### エイリアスの設定

```bash
# エイリアスの作成
gh alias set co 'pr checkout'
gh alias set pv 'pr view --web'
gh alias set iv 'issue view --web'

# 引数付きエイリアス
gh alias set clone 'repo clone "$1"'
gh alias set myissues 'issue list --assignee @me'

# 複合コマンド
gh alias set pr-files 'pr view --json files --jq ".files[].path"'

# エイリアス一覧
gh alias list

# エイリアス削除
gh alias delete co
```

### 便利なエイリアス例

```bash
# ~/.config/gh/config.yml に記載される

# PR関連
gh alias set prc 'pr create --fill'
gh alias set prm 'pr merge --squash --delete-branch'
gh alias set prs 'pr status'

# Issue関連
gh alias set ic 'issue create'
gh alias set il 'issue list --assignee @me'

# ワークフロー関連
gh alias set runs 'run list --limit 5'
gh alias set watch 'run watch'

# ブラウザで開く
gh alias set web 'repo view --web'
gh alias set prweb 'pr view --web'
```

## 拡張機能

### 拡張機能のインストール

```bash
# 拡張機能の検索
gh extension search

# インストール
gh extension install github/gh-copilot
gh extension install dlvhdr/gh-dash
gh extension install mislav/gh-branch

# 一覧
gh extension list

# 更新
gh extension upgrade --all

# 削除
gh extension remove gh-copilot
```

### 人気の拡張機能

| 拡張機能 | 説明 |
|----------|------|
| `github/gh-copilot` | Copilot in CLI |
| `dlvhdr/gh-dash` | ダッシュボード |
| `mislav/gh-branch` | ブランチ管理 |
| `seachicken/gh-poi` | 古いブランチ削除 |
| `vilmibm/gh-screensaver` | スクリーンセーバー |

---

## 中級者向けTips

### 設定ファイル

```yaml
# ~/.config/gh/config.yml
git_protocol: ssh
editor: vim
prompt: enabled
pager: less

aliases:
  co: pr checkout
  pv: pr view --web

hosts:
  github.com:
    user: your-username
    oauth_token: ghp_xxxx
```

### シェルの補完設定

```bash
# Bash
eval "$(gh completion -s bash)"

# Zsh
eval "$(gh completion -s zsh)"

# Fish
gh completion -s fish | source
```

### 複数アカウントの切り替え

```bash
# Enterprise追加
gh auth login --hostname github.company.com

# アカウント切り替え
gh auth switch

# 特定ホストを指定
gh repo list --hostname github.company.com
```

### 自動化スクリプト例

```bash
#!/bin/bash
# 全PRのステータス確認

for repo in $(gh repo list --json name --jq '.[].name'); do
  echo "=== $repo ==="
  gh pr list --repo "owner/$repo" --state open
done
```

```bash
#!/bin/bash
# 古いブランチの削除

gh api /repos/owner/repo/branches --paginate --jq '
  .[] | select(.name != "main" and .name != "develop") | .name
' | while read branch; do
  echo "Delete: $branch"
  gh api -X DELETE "/repos/owner/repo/git/refs/heads/$branch"
done
```

---

## まとめ

| カテゴリ | 主要コマンド |
|----------|-------------|
| リポジトリ | `gh repo` |
| Issue | `gh issue` |
| PR | `gh pr` |
| ワークフロー | `gh run`, `gh workflow` |
| リリース | `gh release` |
| API | `gh api` |

### GitHub CLIのベストプラクティス

1. **エイリアス活用**: よく使うコマンドを短縮
2. **シェル補完**: Tab補完で効率アップ
3. **拡張機能**: 必要に応じて機能追加
4. **API直接アクセス**: 複雑な操作も可能
5. **スクリプト化**: 定型作業を自動化

### よく使うコマンドチートシート

```bash
# 日常的なワークフロー
gh pr create --fill           # PR作成
gh pr checkout 123            # PRをチェックアウト
gh pr merge --squash          # マージ
gh issue create               # Issue作成
gh run watch                  # CI監視

# 確認系
gh pr status                  # 自分のPR状況
gh issue list --assignee @me  # 自分のIssue
gh repo view --web            # ブラウザで開く
```

次の章では、GitHub APIについて学びます。
