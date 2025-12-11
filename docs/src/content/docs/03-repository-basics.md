---
title: "リポジトリの基本"
---

この章では、リポジトリの作成から、README、.gitignore、ライセンスの設定、そしてフォーク・クローン・テンプレートの使い方を学びます。

## リポジトリとは

**リポジトリ（Repository）**は、プロジェクトのファイルと変更履歴を保存する場所です。略して「リポ」や「レポ」とも呼ばれます。

```
リポジトリに含まれるもの:
├── ソースコード
├── ドキュメント
├── 設定ファイル
├── .git/（変更履歴）
└── GitHub固有のファイル
    ├── README.md
    ├── LICENSE
    ├── .gitignore
    └── .github/（ワークフロー等）
```

## リポジトリの作成

### WebUIから作成

1. GitHubにログイン
2. 右上の「+」→「New repository」
3. 以下を設定：

| 項目 | 説明 |
|------|------|
| Repository name | リポジトリ名（英数字、ハイフン、アンダースコア） |
| Description | 説明文（任意） |
| Public / Private | 公開範囲 |
| Initialize with README | READMEを自動作成 |
| .gitignore template | 言語に応じたテンプレート |
| License | ライセンスを選択 |

### コマンドラインから作成

```bash
# GitHub CLI を使用
gh repo create my-project --private --clone

# オプション
gh repo create my-project \
  --private \
  --description "プロジェクトの説明" \
  --clone \
  --gitignore Node \
  --license MIT
```

### Public vs Private

| 種類 | 説明 | 用途 |
|------|------|------|
| **Public** | 誰でも閲覧可能 | OSS、ポートフォリオ |
| **Private** | 招待されたユーザーのみ | 業務コード、個人プロジェクト |

:::note
Freeプランでもプライベートリポジトリは無制限に作成できます。


## README.mdの書き方

READMEはリポジトリの「顔」です。GitHubはリポジトリページに自動表示します。

### 基本構成

```markdown
# プロジェクト名

プロジェクトの簡潔な説明（1〜2文）

## 特徴

- 機能1の説明
- 機能2の説明
- 機能3の説明

## インストール

\`\`\`bash
npm install my-project
\`\`\`

## 使い方

\`\`\`javascript
import { something } from 'my-project';
something();
\`\`\`

## ライセンス

MIT License
```

### バッジの追加

プロジェクトの状態を視覚的に表示：

```markdown
![Build Status](https://github.com/user/repo/workflows/CI/badge.svg)
![npm version](https://badge.fury.io/js/package-name.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

### Shields.ioでカスタムバッジ

https://shields.io/ で様々なバッジを作成できます。

```markdown
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)
```

## .gitignoreの設定

### .gitignoreとは

Gitの追跡対象から除外するファイルを指定します。

```txt
# 依存関係
node_modules/
vendor/

# ビルド成果物
dist/
build/
*.o
*.pyc

# 環境設定
.env
.env.local
*.local

# IDE設定
.vscode/
.idea/
*.swp

# OS生成ファイル
.DS_Store
Thumbs.db

# ログ
*.log
logs/
```

### テンプレートの活用

GitHubには言語別のテンプレートが用意されています：
https://github.com/github/gitignore

```bash
# リポジトリ作成時に指定
gh repo create my-project --gitignore Node

# 既存リポジトリに追加
curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore
```

### グローバル.gitignore

全リポジトリ共通で除外したいファイル（IDEの設定等）：

```bash
# グローバル設定
git config --global core.excludesfile ~/.gitignore_global

# ~/.gitignore_global の内容例
.DS_Store
.vscode/
*.swp
```

:::note
プロジェクト固有でない設定（IDE等）は、グローバル.gitignoreに書くのがベストプラクティスです。


## ライセンスの選択

### なぜライセンスが重要か

ライセンスがないコードは、デフォルトで著作権保護されます。他者が使用・改変・配布するには、明示的な許可が必要です。

### 主要なライセンス比較

| ライセンス | 特徴 | 用途 |
|------------|------|------|
| **MIT** | 最も緩い。著作権表示のみ必要 | 広く使われたい |
| **Apache 2.0** | 特許権の明示的許諾あり | 企業利用を想定 |
| **GPL v3** | 派生物も同じライセンス必須 | OSSを守りたい |
| **BSD 3-Clause** | MIT同様に緩い | 学術系で多い |
| **Unlicense** | パブリックドメイン | 完全に自由に |

### 選び方フローチャート

```
Q: 派生物も同じライセンスにしたい？
├─ Yes → GPL系
└─ No
   Q: 特許権について明示したい？
   ├─ Yes → Apache 2.0
   └─ No → MIT
