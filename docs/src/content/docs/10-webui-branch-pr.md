---
title: "WebUIでのブランチ・PR操作"
---

この章では、GitHub の Web UI でブランチの作成・管理、PR の作成からマージまでの操作を学びます。コマンドラインを使わずに一連の作業が可能です。

## ブランチの作成

### リポジトリページから

1. ブランチセレクター（「main」と表示されている部分）をクリック
2. 検索ボックスに新しいブランチ名を入力
3. 「Create branch: xxx from 'main'」をクリック

### 作成元ブランチの指定

1. まず作成元にしたいブランチを選択
2. その状態で新しいブランチ名を入力
3. 「Create branch: xxx from 'feature'」のように表示される

### PRページから

PR作成時に、マージ先とマージ元を選択する際に新しいブランチを指定できます。

## ブランチの切り替え

### 表示ブランチの切り替え

1. ブランチセレクターをクリック
2. 切り替えたいブランチを選択
3. そのブランチのファイルが表示される

```
URL も変化:
https://github.com/user/repo/tree/main
https://github.com/user/repo/tree/feature-branch
```

### ファイル表示時の切り替え

ファイルを表示中でも、ブランチセレクターで切り替え可能。同じファイルの別ブランチ版が表示されます。

## ブランチの管理

### ブランチ一覧の確認

1. リポジトリページで「Code」タブ
2. ブランチセレクターの下「X branches」をクリック
3. または直接 `/branches` にアクセス

### ブランチの削除

1. Branches ページ（`/branches`）
2. 削除したいブランチの右側にあるゴミ箱アイコン
3. 確認ダイアログで「Delete」

:::note
デフォルトブランチは削除できません。先にデフォルトブランチを変更する必要があります。


### 削除したブランチの復元

削除直後であれば復元可能：

1. Branches ページ
2. 削除したブランチのところに「Restore」ボタンが表示
3. クリックで復元

## WebUI上でのコミット

### ファイル編集からコミット

1. ファイルを編集モードで開く
2. 「Commit changes...」をクリック
3. コミットメッセージを入力
4. コミット先を選択：
   - **Commit directly to [branch]**: 現在のブランチに直接
   - **Create a new branch**: 新しいブランチを作成

### 新しいブランチを作成してコミット

「Create a new branch」を選択すると：

1. ブランチ名を入力（自動提案あり）
2. 「Propose changes」で新ブランチにコミット
3. PR作成画面に遷移

## PR の作成（WebUI）

### 方法1: Compare & pull request

プッシュ直後にリポジトリページに表示される黄色いバナー「Compare & pull request」をクリック。

### 方法2: Pull requests タブから

1. 「Pull requests」タブ
2. 「New pull request」
3. base（マージ先）と compare（変更元）を選択
4. 「Create pull request」

### 方法3: ブランチ一覧から

1. Branches ページ
2. 該当ブランチの「New pull request」ボタン

### PR作成フォーム

| 項目 | 説明 |
|------|------|
| **Title** | PRのタイトル（必須） |
| **Description** | 詳細説明（マークダウン対応） |
| **Reviewers** | レビュアーを指定 |
| **Assignees** | 担当者を指定 |
| **Labels** | ラベルを付与 |
| **Projects** | プロジェクトボードに追加 |
| **Milestone** | マイルストーンを設定 |

## PR のレビュー操作

### Files changed タブ

1. PRページで「Files changed」タブ
2. 変更内容を確認
3. 行にコメントを追加
4. 「Review changes」でレビューを送信

### Conversation タブ

- PRの全体的なディスカッション
- コミット単位でのコメント
- レビューの状態確認

### Commits タブ

- PRに含まれるコミット一覧
- 各コミットの差分を確認

### Checks タブ

- CI/CDの実行状況
- ステータスチェックの結果

## コンフリクトの解決

### コンフリクトの検出

マージできないコンフリクトがある場合、PRページに警告が表示されます：

```
This branch has conflicts that must be resolved
```

### WebUIでの解決手順

1. 「Resolve conflicts」ボタンをクリック
2. エディタが開き、コンフリクト箇所が表示

```
<<<<<<< feature-branch
const message = "Hello from feature";
=======
const message = "Hello from main";
>>>>>>> main
```

3. 残したい内容に編集（マーカーを削除）
4. 「Mark as resolved」をクリック
5. すべてのコンフリクトを解決
6. 「Commit merge」でコミット

### 解決できないケース

以下の場合はローカルで解決が必要：

- バイナリファイルのコンフリクト
- 複雑なコンフリクト
- ファイルの移動・削除が絡むコンフリクト

```bash
# ローカルでの解決
git fetch origin
git checkout feature-branch
git merge origin/main
# コンフリクトを手動解決
git add .
git commit -m "resolve conflicts"
git push
```

## PR のマージ

### マージボタン

PRが承認され、チェックが通ると「Merge pull request」が有効になります。

### マージ方法の選択

ドロップダウンから選択：

1. **Create a merge commit**: マージコミットを作成
2. **Squash and merge**: コミットを1つにまとめてマージ
3. **Rebase and merge**: リベースしてマージ

### マージ後の操作

マージ後に表示されるオプション：

- **Delete branch**: マージ元ブランチを削除
- **Revert**: マージを取り消すPRを作成

:::note
「Automatically delete head branches」を設定している場合、マージと同時にブランチが削除されます。


## PR のクローズ

マージせずにPRを閉じる場合：

1. PRページ最下部
2. 「Close pull request」ボタン

クローズしたPRは後で再オープン可能です。

---

## 中級者向けTips

### ドラフトPRの活用

1. PR作成時に「Create draft pull request」
2. レビュー準備ができたら「Ready for review」

### 複数コミットの確認

Files changedの表示を切り替え：

- **All changes**: 全変更を表示
- **Changes from all commits**: コミット単位で確認
- 特定のコミット範囲を選択

### PRのリンク共有

特定のファイルや行を共有：

```
# 特定のファイル
https://github.com/user/repo/pull/123/files#diff-xxx

# 特定の行
https://github.com/user/repo/pull/123/files#diff-xxx-R10
```

### PRのテンプレート活用

URLパラメータでテンプレートを指定：

```
https://github.com/user/repo/compare/main...feature?template=feature.md
```

### キーボードナビゲーション

| ショートカット | 動作 |
|----------------|------|
| `J` / `K` | 次/前のファイルに移動 |
| `N` / `P` | 次/前の差分チャンクに移動 |
| `B` | Blame表示を切り替え |

---

## まとめ

| 操作 | 手順 |
|------|------|
| ブランチ作成 | セレクター → 名前入力 → Create |
| ブランチ削除 | /branches → ゴミ箱アイコン |
| PR作成 | Pull requests → New → 設定 → Create |
| コンフリクト解決 | Resolve conflicts → 編集 → Mark as resolved |
| マージ | Merge pull request → 方法選択 |

### WebUI完結のワークフロー例

```
1. ブランチセレクターで新しいブランチを作成
2. ファイルを編集してコミット
3. Compare & pull request でPR作成
4. レビューを受ける
5. コンフリクトがあればWebUIで解決
6. マージしてブランチを削除
```

次の章では、WebUIからのデプロイ方法を学びます。
