---
title: "Discussions"
quiz:
  - question: "GitHub DiscussionsとIssuesの主な違いは何ですか？"
    options:
      - "Discussionsはコード専用、Issuesは質問専用"
      - "Discussionsはオープンな議論向け、Issuesはタスク追跡向け"
      - "Discussionsは有料機能、Issuesは無料機能"
      - "違いはない"
    answer: 1
  - question: "Discussionsのカテゴリで「Announcements」の特徴は何ですか？"
    options:
      - "誰でも投稿できる"
      - "メンテナーのみが新規投稿可能"
      - "自動で削除される"
      - "非公開で閲覧できる"
    answer: 1
  - question: "DiscussionをIssueに変換できる理由は何ですか？"
    options:
      - "議論から具体的なタスクが生まれた場合に追跡しやすくするため"
      - "Discussionを削除するため"
      - "コードを実行するため"
      - "セキュリティを強化するため"
    answer: 0
---

この章では、GitHub Discussionsを使ったコミュニティコミュニケーションについて学びます。

## Discussionsとは

**Discussions**は、コードに関係のない議論やQ&A、アナウンスメントのための機能です。Issuesとは異なり、より自由形式の対話に適しています。

### Issuesとの違い

| 項目 | Issues | Discussions |
|------|--------|-------------|
| 目的 | タスク・バグ追跡 | 議論・Q&A |
| 状態管理 | Open/Closed | 回答済み/未回答 |
| 投票 | なし | あり（Upvote） |
| カテゴリ | ラベル | 専用カテゴリ |
| 変換 | → Discussion | → Issue |

### 使い分け

```
Discussions を使う:
- 質問・ヘルプ依頼
- アイデアの議論
- プロジェクトのアナウンス
- 一般的な会話
- 投票が必要な決定

Issues を使う:
- バグ報告
- 機能要望（実装予定あり）
- タスク管理
- PRに紐づく作業
```

## Discussionsの有効化

1. リポジトリの Settings
2. General → Features
3. **Discussions** にチェック

## カテゴリの設定

### デフォルトカテゴリ

| カテゴリ | 形式 | 用途 |
|----------|------|------|
| **Announcements** | 📣 | お知らせ（メンテナーのみ投稿可） |
| **General** | 💬 | 一般的な議論 |
| **Ideas** | 💡 | アイデア・提案 |
| **Polls** | 🗳️ | 投票 |
| **Q&A** | ❓ | 質問と回答 |
| **Show and tell** | 🙌 | 成果の共有 |

### カスタムカテゴリの作成

Discussions → Categories → New category:

```yaml
カテゴリ例:
- 📚 Documentation: ドキュメントに関する質問
- 🔧 Configuration: 設定・セットアップの質問
- 🤝 Collaboration: コラボレーション募集
- 🎉 Release Notes: リリース情報
```

### カテゴリ形式

| 形式 | 説明 |
|------|------|
| **Discussion** | 自由形式の議論 |
| **Q&A** | 質問と回答（回答を選択可能） |
| **Announcement** | メンテナーのみ投稿可 |
| **Poll** | 投票形式 |

## Q&A機能

### 質問の投稿

1. Discussions → New discussion
2. カテゴリ「Q&A」を選択
3. 質問を投稿

### 回答のマーク

回答者またはメンテナーが「Mark as answer」で正解をマーク:

```
質問: Node.js のバージョンは？
  └─ 回答1: v18 がおすすめ
  └─ 回答2: v20 LTS を推奨 ✅ Marked as answer
  └─ 回答3: 古いバージョンも可
```

### 検索での活用

回答済みの質問は検索で見つけやすく、同じ質問の重複を防げます。

## 投票機能

### Poll の作成

1. カテゴリ「Polls」を選択
2. 質問文を入力
3. 選択肢を追加
4. 投票期限を設定（任意）

### 活用例

```
🗳️ 次にサポートすべきフレームワークは？
○ React (45%)
○ Vue (30%)
○ Svelte (15%)
○ Angular (10%)

期限: 2024年1月31日
```

## アナウンスメント

### Announcement の作成

メンテナー（Write権限以上）のみが投稿可能:

1. カテゴリ「Announcements」を選択
2. 重要なお知らせを投稿
3. 固定（Pin）も可能

### 活用例

```
📣 v2.0 リリースのお知らせ

本日、v2.0 をリリースしました。

## 主な変更点
- 新機能A
- 新機能B
- 破壊的変更C

## アップグレード方法
...
```

## DiscussionからIssueへの変換

議論から具体的なタスクが生まれた場合:

1. Discussion を開く
2. 右サイドバー → 「Create issue from discussion」
3. Issue が作成され、Discussion にリンクが追加される

逆に Issue → Discussion への変換も可能。

## コミュニティ管理

### 行動規範（Code of Conduct）

1. リポジトリに `CODE_OF_CONDUCT.md` を追加
2. Discussions のガイドラインとして機能

### 不適切な投稿の対応

- **Lock**: 追加コメントを禁止
- **Delete**: 投稿を削除
- **Report**: GitHubに報告
- **Convert**: Issueに変換して対処

### モデレーション設定

Settings → Moderation:
- 最小アカウント年齢
- 最初の投稿の承認
- スパムフィルター

---

## 中級者向けTips

### Discussions の検索

```
# 回答済み
is:answered

# 未回答
is:unanswered

# 特定カテゴリ
category:"Q&A"

# 著者
author:username

# コメント数
comments:>5
```

### GitHub CLI での操作

```bash
# Discussion一覧
gh discussion list

# Discussion作成
gh discussion create --title "質問" --body "本文" --category "Q&A"

# Discussion詳細
gh discussion view 123
```

### Discussions を活用したドキュメント

よくある質問（FAQ）をDiscussionsで管理:

1. Q&A カテゴリで質問を蓄積
2. 回答をマーク
3. 重要な質問を固定
4. 検索可能なナレッジベースに

### API での自動化

```yaml
# 新しいDiscussionをSlackに通知
name: Discussion Notification

on:
  discussion:
    types: [created]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{
              "text": "新しいDiscussion: ${{ github.event.discussion.title }}"
            }'
```

---

## まとめ

| 機能 | 用途 |
|------|------|
| Q&A | 質問と回答 |
| Polls | 投票・意見収集 |
| Announcements | 公式お知らせ |
| General | 自由な議論 |
| → Issue | 具体的タスクへ変換 |

### Discussionsのベストプラクティス

1. **カテゴリを整理**: 目的に応じた分類
2. **Q&A を活用**: 回答をマークしてFAQ化
3. **Announcement で周知**: 重要情報を見逃さない
4. **Issue と使い分け**: 議論 vs タスク
5. **コミュニティガイドライン**: ルールを明確に

次の章では、GitHub Actions基礎について学びます。
