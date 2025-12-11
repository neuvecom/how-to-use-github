---
title: "よくあるトラブルと解決法"
quiz:
  - question: "SSH接続で「Permission denied (publickey)」エラーが出た場合、最初に確認すべきことは？"
    options:
      - "GitHubのパスワードを変更する"
      - "SSH鍵が存在し、SSH Agentに追加されているか確認する"
      - "新しいリポジトリを作成する"
      - "ブラウザでGitHubにログインする"
    answer: 1
  - question: "マージコンフリクト解決後に実行すべきコマンドの順序として正しいものは？"
    options:
      - "git push → git add → git commit"
      - "git commit → git add → git push"
      - "git add → git commit → git push"
      - "git merge → git add → git commit"
    answer: 2
  - question: "プッシュ済みのコミットを安全に取り消す方法はどれですか？"
    options:
      - "git reset --hard HEAD~1"
      - "git delete commit"
      - "git revert <commit-hash>"
      - "git undo push"
    answer: 2
---

この章では、GitHubを使う上でよくあるトラブルとその解決方法について学びます。

## 認証エラー

### SSH接続エラー

```bash
# エラー例
git@github.com: Permission denied (publickey).

# 解決手順
# 1. SSH鍵の確認
ls -la ~/.ssh/

# 2. SSH Agentに鍵を追加
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. GitHubに公開鍵が登録されているか確認
ssh -T git@github.com

# 4. 新しい鍵を生成（必要な場合）
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### HTTPS認証エラー

```bash
# エラー例
remote: Support for password authentication was removed.

# 解決方法: PATを使用
# 1. GitHubでPATを生成
# Settings → Developer settings → Personal access tokens → Generate

# 2. クレデンシャルを更新
git config --global credential.helper store
# または macOS
git config --global credential.helper osxkeychain

# 3. 再度プッシュ（PATをパスワードとして入力）
git push origin main
```

### 2要素認証（2FA）有効時のエラー

```bash
# 問題: 2FA有効後にプッシュできない
# 解決: パスワードの代わりにPATを使用

# URLにPATを埋め込む（非推奨だが緊急時）
git remote set-url origin https://<TOKEN>@github.com/user/repo.git

# 推奨: SSH に切り替え
git remote set-url origin git@github.com:user/repo.git
```

## プッシュの拒否

### 保護ブランチへの直接プッシュ

```bash
# エラー例
remote: error: GH006: Protected branch update failed
remote: error: Required pull request reviews not satisfied

# 解決: PRを作成してマージ
git checkout -b feature/my-change
git push origin feature/my-change
gh pr create
```

### 強制プッシュの拒否

```bash
# エラー例
remote: error: GH003: Sorry, force-pushing to main is not allowed.

# 解決: force pushは諦めて正規の方法で
git pull origin main --rebase
git push origin main
```

### ファイルサイズ制限

```bash
# エラー例
remote: error: File large-file.zip is 150.00 MB; exceeds 100 MB limit

# 解決1: 大きなファイルを削除
git rm large-file.zip
git commit -m "Remove large file"

# 解決2: 履歴からも削除
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch large-file.zip' \
  --prune-empty --tag-name-filter cat -- --all

# 解決3: Git LFS を使用
git lfs track "*.zip"
git add .gitattributes
git add large-file.zip
git commit -m "Add large file with LFS"
```

## コンフリクト解決

### マージコンフリクト

```bash
# コンフリクト発生時
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt

# 解決手順
# 1. コンフリクトファイルを確認
git status

# 2. ファイルを編集してコンフリクトを解決
# <<<<<<< HEAD
# 自分の変更
# =======
# マージ元の変更
# >>>>>>> branch-name

# 3. 解決後にステージング
git add file.txt

# 4. マージを完了
git commit
```

### リベースコンフリクト

```bash
# コンフリクト発生時
CONFLICT (content): Merge conflict in file.txt
error: could not apply abc123...

# 解決手順
# 1. コンフリクトを解決
# 2. ステージング
git add file.txt

# 3. リベースを続行
git rebase --continue

# 中止する場合
git rebase --abort
```

### PRのコンフリクト（WebUI）

```yaml
解決方法:
1. PRページの「Resolve conflicts」ボタン
2. WebUI上でコンフリクトマーカーを編集
3. 「Mark as resolved」
4. 「Commit merge」

または:

1. ローカルでマージ
   git fetch origin
   git checkout feature-branch
   git merge origin/main
2. コンフリクト解決
3. プッシュ
```

## 履歴の修正

### 直前のコミットメッセージ修正

```bash
# 直前のコミットメッセージを修正
git commit --amend -m "新しいメッセージ"

# エディタで編集
git commit --amend
```

### 直前のコミットにファイル追加

```bash
# 忘れたファイルを追加
git add forgotten-file.txt
git commit --amend --no-edit
```

### 過去のコミット修正

```bash
# インタラクティブリベース
git rebase -i HEAD~3

# エディタで pick を edit に変更
edit abc123 コミット1
pick def456 コミット2
pick ghi789 コミット3

