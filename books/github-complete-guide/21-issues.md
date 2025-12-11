---
title: "Issues"
---

# Issues

この章では、GitHub Issuesの作成・管理方法、テンプレートの設定、ラベル・マイルストーンの活用を学びます。

## Issuesとは

**Issues**は、タスク、バグ、機能要望などを追跡・管理するための機能です。

### Issuesの用途

- **バグ報告**: 不具合の報告と追跡
- **機能要望**: 新機能のリクエスト
- **タスク管理**: やるべきことの記録
- **ディスカッション**: 設計や方針の議論
- **ドキュメント**: 技術的な決定の記録

## Issueの作成

### 基本的な作成手順

1. リポジトリの「Issues」タブ
2. 「New issue」ボタン
3. タイトルと本文を入力
4. 「Submit new issue」

### 効果的なIssueの書き方

```markdown
## 概要
問題や要望の簡潔な説明

## 現在の動作（バグの場合）
- 何が起きているか
- エラーメッセージ

## 期待する動作
- どうあるべきか

## 再現手順（バグの場合）
1. ○○を開く
2. ○○をクリック
3. ○○を入力

## 環境
- OS: macOS 14.0
- ブラウザ: Chrome 120
- バージョン: v1.2.3

## スクリーンショット
（必要に応じて）
```

## Issueテンプレート

### テンプレートの配置場所

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── config.yml
```

### バグ報告テンプレート

```markdown
---
name: バグ報告
about: 不具合の報告
title: '[Bug] '
labels: bug
assignees: ''
---

## バグの概要
<!-- 何が問題か簡潔に説明 -->

## 再現手順
1.
2.
3.

## 期待する動作
<!-- どう動くべきか -->

## 実際の動作
<!-- 何が起きたか -->

## 環境
- OS:
- ブラウザ:
- バージョン:

## スクリーンショット
<!-- 該当する場合は添付 -->

## 追加情報
<!-- その他の関連情報 -->
```

### 機能要望テンプレート

```markdown
---
name: 機能要望
about: 新機能のリクエスト
title: '[Feature] '
labels: enhancement
assignees: ''
---

## 概要
<!-- 追加したい機能の説明 -->

## 背景・動機
<!-- なぜこの機能が必要か -->

## 提案する解決策
<!-- どのように実現するか -->

## 代替案
<!-- 検討した他の方法 -->

## 追加情報
<!-- モックアップ、参考リンクなど -->
```

### テンプレート選択画面の設定

```yaml
# .github/ISSUE_TEMPLATE/config.yml
blank_issues_enabled: false  # 空のIssueを無効化
contact_links:
  - name: 質問・相談
    url: https://github.com/user/repo/discussions
    about: 質問はDiscussionsをご利用ください
  - name: セキュリティ問題
    url: https://github.com/user/repo/security/policy
    about: セキュリティ問題は非公開で報告してください
```

## Issueフォーム（YAML形式）

より構造化された入力フォームを作成できます。

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: バグ報告
description: 不具合を報告する
title: "[Bug]: "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        バグ報告ありがとうございます。
        以下の項目をできるだけ詳しく記入してください。

  - type: textarea
    id: description
    attributes:
      label: バグの説明
      description: 何が問題か説明してください
      placeholder: ログインボタンをクリックしても反応がない
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: 再現手順
      description: バグを再現する手順
      placeholder: |
        1. '...' に移動
        2. '...' をクリック
        3. '...' までスクロール
        4. エラーが発生
    validations:
      required: true

  - type: dropdown
    id: browsers
    attributes:
      label: ブラウザ
      description: 使用しているブラウザ
      options:
        - Chrome
        - Firefox
        - Safari
        - Edge
        - その他
    validations:
      required: true

  - type: input
    id: version
    attributes:
      label: バージョン
      description: 使用しているバージョン
      placeholder: v1.2.3
    validations:
      required: false

  - type: checkboxes
    id: terms
    attributes:
      label: 確認事項
      options:
        - label: 既存のIssueを検索しました
          required: true
        - label: 最新バージョンで確認しました
          required: false
```