```

### ライセンスファイルの追加

```bash
# リポジトリ作成時に指定
gh repo create my-project --license MIT

# 後から追加（GitHubのUIで）
# Add file → Create new file → LICENSE と入力
# → 右側に「Choose a license template」が表示される
```

## リポジトリのフォーク

**フォーク（Fork）**は、他人のリポジトリを自分のアカウントにコピーすることです。

### フォークの用途

1. **OSSへの貢献**: フォーク → 修正 → プルリクエスト
2. **学習**: 他人のコードを自由に改変して学ぶ
3. **派生プロジェクト**: 既存プロジェクトをベースに新しいものを作る

### フォークの手順

1. フォークしたいリポジトリを開く
2. 右上の「Fork」ボタンをクリック
3. 自分のアカウントを選択

### フォーク元との同期

```bash
# フォーク元をupstreamとして追加
git remote add upstream https://github.com/original-owner/repo.git

# フォーク元の変更を取得
git fetch upstream

# mainブランチに反映
git checkout main
git merge upstream/main
```

## リポジトリのクローン

**クローン（Clone）**は、リモートリポジトリをローカルにコピーすることです。

### クローンの方法

```bash
# HTTPS（認証が必要）
git clone https://github.com/user/repo.git

# SSH（SSH鍵設定済みの場合）
git clone git@github.com:user/repo.git

# GitHub CLI
gh repo clone user/repo

# 特定のディレクトリに
git clone https://github.com/user/repo.git my-directory

# 浅いクローン（履歴を1件だけ）
git clone --depth 1 https://github.com/user/repo.git
```

### クローンとフォークの違い

| 操作 | 対象 | 結果 |
|------|------|------|
| **フォーク** | GitHub上 | 自分のアカウントにリポジトリのコピー |
| **クローン** | ローカル | PC上にリポジトリのコピー |

```
OSS貢献の流れ:
1. フォーク（GitHub上にコピー）
2. クローン（ローカルにコピー）
3. 修正してコミット
4. プッシュ（自分のフォークへ）
5. プルリクエスト（元リポジトリへ）
```

## リポジトリのテンプレート化

### テンプレートリポジトリとは

リポジトリをテンプレートとして設定すると、そこから新しいリポジトリを簡単に作成できます。

### テンプレートの設定

1. リポジトリの **Settings**
2. **General** → **Template repository** にチェック

### テンプレートからリポジトリを作成

1. テンプレートリポジトリを開く
2. 「Use this template」→「Create a new repository」
3. 新しいリポジトリ名を入力

### フォークとテンプレートの違い

| 項目 | フォーク | テンプレート |
|------|----------|--------------|
| Git履歴 | 引き継ぐ | 引き継がない（新規） |
| 元との関係 | リンクあり | なし |
| 用途 | 元への貢献 | 新規プロジェクト開始 |

:::note
プロジェクトの雛形（ボイラープレート）にはテンプレートが適しています。


---

## 中級者向けTips

### リポジトリの移譲（Transfer）

```bash
# Settings → Danger Zone → Transfer ownership
# または
gh repo transfer owner/repo new-owner
```

### リポジトリのアーカイブ

開発終了したリポジトリは読み取り専用にできます：

```bash
# Settings → Danger Zone → Archive this repository
```

### リポジトリの統計情報

```bash
# Insights タブで確認できる情報
- Contributors（貢献者）
- Commits（コミット推移）
- Code frequency（コード量の変化）
- Dependency graph（依存関係）
- Network（フォーク関係）
```

### .github ディレクトリの特殊ファイル

```
.github/
├── ISSUE_TEMPLATE/        # Issueテンプレート
│   ├── bug_report.md
│   └── feature_request.md
├── PULL_REQUEST_TEMPLATE.md  # PRテンプレート
├── CODEOWNERS             # コード所有者
├── FUNDING.yml            # スポンサー設定
├── dependabot.yml         # Dependabot設定
└── workflows/             # GitHub Actions
    └── ci.yml
```

---

## まとめ

| 項目 | ポイント |
|------|----------|
| リポジトリ作成 | Public/Privateを目的に応じて選択 |
| README | プロジェクトの顔、基本情報を記載 |
| .gitignore | 追跡不要なファイルを除外 |
| ライセンス | OSSならMITが一般的 |
| フォーク | 他人のリポジトリを自分のアカウントへコピー |
| クローン | リモートをローカルへコピー |
| テンプレート | 新規プロジェクトの雛形として利用 |

次の章では、Gitの基本操作（コミット、プッシュ、プル）を学びます。
