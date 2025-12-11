---
title: "コミットメッセージ規約"
---

# コミットメッセージ規約

この章では、チーム開発で使われるコミットメッセージの規約と、自動チェックの方法を学びます。

## なぜ規約が必要か

1. **履歴の可読性**: 変更内容が一目でわかる
2. **自動化**: CHANGELOG生成、バージョン管理
3. **レビュー効率**: PRの内容を素早く把握
4. **検索性**: 特定の変更を見つけやすい

## Conventional Commits

### 概要

最も広く使われているコミットメッセージの規約です。

### 基本形式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 具体例

```
feat: ユーザー認証機能を追加

Google OAuthによるログイン機能を実装しました。
- ログイン/ログアウトフロー
- セッション管理
- プロフィール取得

Closes #123
```

## タイプ（type）

### 主要なタイプ

| タイプ | 説明 | 例 |
|--------|------|-----|
| `feat` | 新機能 | `feat: 検索機能を追加` |
| `fix` | バグ修正 | `fix: ログインエラーを修正` |
| `docs` | ドキュメント | `docs: READMEを更新` |
| `style` | スタイル（動作に影響なし） | `style: コードフォーマット` |
| `refactor` | リファクタリング | `refactor: 認証ロジックを整理` |
| `perf` | パフォーマンス改善 | `perf: クエリを最適化` |
| `test` | テスト | `test: ユーザーAPIのテスト追加` |
| `build` | ビルド関連 | `build: webpack設定を更新` |
| `ci` | CI関連 | `ci: GitHub Actions追加` |
| `chore` | その他 | `chore: 依存関係を更新` |
| `revert` | リバート | `revert: feat: 検索機能を追加` |

### 破壊的変更

後方互換性を壊す変更には `!` を付けるか、フッターに `BREAKING CHANGE:` を記載：

```
feat!: APIのレスポンス形式を変更

BREAKING CHANGE: レスポンスのdata配列がobjectに変更されました
```

## スコープ（scope）

変更の影響範囲を示します。

```
feat(auth): ログイン機能を追加
fix(api): エンドポイントのエラーを修正
docs(readme): インストール手順を更新
```

### スコープの例

| プロジェクト | スコープ例 |
|--------------|------------|
| Webアプリ | `auth`, `api`, `ui`, `db` |
| モノレポ | `frontend`, `backend`, `shared` |
| ライブラリ | `core`, `utils`, `types` |

## 説明（description）

### 良い説明の書き方

```bash
# ✅ 良い例: 具体的で簡潔
feat: ユーザーの検索フィルター機能を追加
fix: 購入時の在庫チェックが無効になる問題を修正
refactor: 認証ミドルウェアをクラスベースに変更

# ❌ 悪い例: 曖昧または冗長
feat: 機能追加
fix: バグを修正
feat: ユーザーが商品を検索するときにフィルターを使って絞り込みができるようにする機能を追加しました
```

### ルール

1. **命令形で書く**: 「追加した」ではなく「追加」
2. **先頭は小文字**（日本語の場合は自然に）
3. **末尾にピリオドなし**
4. **50文字以内**を目安に

## 本文（body）

詳細な説明が必要な場合に使用します。

```
fix: 決済処理のタイムアウトエラーを修正

外部決済APIのレスポンス時間が長い場合に
タイムアウトが発生していた問題を修正。

変更内容:
- タイムアウト時間を10秒から30秒に延長
- リトライロジックを追加（最大3回）
- エラーハンドリングを改善
```

### 本文のルール

1. タイトルと本文は空行で区切る
2. 72文字で折り返す（読みやすさのため）
3. **What（何を）** と **Why（なぜ）** を説明
4. How（どうやって）はコードを見ればわかる

## フッター（footer）

### Issue/PRへのリンク

```
feat: ダッシュボードにグラフを追加

Closes #123
Refs #456, #789
```

### 複数の関連Issue

```
fix: 複数の入力バリデーションエラーを修正

Fixes #111
Fixes #222
Fixes #333
```

### 共同作業者

```
feat: 新しいレポート機能を追加

Co-authored-by: Name <email@example.com>
Co-authored-by: Another <another@example.com>
```

## commitlintによる自動チェック

### インストール

```bash
npm install --save-dev @commitlint/{cli,config-conventional}
```

### 設定ファイル

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'subject-case': [0],  // 日本語対応のため無効化
    'subject-max-length': [2, 'always', 72],
  },
};
```

### Huskyとの連携

```bash
npm install --save-dev husky
npx husky init
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### GitHub Actionsでのチェック

```yaml
name: Commitlint

on:
  pull_request:
    branches: [main]

jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Validate commits
        run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }} --verbose
```

## CHANGELOG の自動生成

### standard-version

```bash
npm install --save-dev standard-version
```

```json
// package.json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

```bash
# リリース
npm run release

# 出力例:
# CHANGELOG.md が更新される
# バージョンが自動で上がる
# タグが作成される
```

### 生成されるCHANGELOG例

```markdown
# Changelog

## [1.2.0](https://github.com/user/repo/compare/v1.1.0...v1.2.0) (2024-01-15)

### Features

* ユーザー検索機能を追加 ([#123](https://github.com/user/repo/issues/123)) ([abc1234](https://github.com/user/repo/commit/abc1234))
* ダッシュボードにグラフを追加 ([#456](https://github.com/user/repo/issues/456)) ([def5678](https://github.com/user/repo/commit/def5678))

### Bug Fixes

* ログインエラーを修正 ([#789](https://github.com/user/repo/issues/789)) ([ghi9012](https://github.com/user/repo/commit/ghi9012))
```

---

## 中級者向けTips

### コミットメッセージテンプレート

```bash
# テンプレートを作成
cat > ~/.gitmessage << 'EOF'
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>
#
# --- TYPES ---
# feat:     新機能
# fix:      バグ修正
# docs:     ドキュメント
# style:    フォーマット（動作に影響なし）
# refactor: リファクタリング
# perf:     パフォーマンス改善
# test:     テスト
# build:    ビルド関連
# ci:       CI関連
# chore:    その他
EOF

# Gitに設定
git config --global commit.template ~/.gitmessage
```

### コミットの整理（rebase -i）

```bash
# 直前の5コミットを整理
git rebase -i HEAD~5

# エディタで操作
# pick -> 保持
# reword -> メッセージ変更
# squash -> 前のコミットと統合
# fixup -> 統合（メッセージ破棄）
# drop -> 削除
```

### semantic-release

コミットメッセージから自動でリリース：

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## まとめ

| 項目 | 内容 |
|------|------|
| 形式 | `<type>(<scope>): <description>` |
| タイプ | feat, fix, docs, style, refactor, perf, test, build, ci, chore |
| 説明 | 命令形、50文字以内、具体的に |
| 本文 | 空行後に詳細、72文字折り返し |
| 自動化 | commitlint, standard-version |

### コミットメッセージのベストプラクティス

1. **1コミット = 1つの変更**: 複数の変更を混ぜない
2. **レビュアーを意識**: 後で読む人のために書く
3. **自動化を活用**: commitlintでルールを強制
4. **チームで合意**: 規約をドキュメント化して共有

次の章では、PR運用ルールについて学びます。
