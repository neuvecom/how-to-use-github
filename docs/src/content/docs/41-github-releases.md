---
title: "GitHub Releases"
quiz:
  - question: "GitHub Releasesの主な用途は何ですか？"
    options:
      - "コードのバックアップ"
      - "ソフトウェアのバージョンごとの配布とリリースノートの公開"
      - "チャットコミュニケーション"
      - "ファイルの暗号化"
    answer: 1
  - question: "Releaseを作成する際に基になるのは何ですか？"
    options:
      - "Issue"
      - "Gitタグ"
      - "Pull Request"
      - "Discussion"
    answer: 1
  - question: "GitHub Releasesでリリースノートを自動生成する機能の名前は？"
    options:
      - "Auto Notes"
      - "Generate release notes"
      - "Release Builder"
      - "Note Generator"
    answer: 1
---

この章では、GitHub Releasesを使ったリリース作成と自動生成について学びます。

## Releasesとは

**GitHub Releases**は、ソフトウェアのバージョンを正式に公開するための機能です。リリースノート、バイナリファイル、ソースコードをパッケージ化して配布できます。

### Releasesの構成要素

| 要素 | 説明 |
|------|------|
| **Tag** | バージョン番号（例: v1.0.0） |
| **Title** | リリースのタイトル |
| **Release notes** | 変更内容の説明 |
| **Assets** | 添付ファイル（バイナリ等） |
| **Source code** | 自動生成されるzip/tar.gz |

## リリースの作成

### WebUIでの作成

1. リポジトリページ → Releases → Create a new release
2. 必要事項を入力:

```yaml
Choose a tag: v1.0.0（新規作成または既存選択）
Target: main（タグを付けるブランチ）
Release title: v1.0.0 - Initial Release
Description: リリースノートを記載

Options:
  ☐ Set as a pre-release（プレリリース）
  ☐ Set as the latest release（最新リリース）
```

### GitHub CLIでの作成

```bash
# タグを作成してリリース
gh release create v1.0.0 \
  --title "v1.0.0 - Initial Release" \
  --notes "## What's New
- Feature A
- Feature B

## Bug Fixes
- Fixed issue #123"

# ファイルを添付してリリース
gh release create v1.0.0 \
  --title "v1.0.0" \
  --notes-file CHANGELOG.md \
  ./dist/app-linux \
  ./dist/app-macos \
  ./dist/app-windows.exe

# ドラフトリリース
gh release create v1.0.0 --draft

# プレリリース
gh release create v1.0.0-beta.1 --prerelease
```

## リリースノートの自動生成

### 自動生成機能

GitHubは、前回のリリースからの変更を自動でリリースノートにまとめます。

```yaml
「Generate release notes」ボタンをクリック:

自動生成される内容:
- マージされたPR一覧
- 新しいコントリビューター
- 変更の要約
```

### リリースノートの設定

```yaml
# .github/release.yml
changelog:
  exclude:
    labels:
      - skip-changelog
      - dependencies
    authors:
      - dependabot

  categories:
    - title: 🚀 New Features
      labels:
        - enhancement
        - feature

    - title: 🐛 Bug Fixes
      labels:
        - bug
        - fix

    - title: 📚 Documentation
      labels:
        - documentation

    - title: 🔧 Maintenance
      labels:
        - chore
        - maintenance

    - title: 🔒 Security
      labels:
        - security
```

### 自動生成の例

```markdown
## What's Changed

### 🚀 New Features
* Add user authentication by @developer1 in #123
* Implement dark mode by @developer2 in #124

### 🐛 Bug Fixes
* Fix login error on mobile by @developer3 in #125

### 📚 Documentation
* Update API documentation by @developer1 in #126

## New Contributors
* @developer3 made their first contribution in #125

**Full Changelog**: https://github.com/user/repo/compare/v1.0.0...v1.1.0
```

## GitHub Actionsでの自動リリース

### タグプッシュ時の自動リリース

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

### ビルドしてリリース

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        include:
          - os: ubuntu-latest
            artifact: app-linux
          - os: macos-latest
            artifact: app-macos
          - os: windows-latest
            artifact: app-windows.exe

    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4

      - name: Build
        run: |
          # ビルドコマンド
          npm run build

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.artifact }}
          path: dist/${{ matrix.artifact }}

  release:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          path: dist/

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
          files: |
            dist/**/*
```

### semantic-releaseの使用

```yaml
# .github/workflows/semantic-release.yml
name: Semantic Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

```javascript
// release.config.js
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git'
  ]
};
```

## プレリリース

### プレリリースの活用

