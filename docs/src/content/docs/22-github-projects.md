---
title: "GitHub Projects"
quiz:
  - question: "GitHub Projects（新版）で利用できるビュー形式でないものはどれですか？"
    options:
      - "ボードビュー"
      - "テーブルビュー"
      - "ガントチャートビュー"
      - "ロードマップビュー"
    answer: 2
  - question: "GitHub Projectsでカスタムフィールドを追加する主な目的は何ですか？"
    options:
      - "ファイルを保存するため"
      - "アイテムに追加情報（優先度、見積もりなど）を付与するため"
      - "コードを実行するため"
      - "セキュリティを強化するため"
    answer: 1
  - question: "GitHub Projectsの自動化で利用されるワークフローとは何ですか？"
    options:
      - "手動でアイテムを移動する機能"
      - "ステータス変更やIssueクローズ時の自動アクション"
      - "コードの自動コンパイル"
      - "メールの自動送信"
    answer: 1
---

この章では、GitHub Projectsを使ったプロジェクト管理について学びます。ボード、テーブル、ロードマップビューと自動化ワークフローを解説します。

## GitHub Projectsとは

**GitHub Projects**は、Issue やPR を視覚的に管理するプロジェクト管理ツールです。2022年に大幅リニューアルされ、より柔軟な管理が可能になりました。

### 特徴

- 複数のビュー（ボード、テーブル、ロードマップ）
- カスタムフィールド
- 自動化ワークフロー
- 複数リポジトリのIssueを統合管理

## プロジェクトの作成

### リポジトリレベル

1. リポジトリの「Projects」タブ
2. 「New project」
3. テンプレートを選択（またはBlank）

### Organization / ユーザーレベル

1. プロフィール → Projects
2. 「New project」
3. 複数リポジトリを横断して管理可能

## ビューの種類

### Board（ボード）ビュー

カンバン形式でカードを管理:

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  Todo   │ │In Progress│ │ Review  │ │  Done   │
├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤
│ Issue 1 │ │ Issue 3 │ │ Issue 5 │ │ Issue 7 │
│ Issue 2 │ │ Issue 4 │ │ Issue 6 │ │ Issue 8 │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

カードをドラッグ＆ドロップでステータス変更。

### Table（テーブル）ビュー

スプレッドシート形式で管理:

| Title | Status | Assignee | Priority | Due Date |
|-------|--------|----------|----------|----------|
| Issue 1 | Todo | @user1 | High | 2024-01-15 |
| Issue 2 | In Progress | @user2 | Medium | 2024-01-20 |

Excel/Notion のような操作感。

### Roadmap（ロードマップ）ビュー

タイムライン形式で期間を可視化:

```
January                    February
|-------- Issue 1 --------|
      |---- Issue 2 ----|
                  |-------- Issue 3 --------|
```

開始日・終了日フィールドが必要。

## カスタムフィールド

### フィールドの種類

| タイプ | 説明 | 例 |
|--------|------|-----|
| **Text** | テキスト入力 | メモ、URL |
| **Number** | 数値 | ストーリーポイント、工数 |
| **Date** | 日付 | 期限、開始日 |
| **Single select** | 単一選択 | ステータス、優先度 |
| **Iteration** | イテレーション | スプリント |

### フィールドの追加

1. テーブルビューで「+」列をクリック
2. フィールドタイプを選択
3. 名前とオプションを設定

### よく使うカスタムフィールド

```yaml
Status（単一選択）:
  - 📋 Todo
  - 🔄 In Progress
  - 👀 In Review
  - ✅ Done

Priority（単一選択）:
  - 🔴 High
  - 🟡 Medium
  - 🟢 Low

Story Points（数値）:
  - 1, 2, 3, 5, 8, 13

Sprint（イテレーション）:
  - Sprint 1: 2024-01-01 〜 2024-01-14
  - Sprint 2: 2024-01-15 〜 2024-01-28
```

## イテレーション管理

### イテレーションフィールドの設定

1. フィールド追加 → Iteration
2. イテレーション期間を設定（例: 2週間）
3. 開始日を設定

### スプリント計画

1. Issue をイテレーションに割り当て
2. ボードビューでイテレーションごとにフィルタ
3. 進捗を追跡

## 自動化ワークフロー

### 組み込みワークフロー

プロジェクト設定 → Workflows:

| ワークフロー | 動作 |
|--------------|------|
| **Item added** | 追加時にステータスを設定 |
| **Item reopened** | 再オープン時にステータス変更 |
| **Item closed** | クローズ時にステータスを Done に |
| **PR merged** | マージ時にステータスを Done に |
| **Auto-add to project** | 条件に合うIssueを自動追加 |

### 自動追加の設定

```
フィルタ例:
- is:issue is:open label:bug
- is:pr is:open author:@me
- is:issue is:open milestone:"v1.0"
```

### GitHub Actions との連携

```yaml
# Issue作成時にProjectに追加
name: Add to Project

on:
  issues:
    types: [opened]

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/myorg/projects/1
          github-token: ${{ secrets.PROJECT_TOKEN }}
```

## インサイト機能

### チャートの作成

1. プロジェクト → Insights
2. 「New chart」
3. チャートタイプを選択

### チャートの種類

- **Bar chart**: ステータス別、担当者別の集計
- **Line chart**: 時系列での推移
- **Stacked area**: 累積表示

### 例: バーンダウンチャート風

```
設定:
- X軸: 日付
- Y軸: Open items count
- グループ: なし
```

## 複数ビューの活用

### ビューの使い分け

| ビュー | 用途 |
|--------|------|
| **全体ボード** | 全体のステータス把握 |
| **マイタスク** | 自分のタスクをフィルタ |
| **今週のスプリント** | 現在のイテレーション |
| **バックログ** | 未着手のアイテム一覧 |

### ビューの作成

1. 「+ New view」をクリック
2. ビュータイプを選択
3. フィルタ・グループ化・ソートを設定
4. ビュー名を設定

### フィルタ例

```
# 自分のタスク
assignee:@me

# 高優先度
priority:High

# 今週締め切り
due:<=2024-01-21

# 複合条件
status:"In Progress" assignee:@me
```

---

## 中級者向けTips

### GraphQL API での操作

```bash
# プロジェクト情報の取得
gh api graphql -f query='
  query {
    user(login: "username") {
      projectV2(number: 1) {
        title
        items(first: 10) {
          nodes {
            content {
              ... on Issue {
                title
              }
            }
          }
        }
      }
    }
  }
'
```

### プロジェクトテンプレート

既存プロジェクトをコピー:
1. プロジェクト → Settings → Copy project
2. ビュー、フィールド、ワークフローが複製される

### キーボードショートカット

| ショートカット | 動作 |
|----------------|------|
| `Cmd/Ctrl + K` | コマンドパレット |
| `Space` | アイテムを開く |
| `E` | 編集モード |
| `/` | フィルタ |

### 外部ツール連携

```yaml
# Slack通知
name: Project Update Notification
on:
  projects_v2_item:
    types: [edited]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify Slack
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{"text": "Project item updated"}'
```

---

## まとめ

| 機能 | 用途 |
|------|------|
| ボードビュー | カンバン形式の管理 |
| テーブルビュー | 詳細な一覧表示 |
| ロードマップ | スケジュール可視化 |
| カスタムフィールド | 柔軟なデータ管理 |
| 自動化 | 手動作業の削減 |

次の章では、Discussionsについて学びます。
