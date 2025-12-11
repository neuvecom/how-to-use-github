---
title: "Gists & Wiki"
quiz:
  - question: "GistとWikiの主な違いとして正しいものはどれですか？"
    options:
      - "GistはドキュメントでWikiはコードスニペット"
      - "Gistはコードスニペット共有でWikiはプロジェクトドキュメント"
      - "GistとWikiは同じ機能の別名"
      - "GistはPrivate専用でWikiはPublic専用"
    answer: 1
  - question: "GitHub CLIでGistを作成するコマンドはどれですか？"
    options:
      - "gh gist new script.py"
      - "gh gist create script.py"
      - "gh gist add script.py"
      - "gh gist upload script.py"
    answer: 1
  - question: "Wikiのサイドバーをカスタマイズするファイル名は何ですか？"
    options:
      - "sidebar.md"
      - "_Navigation.md"
      - "_Sidebar.md"
      - "menu.md"
    answer: 2
---

この章では、コードスニペット共有のためのGistsと、プロジェクトドキュメントのためのWikiについて学びます。

## Gists

### Gistsとは

**Gist**は、コードスニペットやメモを簡単に共有できるサービスです。小さなコード片やスクリプトの共有に最適です。

### 特徴

| 特徴 | 説明 |
|------|------|
| **Gitリポジトリ** | 各Gistは独立したGitリポジトリ |
| **バージョン管理** | 変更履歴の追跡が可能 |
| **埋め込み** | ブログやサイトに埋め込み可能 |
| **フォーク** | 他のGistをフォーク可能 |
| **シンタックスハイライト** | 多言語対応 |

### Gistの作成