```yaml
用途:
- ベータ版の配布
- リリース候補（RC）
- 早期アクセス版

バージョン例:
- v1.0.0-alpha.1
- v1.0.0-beta.1
- v1.0.0-rc.1
```

### プレリリースの作成

```bash
# CLI
gh release create v1.0.0-beta.1 --prerelease

# WebUI
☑ Set as a pre-release
```

### プレリリースから正式リリースへ

```bash
# プレリリースを正式リリースに変更
gh release edit v1.0.0 --prerelease=false
```

## アセットの管理

### アセットの追加

```bash
# リリース作成時に追加
gh release create v1.0.0 ./app.zip ./app.dmg

# 既存リリースに追加
gh release upload v1.0.0 ./new-asset.zip
```

### アセットの削除

```bash
# アセットの一覧
gh release view v1.0.0

# アセットの削除
gh release delete-asset v1.0.0 old-asset.zip
```

### 自動生成されるアセット

```yaml
自動生成:
- Source code (zip)
- Source code (tar.gz)

URL形式:
- https://github.com/user/repo/archive/refs/tags/v1.0.0.zip
- https://github.com/user/repo/archive/refs/tags/v1.0.0.tar.gz
```

## リリースの通知

### Watch設定

リポジトリをWatchしているユーザーに通知：

```yaml
Watch options:
☑ Releases only（リリースのみ通知）
☐ All Activity
☐ Custom
```

### Webhookでの通知

```yaml
# Slack通知の例
Settings → Webhooks → Add webhook:

Payload URL: https://hooks.slack.com/services/xxx
Content type: application/json
Events: ☑ Releases
```

---

## 中級者向けTips

### CHANGELOG.mdの自動更新

```yaml
# .github/workflows/changelog.yml
name: Update CHANGELOG

on:
  release:
    types: [published]

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main

      - name: Update CHANGELOG
        run: |
          VERSION=${{ github.event.release.tag_name }}
          DATE=$(date +%Y-%m-%d)
          NOTES="${{ github.event.release.body }}"

          # 新しいエントリを追加
          sed -i "2i ## [$VERSION] - $DATE\n\n$NOTES\n" CHANGELOG.md

      - name: Commit
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add CHANGELOG.md
          git commit -m "docs: update CHANGELOG for ${{ github.event.release.tag_name }}"
          git push
```

### リリースのドラフト管理

```yaml
# PRマージ時にドラフトを更新
name: Update Release Draft

on:
  push:
    branches: [main]

jobs:
  update-draft:
    runs-on: ubuntu-latest
    steps:
      - uses: release-drafter/release-drafter@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```yaml
# .github/release-drafter.yml
name-template: 'v$RESOLVED_VERSION'
tag-template: 'v$RESOLVED_VERSION'

categories:
  - title: '🚀 Features'
    labels:
      - 'feature'
      - 'enhancement'
  - title: '🐛 Bug Fixes'
    labels:
      - 'fix'
      - 'bugfix'
      - 'bug'

change-template: '- $TITLE @$AUTHOR (#$NUMBER)'

version-resolver:
  major:
    labels:
      - 'major'
  minor:
    labels:
      - 'minor'
  patch:
    labels:
      - 'patch'
  default: patch
```

### APIでのリリース管理

```bash
# リリース一覧取得
gh api /repos/{owner}/{repo}/releases

# 最新リリース取得
gh api /repos/{owner}/{repo}/releases/latest

# リリース作成
gh api /repos/{owner}/{repo}/releases \
  --method POST \
  -f tag_name='v1.0.0' \
  -f name='v1.0.0' \
  -f body='Release notes' \
  -F draft=false \
  -F prerelease=false
```

---

## まとめ

| 機能 | 説明 |
|------|------|
| タグベース | Gitタグと連携 |
| 自動生成 | リリースノート自動作成 |
| アセット | バイナリ添付可能 |
| プレリリース | ベータ版配布 |

### Releasesのベストプラクティス

1. **セマンティックバージョニング**: v1.0.0形式を使用
2. **自動生成活用**: release.ymlでカスタマイズ
3. **CI/CD連携**: タグプッシュで自動リリース
4. **CHANGELOG管理**: リリースと同期
5. **プレリリース活用**: ベータ版の配布

### リリースフロー推奨

```yaml
1. 開発完了
   ↓
2. CHANGELOGの更新
   ↓
3. バージョンタグ作成
   git tag v1.0.0
   git push origin v1.0.0
   ↓
4. CI/CDが自動でリリース作成
   ↓
5. アセットの自動添付
   ↓
6. 通知配信
```

次の章では、GistsとWikiについて学びます。