## ラベル管理

### デフォルトラベル

| ラベル | 説明 |
|--------|------|
| `bug` | バグ報告 |
| `documentation` | ドキュメント |
| `duplicate` | 重複 |
| `enhancement` | 機能追加 |
| `good first issue` | 初心者向け |
| `help wanted` | 助けを求める |
| `invalid` | 無効 |
| `question` | 質問 |
| `wontfix` | 対応しない |

### カスタムラベルの作成

Issues → Labels → New label:

```
おすすめのカスタムラベル:
- priority/high, priority/medium, priority/low（優先度）
- status/in-progress, status/blocked（状態）
- type/bug, type/feature, type/chore（種類）
- area/frontend, area/backend, area/infra（領域）
```

### ラベルの一括管理

```bash
# GitHub CLI
gh label create "priority/high" --color "d73a4a" --description "高優先度"
gh label create "priority/medium" --color "fbca04" --description "中優先度"
gh label create "priority/low" --color "0e8a16" --description "低優先度"

# ラベル一覧
gh label list

# ラベル削除
gh label delete "wontfix"
```

## マイルストーン

### マイルストーンとは

リリースや期限に向けたIssueのグループ化機能です。

### 作成手順

1. Issues → Milestones → New milestone
2. タイトル、説明、期限を設定
3. Create milestone

### 使い方

```
マイルストーン例:
- v1.0.0 リリース
- 2024年Q1
- Sprint 1
- MVP
```

### Issueへの割り当て

Issue作成時またはサイドバーでマイルストーンを選択。

### 進捗の確認

Milestones ページで:
- Open/Closed の割合
- 完了率（%）
- 期限までの残り日数

## アサイン機能

### 担当者の割り当て

- Issue作成時にサイドバーで選択
- 複数人のアサインも可能
- 自分にアサイン: サイドバーで「assign yourself」

### 自動アサイン

```yaml
# .github/workflows/auto-assign.yml
name: Auto Assign
on:
  issues:
    types: [opened]
jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - uses: pozil/auto-assign-issue@v1
        with:
          assignees: username1,username2
          numOfAssignee: 1
```

## Issue間のリンク

### 参照

```markdown
# 同じリポジトリ
#123
See #123

# 別のリポジトリ
owner/repo#123

# コミットへの参照
abc1234
```

### 自動クローズ

PRで以下のキーワードを使用:

```markdown
Closes #123
Fixes #123
Resolves #123
```

### タスクリスト

```markdown
## 関連タスク
- [ ] #123 認証機能
- [x] #124 ログイン画面（完了）
- [ ] #125 ログアウト機能
```

---

## 中級者向けTips

### Issue検索

```
# 自分にアサインされたIssue
is:issue is:open assignee:@me

# 特定のラベル
is:issue label:bug label:priority/high

# マイルストーン
is:issue milestone:"v1.0.0"

# 作成日
is:issue created:>2024-01-01

# 複合検索
is:issue is:open label:bug assignee:@me sort:created-desc
```

### GitHub CLI での操作

```bash
# Issue一覧
gh issue list

# Issue作成
gh issue create --title "タイトル" --body "本文" --label "bug"

# Issue詳細
gh issue view 123

# Issueを閉じる
gh issue close 123

# Issueを再オープン
gh issue reopen 123
```

### Issueのピン留め

重要なIssueを最上部に固定:
1. Issue を開く
2. 右サイドバー → 「Pin issue」

最大3つまでピン留め可能。

---

## まとめ

| 機能 | 用途 |
|------|------|
| テンプレート | 統一フォーマットで報告 |
| フォーム | 構造化された入力 |
| ラベル | 分類・フィルタリング |
| マイルストーン | リリース計画 |
| アサイン | 担当者の明確化 |

次の章では、GitHub Projectsについて学びます。
