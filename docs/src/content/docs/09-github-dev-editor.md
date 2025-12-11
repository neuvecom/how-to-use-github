---
title: "github.devエディタ"
---

この章では、ブラウザ上で動作するVS Code風エディタ「github.dev」の使い方を学びます。ローカル環境なしで本格的なコード編集が可能です。

## github.devとは

**github.dev**は、GitHubが提供するブラウザベースの軽量エディタです。VS Code（Visual Studio Code）をベースにしています。

### 特徴

| 特徴 | 説明 |
|------|------|
| **起動が速い** | 数秒で起動 |
| **VS Code互換** | 使い慣れたUIで編集 |
| **インストール不要** | ブラウザだけで動作 |
| **無料** | 完全無料で利用可能 |

### 制限事項

- ターミナルは使用不可
- コードの実行は不可
- 一部の拡張機能は未対応
- デバッグ機能なし

:::note
コードの実行やビルドが必要な場合は、Codespacesを使用してください。
:::

## github.devの起動方法

### 方法1: ピリオドキーで起動

リポジトリページで `.`（ピリオド）キーを押す

```
https://github.com/user/repo
     ↓ 「.」キー押下
https://github.dev/user/repo
```

### 方法2: URLを変更

URLの `github.com` を `github.dev` に変更：

```
Before: https://github.com/user/repo
After:  https://github.dev/user/repo
```

### 方法3: PRページから

PRの「Files changed」タブで、右上の「...」→「Open in github.dev」

## 基本的な使い方

### ファイルの編集

1. 左側のエクスプローラーでファイルを選択
2. 右側のエディタで編集
3. `Ctrl+S` / `Cmd+S` で保存（自動保存も有効）

### 複数ファイルの編集

- タブで複数ファイルを開く
- 分割ビューで並べて編集可能

### ファイルの作成・削除

- エクスプローラーで右クリック → 新しいファイル/フォルダ
- ファイルを右クリック → 削除

## 変更のコミット

### Source Controlパネル

1. 左側の「Source Control」アイコン（または `Ctrl+Shift+G`）
2. 変更されたファイルが一覧表示
3. `+` でステージング
4. コミットメッセージを入力
5. ✓ でコミット

### コミット先の選択

```
┌─────────────────────────────────────┐
│ Commit to "main"                    │  ← 直接コミット
├─────────────────────────────────────┤
│ Create a new branch                 │  ← 新ブランチ作成
└─────────────────────────────────────┘
```

### PRの作成

新しいブランチにコミットした後：

1. ポップアップで「Create Pull Request」
2. または GitHub Pull Requests 拡張機能を使用

## 軽微な修正のワークフロー

### ドキュメント修正の例

```
1. リポジトリで「.」を押して github.dev を起動
2. docs/README.md を開いて編集
3. Source Control で変更を確認
4. コミットメッセージ: "docs: README の誤字を修正"
5. 「Create a new branch」を選択
6. ブランチ名: "docs/fix-typo"
7. コミット
8. PRを作成
```

### 設定ファイル修正の例

```
1. github.dev を起動
2. .github/workflows/ci.yml を編集
3. YAML の構文チェック（拡張機能でサポート）
4. コミット
5. PRを作成 → CI が実行されることを確認
```

## 便利な機能

### コマンドパレット

`Ctrl+Shift+P` / `Cmd+Shift+P` でコマンドパレットを開く：

```
よく使うコマンド:
- Format Document（コードフォーマット）
- Go to File（ファイル検索）
- Go to Line（行へジャンプ）
- Change Language Mode（言語切り替え）
```

### 検索と置換

- `Ctrl+F` / `Cmd+F`: ファイル内検索
- `Ctrl+H` / `Cmd+H`: 置換
- `Ctrl+Shift+F` / `Cmd+Shift+F`: 全ファイル検索

### マルチカーソル

- `Alt+Click`: 複数カーソルを追加
- `Ctrl+D` / `Cmd+D`: 同じ単語を選択して追加
- `Ctrl+Shift+L` / `Cmd+Shift+L`: 同じ単語をすべて選択

### 折りたたみ

- `Ctrl+Shift+[` / `Cmd+Option+[`: 折りたたみ
- `Ctrl+Shift+]` / `Cmd+Option+]`: 展開

## 対応している拡張機能

github.devは一部のVS Code拡張機能に対応しています。

### デフォルトで有効な拡張機能

- GitHub Pull Requests and Issues
- GitLens（一部機能）
- 各種言語サポート

### 追加できる拡張機能

左側の拡張機能アイコンから検索・インストール：

```
人気の対応拡張機能:
- Prettier（コードフォーマット）
- ESLint（一部機能）
- YAML
- Markdown Preview
```

:::caution
ターミナルを必要とする拡張機能や、ネイティブ機能を使う拡張機能は動作しません。
:::

## ブランチの切り替え

### 現在のブランチを確認

左下のステータスバーにブランチ名が表示されます。

### ブランチを切り替え

1. ステータスバーのブランチ名をクリック
2. 切り替えたいブランチを選択

### 新しいブランチを作成

1. ステータスバーのブランチ名をクリック
2. 「Create new branch」を選択
3. ブランチ名を入力

## Codespacesとの使い分け

| 機能 | github.dev | Codespaces |
|------|------------|------------|
| 起動速度 | 数秒 | 数十秒〜数分 |
| ターミナル | ✗ | ✓ |
| コード実行 | ✗ | ✓ |
| デバッグ | ✗ | ✓ |
| 費用 | 無料 | 有料（無料枠あり） |
| 用途 | 軽微な編集 | 本格的な開発 |

### 切り替え方法

github.devから「Continue Working in...」→「Codespaces」を選択すると、同じブランチでCodespacesが起動します。

---

## 中級者向けTips

### 設定の同期

GitHub アカウントでサインインすると、VS Code の設定が同期されます：

1. 左下の歯車アイコン
2. 「Turn on Settings Sync」
3. 同期する項目を選択

### キーボードショートカットのカスタマイズ

1. `Ctrl+K Ctrl+S` でショートカット設定を開く
2. 任意のコマンドにショートカットを割り当て

### github.devの直接リンク

特定のファイルを直接開く：

```
https://github.dev/user/repo/blob/main/src/index.ts
```

特定の行にジャンプ：

```
https://github.dev/user/repo/blob/main/src/index.ts#L10
```

### オフライン対応

github.devは一度読み込むと、ある程度オフラインでも編集可能です。ただし、コミットにはオンラインが必要です。

### PRのレビュー

GitHub Pull Requests 拡張機能を使って：

1. PRのファイルを github.dev で開く
2. コメントを追加
3. サジェスチョンを作成
4. レビューを送信

---

## まとめ

| 項目 | 内容 |
|------|------|
| 起動方法 | `.` キー または URL変更 |
| 用途 | 軽微な編集、ドキュメント修正 |
| コミット | Source Control パネルから |
| 制限 | ターミナル不可、実行不可 |

### github.dev が適しているケース

- ドキュメントの修正
- 設定ファイルの編集
- コードレビュー中の軽微な修正
- タイポの修正
- 複数ファイルの一括編集

### github.dev が適していないケース

- ビルドやテストの実行が必要
- デバッグが必要
- 外部パッケージのインストールが必要
- 長時間の開発作業

次の章では、WebUIでのブランチ・PR操作について学びます。