# 修正を実行
# （修正が終わったら）
git commit --amend
git rebase --continue
```

### 誤コミットの取り消し

```bash
# 直前のコミットを取り消し（変更は保持）
git reset --soft HEAD~1

# 直前のコミットを取り消し（変更も破棄）
git reset --hard HEAD~1

# プッシュ済みの場合は revert
git revert HEAD
git push origin main
```

### 誤プッシュの対処

```bash
# 注意: force push は他の人に影響する！

# 方法1: revert（安全）
git revert <commit-hash>
git push origin main

# 方法2: force push（危険）
git reset --hard <正しいcommit>
git push --force-with-lease origin main
```

## ブランチのトラブル

### ブランチの削除ができない

```bash
# エラー例
error: Cannot delete branch 'feature' checked out at '/path'

# 解決: 別のブランチに切り替え
git checkout main
git branch -d feature

# 強制削除（マージされていない場合）
git branch -D feature
```

### リモートブランチの削除

```bash
# ローカルに残っている古いリモート追跡ブランチを削除
git fetch --prune

# リモートブランチを削除
git push origin --delete old-branch
```

### 間違ったブランチで作業

```bash
# 変更をスタッシュ
git stash

# 正しいブランチに切り替え
git checkout correct-branch

# スタッシュを適用
git stash pop
```

## よくある操作ミス

### git add . の取り消し

```bash
# 全てのステージングを取り消し
git reset HEAD

# 特定ファイルのみ
git reset HEAD specific-file.txt
```

### 間違ったファイルをコミット

```bash
# まだプッシュしていない場合
git reset --soft HEAD~1
git reset HEAD unwanted-file.txt
git commit -c ORIG_HEAD
```

### .gitignore が効かない

```bash
# 原因: 既にトラッキングされているファイル

# 解決: キャッシュをクリア
git rm -r --cached .
git add .
git commit -m "Re-apply .gitignore"
```

### 大量のファイルを誤コミット

```bash
# node_modules などを誤ってコミットした場合

# 1. .gitignore を更新
echo "node_modules/" >> .gitignore

# 2. キャッシュから削除
git rm -r --cached node_modules/

# 3. コミット
git commit -m "Remove node_modules from tracking"

# 履歴からも完全に削除する場合
git filter-branch --force --index-filter \
  'git rm -r --cached --ignore-unmatch node_modules' \
  --prune-empty --tag-name-filter cat -- --all
```

## GitHub固有のトラブル

### PRがマージできない

```yaml
原因と解決:
1. コンフリクトがある
   → WebUIまたはローカルで解決

2. ステータスチェックが失敗
   → CIの問題を修正

3. 承認が不足
   → レビュアーに承認を依頼

4. ブランチが最新でない
   → 「Update branch」ボタン
```

### Actions が動かない

```yaml
確認事項:
1. ワークフローファイルの構文エラー
   → YAMLのインデントを確認

2. トリガー条件
   → on: の設定を確認

3. 権限
   → permissions: を確認

4. シークレット
   → Secretsが正しく設定されているか

デバッグ:
- Actions → 該当Run → Re-run with debug logging
```

### Webhookが動かない

```yaml
確認事項:
1. Payload URL が正しいか
2. シークレットが一致しているか
3. イベントが選択されているか
4. 受信サーバーが稼働しているか

確認方法:
Settings → Webhooks → Recent Deliveries
- レスポンスコードを確認
- 「Redeliver」で再送信テスト
```

---

## 中級者向けTips

### デバッグ用コマンド

```bash
# 詳細なログ
GIT_TRACE=1 git push

# SSH接続デバッグ
ssh -vT git@github.com

# リモート情報
git remote -v

# 設定確認
git config --list
```

### 履歴調査

```bash
# 特定ファイルの変更履歴
git log --follow -p -- path/to/file

# 削除されたファイルの検索
git log --diff-filter=D --summary | grep delete

# 特定の文字列を含むコミット
git log -S "search_text"
```

### リカバリー

```bash
# 削除したブランチの復元
git reflog
git checkout -b recovered-branch <commit-hash>

# 強制リセット後の復元
git reflog
git reset --hard <reflog-entry>
```

---

## まとめ

| トラブル | 主な原因 | 解決の基本 |
|----------|----------|------------|
| 認証エラー | 鍵/トークンの問題 | SSH鍵またはPATを再設定 |
| プッシュ拒否 | 保護ルール | PRを作成 |
| コンフリクト | 同時編集 | 手動でマージ |
| 履歴問題 | 誤操作 | reset/revert |

### トラブル対応の基本

1. **エラーメッセージを読む**: 原因が書いてある
2. **git statusを確認**: 現在の状態を把握
3. **バックアップを取る**: 作業前にブランチを作成
4. **force pushは最終手段**: チームに影響する
5. **reflogは味方**: 大抵のミスは復元可能

### 予防策

```yaml
日常的な予防:
- コミット前に git diff で確認
- .gitignore を適切に設定
- 頻繁にコミット/プッシュ
- ブランチを活用

チーム運用:
- ブランチ保護を設定
- PRレビューを必須に
- CIでテストを自動化
```
