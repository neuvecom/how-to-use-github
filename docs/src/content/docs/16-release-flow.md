---
title: "リリースフロー"
---

# リリースフロー

この章では、セマンティックバージョニング、CHANGELOG管理、タグ運用、リリースノートの自動生成について学びます。

## セマンティックバージョニング

### 基本形式

```
MAJOR.MINOR.PATCH
例: 1.2.3
```

### バージョンの意味

| 部分 | 意味 | いつ上げるか |
|------|------|--------------|
| **MAJOR** | メジャー | 後方互換性のない変更 |
| **MINOR** | マイナー | 後方互換性のある機能追加 |
| **PATCH** | パッチ | 後方互換性のあるバグ修正 |

### 具体例

```
1.0.0 → 1.0.1  # バグ修正
1.0.1 → 1.1.0  # 新機能追加（後方互換あり）
1.1.0 → 2.0.0  # 破壊的変更（後方互換なし）
```

### プレリリースとメタデータ

```
# プレリリース（-に続けて識別子）
1.0.0-alpha
1.0.0-beta.1
1.0.0-rc.1

# メタデータ（+に続けて識別子）
1.0.0+build.123
1.0.0-beta.1+build.456
```

### バージョン比較

```
1.0.0 < 1.0.1 < 1.1.0 < 2.0.0
1.0.0-alpha < 1.0.0-beta < 1.0.0-rc.1 < 1.0.0
```

## CHANGELOG管理

### CHANGELOGの目的

1. ユーザーに変更内容を伝える
2. バージョン間の違いを明確に
3. 破壊的変更への注意喚起

### Keep a Changelog形式

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- 新機能の説明

### Changed
- 変更の説明

### Deprecated
- 非推奨になった機能

### Removed
- 削除された機能

### Fixed
- バグ修正

### Security
- セキュリティ修正

## [1.1.0] - 2024-01-15

### Added
- ユーザー検索機能を追加 (#123)
- ダッシュボードにグラフを追加 (#456)

### Fixed
- ログインエラーを修正 (#789)

## [1.0.0] - 2024-01-01

### Added
- 初回リリース

[Unreleased]: https://github.com/user/repo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/user/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

### CHANGELOGのベストプラクティス

1. **ユーザー視点で書く**: 技術的な詳細よりも影響を説明
2. **Issue/PRにリンク**: 詳細を追跡可能に
3. **破壊的変更を強調**: 明確にマーク
4. **リリース日を記載**: いつの変更かわかるように

## タグ運用

### タグの作成

```bash
# 軽量タグ
git tag v1.0.0

# 注釈付きタグ（推奨）
git tag -a v1.0.0 -m "Version 1.0.0"

# 過去のコミットにタグ
git tag -a v1.0.0 abc1234 -m "Version 1.0.0"

# タグをプッシュ
git push origin v1.0.0

# 全タグをプッシュ
git push origin --tags
```

### タグの確認

```bash
# タグ一覧
git tag

# パターンで絞り込み
git tag -l "v1.*"

# タグの詳細
git show v1.0.0
```

### タグの削除

```bash
# ローカルタグを削除
git tag -d v1.0.0

# リモートタグを削除
git push origin --delete v1.0.0
```

### タグ命名規則

```
推奨:
v1.0.0      # vプレフィックス付き
1.0.0       # プレフィックスなし

避ける:
release-1.0.0  # 冗長
version-1.0.0  # 冗長
v1            # 不完全
```

## リリースノート自動生成

### GitHub Releasesの活用

1. リポジトリ → Releases → Draft a new release
2. タグを選択または作成
3. 「Generate release notes」をクリック
4. 自動生成されたノートを編集
5. Publish release

### 自動生成の設定

`.github/release.yml`:

```yaml
changelog:
  exclude:
    labels:
      - ignore-for-release
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
        - bugfix
    - title: 📚 Documentation
      labels:
        - documentation
    - title: 🔧 Maintenance
      labels:
        - chore
        - maintenance
    - title: ⬆️ Dependencies
      labels:
        - dependencies
    - title: Other Changes
      labels:
        - "*"
```

### 生成されるリリースノート例

```markdown
## What's Changed

### 🚀 New Features
* feat: ユーザー検索機能を追加 by @developer1 in #123
* feat: ダッシュボードにグラフを追加 by @developer2 in #456

### 🐛 Bug Fixes
* fix: ログインエラーを修正 by @developer1 in #789

### 📚 Documentation
* docs: READMEを更新 by @developer3 in #101

**Full Changelog**: https://github.com/user/repo/compare/v1.0.0...v1.1.0
```

## 自動リリースワークフロー

### タグプッシュでリリース作成

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
          draft: false
          prerelease: ${{ contains(github.ref, '-') }}
```

### standard-versionによる自動化

```bash
npm install --save-dev standard-version
```

```json
// package.json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:patch": "standard-version --release-as patch"
  }
}
```

```bash
# 実行すると:
# 1. package.jsonのバージョンを更新
# 2. CHANGELOG.mdを更新
# 3. コミットを作成
# 4. タグを作成
npm run release

# プッシュ
git push --follow-tags origin main
```

### semantic-releaseによる完全自動化

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
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

コミットメッセージからバージョンを自動決定：

```
feat: → MINOR バージョンアップ
fix:  → PATCH バージョンアップ
BREAKING CHANGE: → MAJOR バージョンアップ
```

---

## 中級者向けTips

### リリースブランチの活用

```
# Git Flowスタイル
main ← release/v1.2.0 ← develop

# リリース前の調整
git checkout -b release/v1.2.0 develop
# バグ修正、バージョン更新等
git checkout main
git merge release/v1.2.0
git tag v1.2.0
```

### 複数バージョンのサポート

```bash
# バージョン1.xと2.xを並行サポート
# 1.x系のセキュリティ修正
git checkout v1.x
git cherry-pick <commit>
git tag v1.2.5
git push origin v1.2.5

# 2.x系には別途対応
git checkout main
# ...
```

### リリース前チェックリスト

```markdown
## リリースチェックリスト

### 準備
- [ ] すべてのPRがマージ済み
- [ ] CIが全てグリーン
- [ ] CHANGELOG.mdを更新

### 確認
- [ ] バージョン番号は正しいか
- [ ] 破壊的変更の場合、MAJORを上げたか
- [ ] リリースノートの内容は正確か

### リリース後
- [ ] デプロイが成功したか確認
- [ ] 主要機能の動作確認
- [ ] 関係者への通知
```

### リリース通知の自動化

```yaml
# Slack通知
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        "text": "🚀 New release: ${{ github.ref_name }}\nhttps://github.com/${{ github.repository }}/releases/tag/${{ github.ref_name }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## まとめ

| 項目 | 内容 |
|------|------|
| バージョニング | セマンティックバージョニング（MAJOR.MINOR.PATCH） |
| CHANGELOG | Keep a Changelog形式、ユーザー視点で記載 |
| タグ | 注釈付きタグ、vプレフィックス推奨 |
| リリースノート | GitHub自動生成 + release.yml設定 |

### リリースフローのベストプラクティス

1. **セマンティックバージョニングを遵守**: 破壊的変更は明確に
2. **CHANGELOGを更新**: 自動化しても最終確認は人の目で
3. **タグで履歴を残す**: いつでも過去バージョンに戻れるように
4. **自動化を活用**: 手動ミスを減らし、一貫性を保つ
5. **通知を設定**: 関係者にリリースを周知

次の章では、ブランチ保護ルールについて学びます。
