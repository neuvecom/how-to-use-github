---
title: "コードレビュー"
---

# コードレビュー

この章では、GitHubでのコードレビューの方法を学びます。効果的なレビューはコード品質の向上とチームの成長に欠かせません。

## コードレビューの目的

1. **品質向上**: バグの早期発見、設計の改善
2. **知識共有**: チーム全体のスキルアップ
3. **一貫性**: コーディング規約の遵守
4. **セキュリティ**: 脆弱性の発見

## レビューの始め方

### PRの確認

1. PRページで「Files changed」タブをクリック
2. 変更されたファイルを確認
3. コメントやサジェスチョンを追加
4. レビューを送信

### 差分の見方

```
- 削除された行（赤）
+ 追加された行（緑）
  変更なしの行（灰色）
```

#### 表示オプション

| オプション | 説明 |
|------------|------|
| Unified | 1列で差分を表示（デフォルト） |
| Split | 2列で before/after を並べて表示 |
| Hide whitespace | 空白の変更を無視 |

## インラインコメント

### コメントの追加

1. 変更された行の左側にある「+」をクリック
2. コメントを入力
3. 「Start a review」または「Add single comment」

:::message
**Start a review** は複数のコメントをまとめて送信できます。
**Add single comment** は即座にコメントが公開されます。
:::

### 複数行へのコメント

行番号をドラッグして複数行を選択すると、まとめてコメントできます。

### マークダウンの活用

```markdown
コードブロックを使って具体例を示す：

\`\`\`javascript
// こう書くとより明確です
const isValid = user && user.name && user.email;
\`\`\`

- リスト形式で複数の指摘
- 見やすく整理

> 引用で元のコードを参照
```

## サジェスチョン機能

コードの変更提案を直接行える機能です。

### サジェスチョンの作成

コメント入力時に「Suggestion」ボタンを使用：

````markdown
```suggestion
const isValid = Boolean(user?.name && user?.email);
```
````

### サジェスチョンの適用

PR作成者は「Commit suggestion」ボタンで、提案されたコードを直接コミットできます。

```
便利な使い方：
- タイポの修正
- 簡単なリファクタリング
- コーディングスタイルの修正
```

### 複数のサジェスチョンを一括コミット

1. 各サジェスチョンで「Add suggestion to batch」
2. 「Commit suggestions」で一括コミット

## レビューステータス

### 3つのステータス

| ステータス | 意味 | アイコン |
|------------|------|----------|
| **Comment** | コメントのみ（承認でも却下でもない） | 💬 |
| **Approve** | 承認（マージ可能） | ✅ |
| **Request changes** | 変更要求（修正が必要） | ❌ |

### レビューの送信

1. コメントを追加した後
2. 「Review changes」をクリック
3. ステータスを選択
4. サマリーコメントを追加（任意）
5. 「Submit review」

```bash
# GitHub CLI でレビュー
gh pr review 123 --approve
gh pr review 123 --request-changes --body "修正をお願いします"
gh pr review 123 --comment --body "いくつか質問があります"
```

## CODEOWNERS設定

特定のファイルやディレクトリに対して、自動でレビュアーを割り当てる機能です。

### CODEOWNERSファイルの作成

`.github/CODEOWNERS` に配置：

```
# デフォルトのオーナー
* @default-reviewer

# フロントエンドチーム
/src/components/ @frontend-team
*.tsx @frontend-team @ui-specialist

# バックエンドチーム
/src/api/ @backend-team
/src/models/ @backend-team @db-admin

# ドキュメント
/docs/ @docs-team
*.md @docs-team

# インフラ
/infrastructure/ @devops-team
Dockerfile @devops-team
.github/workflows/ @devops-team

# セキュリティ関連（複数のオーナー）
/src/auth/ @security-team @backend-team
```

### パターンの書き方

| パターン | 説明 |
|----------|------|
| `*` | すべてのファイル |
| `*.js` | .jsファイル |
| `/docs/` | ルートのdocsディレクトリ |
| `docs/` | 任意の場所のdocsディレクトリ |
| `/src/**/test/` | srcの任意の深さのtestディレクトリ |

### オーナーの指定方法

```
# ユーザー名
/src/ @username

# チーム名（Organization）
/src/ @org-name/team-name

# メールアドレス
/docs/ email@example.com
```