1. [gist.github.com](https://gist.github.com) にアクセス
2. ファイル名と内容を入力
3. 公開設定を選択:
   - **Public**: 検索可能、誰でも閲覧可能
   - **Secret**: URLを知っている人のみアクセス可能

### GitHub CLIでの操作

```bash
# Gistの作成
gh gist create script.py --desc "Utility script"

# 複数ファイル
gh gist create file1.js file2.js --desc "Related scripts"

# 標準入力から作成
echo "console.log('Hello')" | gh gist create --filename hello.js

# 公開/秘密の指定
gh gist create script.py --public
gh gist create script.py --secret  # デフォルト

# Gistの一覧
gh gist list

# Gistの表示
gh gist view <gist-id>

# Gistの編集
gh gist edit <gist-id>

# Gistの削除
gh gist delete <gist-id>
```

### Gistのクローン

```bash
# Gistをクローン
git clone https://gist.github.com/<gist-id>.git

# 変更をプッシュ
cd <gist-id>
# ファイルを編集
git add .
git commit -m "Update script"
git push
```

### Gistの埋め込み

```html
<!-- ブログやウェブサイトに埋め込み -->
<script src="https://gist.github.com/username/gist-id.js"></script>

<!-- 特定のファイルのみ -->
<script src="https://gist.github.com/username/gist-id.js?file=script.py"></script>
```

### Gistの活用例

```yaml
用途:
- コードスニペットの共有
- 設定ファイルのバックアップ
- 簡単なスクリプトの公開
- ブログ記事のコード例
- チーム内でのノウハウ共有
- インタビュー問題の共有
```

### Markdownでの活用

```markdown
<!-- README.mdなど -->
# 設定ファイル

以下のGistを参照してください:
https://gist.github.com/username/gist-id

```

## Wiki

### Wikiとは

**GitHub Wiki**は、リポジトリに付属するドキュメント管理機能です。プロジェクトの詳細なドキュメントを作成できます。

### 有効化

```yaml
Settings → Features:
  ☑ Wikis

制限:
  ☐ Restrict editing to collaborators only
  # チェックなし: 誰でも編集可能
  # チェックあり: コラボレーターのみ
```

### ページの作成

1. リポジトリ → Wiki タブ
2. 「Create the first page」または「New Page」
3. ページ名と内容を入力
4. 保存

### ページ構造

```
Wiki/
├── Home.md           # トップページ
├── Getting-Started.md
├── Installation.md
├── Configuration.md
├── API/
│   ├── Overview.md
│   ├── Endpoints.md
│   └── Authentication.md
└── FAQ.md
```

### Markdown記法

```markdown
# ページタイトル

## セクション

通常のMarkdown記法が使えます。

### 内部リンク
[[Page Name]]
[[Page Name|表示テキスト]]
[[API/Overview]]

### 画像
![代替テキスト](images/screenshot.png)

### コードブロック
```python
def hello():
    print("Hello, Wiki!")
```

### テーブル
| 列1 | 列2 |
|-----|-----|
| A   | B   |
```

### サイドバーのカスタマイズ

`_Sidebar.md` を作成:

```markdown
## Navigation

* [[Home]]
* [[Getting Started]]
* [[Installation]]

## API
* [[API/Overview|API概要]]
* [[API/Endpoints|エンドポイント]]

## Links
* [GitHub](https://github.com)
```

### フッターのカスタマイズ

`_Footer.md` を作成:

```markdown
---
Copyright © 2024 My Project. Licensed under MIT.

[Report an issue](https://github.com/user/repo/issues)
```

### Wikiのクローン

```bash
# Wikiをクローン
git clone https://github.com/user/repo.wiki.git

# ローカルで編集
cd repo.wiki
# ファイルを編集
git add .
git commit -m "Update documentation"
git push
```

### Wikiの制限

```yaml
制限事項:
- 検索機能は限定的
- SEO対応が弱い
- カスタムテーマ不可
- 高度なレイアウト不可

代替案:
- GitHub Pages（静的サイト）
- Docusaurus / VitePress
- ReadTheDocs
- Notion / Confluence
```

## GistsとWikiの使い分け

### 比較

| 項目 | Gist | Wiki |
|------|------|------|
| 用途 | コードスニペット | ドキュメント |
| 規模 | 小〜中 | 中〜大 |
| 構造 | フラット | 階層的 |
| 検索 | GitHub全体 | リポジトリ内 |
| 埋め込み | 可能 | 不可 |
| 独立性 | 高い | リポジトリに付属 |

### 選択基準

```yaml
Gistを使う場合:
- 単体のコードスニペット
- 設定ファイルのテンプレート
- 共有したい小さなスクリプト
- ブログへの埋め込み

Wikiを使う場合:
- プロジェクトのドキュメント
- 開発者ガイド
- API仕様書
- チュートリアル
```

---

## 中級者向けTips

### Gist APIの活用

```bash
# Gist一覧の取得
gh api /gists --jq '.[].description'

# 特定のGist取得
gh api /gists/{gist_id}

# Gistの作成（API）
gh api /gists \
  --method POST \
  -f description='My gist' \
  -f public=true \
  -f 'files[script.py][content]=print("Hello")'
```

### Wikiの自動生成

```yaml
# .github/workflows/wiki.yml
name: Update Wiki

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  wiki:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Clone wiki
        run: |
          git clone https://github.com/${{ github.repository }}.wiki.git wiki

      - name: Copy docs
        run: |
          cp -r docs/* wiki/

      - name: Push to wiki
        run: |
          cd wiki
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "Auto-update from main" || exit 0
          git push
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Gistを使った設定共有

```bash
# dotfilesの管理
gh gist create ~/.vimrc ~/.bashrc ~/.gitconfig --desc "My dotfiles"

# 復元
gh gist view <gist-id> --filename .vimrc > ~/.vimrc
```

### Wiki検索の改善

```markdown
<!-- Home.md にインデックスを作成 -->
# Documentation Index

## Sections
- [[Getting Started]] - 始め方
- [[Installation]] - インストール
- [[Configuration]] - 設定

## Quick Links
- [[FAQ]] - よくある質問
- [[Troubleshooting]] - トラブルシューティング
- [[Changelog]] - 変更履歴

## Keywords
authentication, API, configuration, deployment...
```

---

## まとめ

| 機能 | Gist | Wiki |
|------|------|------|
| 用途 | スニペット共有 | ドキュメント |
| Git管理 | ✅ | ✅ |
| 埋め込み | ✅ | ❌ |
| 階層構造 | ❌ | ✅ |
| 検索性 | 高い | 低い |

### ベストプラクティス

```yaml
Gist:
- 説明文を必ず記載
- ファイル名に拡張子を付ける
- 定期的に整理・削除

Wiki:
- Home.mdを充実させる
- サイドバーで構造化
- 画像は適切なサイズに
- 定期的な更新
```

### 代替ツールの検討

```yaml
より高度なドキュメントが必要な場合:
- Docusaurus: Reactベースの静的サイト
- VitePress: Vueベースの静的サイト
- GitBook: オンラインドキュメント
- ReadTheDocs: Python向けドキュメント
- Notion: チームコラボレーション
```

次の章では、GitHub Codespacesについて学びます。
