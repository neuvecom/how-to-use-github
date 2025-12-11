---
title: "ショートカットキー一覧"
quiz:
  - question: "GitHub WebUIで検索バーにフォーカスするショートカットキーはどれですか？"
    options:
      - "Ctrl + F"
      - "s または /"
      - "Ctrl + S"
      - "f"
    answer: 1
  - question: "リポジトリをgithub.devエディタで開くショートカットキーはどれですか？"
    options:
      - "e"
      - "Ctrl + E"
      - "."
      - "o"
    answer: 2
  - question: "GitHub Copilotのコード提案を採用するキーはどれですか？"
    options:
      - "Enter"
      - "Space"
      - "Tab"
      - "Ctrl + A"
    answer: 2
---

GitHub WebUI と GitHub Copilot のショートカットキーをまとめます。

## GitHub WebUI

### グローバルショートカット

| キー | 動作 |
|------|------|
| `s` または `/` | 検索バーにフォーカス |
| `g` `n` | 通知ページへ移動 |
| `g` `d` | ダッシュボードへ移動 |
| `?` | ショートカット一覧を表示 |
| `Esc` | ダイアログを閉じる |

### リポジトリページ

| キー | 動作 |
|------|------|
| `g` `c` | Codeタブへ移動 |
| `g` `i` | Issuesタブへ移動 |
| `g` `p` | Pull requestsタブへ移動 |
| `g` `a` | Actionsタブへ移動 |
| `g` `b` | Projectsタブへ移動 |
| `g` `w` | Wikiタブへ移動 |
| `t` | ファイル検索を開く |
| `w` | ブランチ切り替え |
| `l` | 行番号へジャンプ |
| `.` | github.devエディタで開く |
| `,` | Codespacesで開く |

### ファイル表示

| キー | 動作 |
|------|------|
| `b` | Blameビューに切り替え |
| `y` | 固定URLを取得 |
| `l` | 行番号へジャンプ |

### Issue / PR

| キー | 動作 |
|------|------|
| `c` | 新しいIssue/PRを作成 |
| `a` | アサインを設定 |
| `l` | ラベルを設定 |
| `m` | マイルストーンを設定 |
| `r` | コメント入力にフォーカス |

### PRのファイル変更

| キー | 動作 |
|------|------|
| `j` | 次のファイルへ |
| `k` | 前のファイルへ |
| `c` | コメントを追加 |
| `t` | ファイルツリーを切り替え |

### 検索結果

| キー | 動作 |
|------|------|
| `↑` / `↓` | 結果を移動 |
| `Enter` | 選択した結果を開く |

## GitHub Copilot（VS Code）

### コード補完

| キー | 動作 |
|------|------|
| `Tab` | 提案を採用 |
| `Esc` | 提案を却下 |
| `Ctrl` + `]` | 次の候補を表示（Windows/Linux） |
| `Ctrl` + `[` | 前の候補を表示 |
| `Alt` + `]` | 次の単語のみ採用 |
| `Ctrl` + `Enter` | 複数候補パネルを開く |

### Mac版

| キー | 動作 |
|------|------|
| `Tab` | 提案を採用 |
| `Esc` | 提案を却下 |
| `Option` + `]` | 次の候補を表示 |
| `Option` + `[` | 前の候補を表示 |
| `Cmd` + `Enter` | 複数候補パネルを開く |

### Copilot Chat

| キー（Windows/Linux） | キー（Mac） | 動作 |
|-----------------------|-------------|------|
| `Ctrl` + `Shift` + `I` | `Cmd` + `Shift` + `I` | Chatパネルを開く |
| `Ctrl` + `I` | `Cmd` + `I` | インラインChatを開く |
| `Ctrl` + `L` | `Cmd` + `L` | Chat入力をクリア |

## Git コマンド（よく使うもの）

### 基本操作

```bash
# ステータス確認
git status

# 変更を追加
git add .
git add <file>

# コミット
git commit -m "message"

# プッシュ
git push origin <branch>

# プル
git pull origin <branch>
```

### ブランチ操作

```bash
# ブランチ一覧
git branch

# ブランチ作成
git checkout -b <branch>

# ブランチ切り替え
git checkout <branch>
git switch <branch>

# ブランチ削除
git branch -d <branch>
```

### 履歴確認

```bash
# ログ表示
git log
git log --oneline
git log --graph

# 差分確認
git diff
git diff --staged
```

### 取り消し

```bash
# ステージング取り消し
git reset HEAD <file>

# 直前のコミット修正
git commit --amend

# コミット取り消し（変更保持）
git reset --soft HEAD~1
```

## GitHub CLI（gh）

### よく使うコマンド

```bash
# PR作成
gh pr create

# PR一覧
gh pr list

# Issue作成
gh issue create

# リポジトリをブラウザで開く
gh repo view --web

# ワークフロー監視
gh run watch
```

### エイリアス例

```bash
# 設定
gh alias set co 'pr checkout'
gh alias set pv 'pr view --web'
gh alias set mypr 'pr list --author @me'
```

---

## カスタマイズ

### VS Code キーバインド設定

`keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+space",
    "command": "github.copilot.generate",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+alt+c",
    "command": "github.copilot.toggleCopilot"
  }
]
```

### Git エイリアス設定

`~/.gitconfig`:

```ini
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  lg = log --oneline --graph --all
  unstage = reset HEAD --
  last = log -1 HEAD
```

---

:::note
ショートカットはOSや設定によって異なる場合があります。
`?` キーでGitHub上のショートカット一覧を確認できます。
:::