:::message alert
CODEOWNERSに指定されたユーザーは、リポジトリへの書き込み権限が必要です。
:::

## 必須レビュー設定

### ブランチ保護ルールでの設定

Settings → Branches → Branch protection rules：

| 設定 | 説明 |
|------|------|
| **Require a pull request before merging** | PRなしのマージを禁止 |
| **Require approvals** | 承認が必要 |
| **Required number of approvals** | 必要な承認数（1〜6） |
| **Dismiss stale pull request approvals** | 新しいコミットで承認を取り消し |
| **Require review from Code Owners** | CODEOWNERS の承認が必要 |
| **Require approval of the most recent push** | 最新プッシュの承認が必要 |

### 推奨設定

```
小規模チーム（〜5人）:
- 必須承認数: 1
- CODEOWNERS: 任意

中規模チーム（5〜15人）:
- 必須承認数: 1〜2
- CODEOWNERS: 有効

大規模チーム（15人〜）:
- 必須承認数: 2以上
- CODEOWNERS: 有効
- ステータスチェック: 必須
```

## 効果的なレビューのコツ

### レビュアーとして

#### 良いコメントの例

```markdown
❌ 悪い例：
「これは間違っています」

✅ 良い例：
「このアプローチだと N+1 クエリが発生する可能性があります。
eager loading を使うことで改善できます：
\`\`\`ruby
User.includes(:posts).where(active: true)
\`\`\`」
```

#### レビューのチェックリスト

- [ ] **機能**: 仕様を満たしているか
- [ ] **設計**: 適切なアーキテクチャか
- [ ] **可読性**: 理解しやすいコードか
- [ ] **エラー処理**: 例外ケースに対応しているか
- [ ] **テスト**: 十分なテストがあるか
- [ ] **セキュリティ**: 脆弱性がないか
- [ ] **パフォーマンス**: 性能問題がないか

### PR作成者として

1. **セルフレビュー**: 提出前に自分でレビュー
2. **小さく保つ**: 1PRは300行以下が理想
3. **コンテキストを提供**: なぜこの変更が必要か説明
4. **迅速に対応**: レビューコメントには素早く返信

## レビュー会話の解決

### Resolving conversations

レビューコメントへの対応が完了したら：

1. 対応コミットをプッシュ
2. 該当のコメントで「Resolve conversation」

### レビュー後のフロー

```
1. レビュアーがコメント/承認/変更要求
   ↓
2. 作成者が対応（コミット追加）
   ↓
3. 会話を解決 (Resolve conversation)
   ↓
4. 再レビュー（必要な場合）
   ↓
5. 承認
   ↓
6. マージ
```

---

## 中級者向けTips

### レビューコメントのフィルタリング

```
GitHub UIで:
- Show comments: すべてのコメントを表示
- Hide resolved: 解決済みを非表示
- Jump to conversation: 特定の会話へジャンプ
```

### コードオーナーの優先順位

CODEOWNERSファイルは**最後にマッチしたルールが優先**されます：

```
# この順序で
* @default-owner           # 最初にすべてにマッチ
/src/ @src-owner          # src/内はこちらが優先
/src/auth/ @security-team # src/auth/内はこちらが優先
```

### Pending reviews の管理

レビュー中のコメントは「Pending」状態で保存されます：

```bash
# Pending reviewsを確認
gh pr view 123 --comments
```

### GitHub Actions でのレビュー自動化

```yaml
# 自動でラベル付け
name: Label PR
on: pull_request

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

### レビュアーの自動アサイン

```yaml
# .github/workflows/auto-assign.yml
name: Auto Assign
on:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - uses: kentaro-m/auto-assign-action@v1.2.5
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

---

## まとめ

| 項目 | ポイント |
|------|----------|
| コメント | 具体的で建設的なフィードバック |
| サジェスチョン | コード変更を直接提案 |
| ステータス | Comment / Approve / Request changes |
| CODEOWNERS | ファイル別の自動レビュアー割り当て |
| 必須レビュー | ブランチ保護で承認を必須化 |

### レビューのベストプラクティス

1. **早めにレビュー**: PRは1営業日以内にレビュー開始
2. **建設的に**: 批判ではなく改善提案
3. **学びの場に**: 知識共有の機会として活用
4. **自動化**: linter, formatter, CI で機械的チェック

次の章では、WebUIでのファイル編集について学びます。
