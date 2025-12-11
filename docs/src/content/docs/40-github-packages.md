---
title: "GitHub Packages"
quiz:
  - question: "GitHub Packagesがサポートするパッケージ形式は？"
    options:
      - "npmのみ"
      - "npm、Docker、Maven、NuGetなど複数"
      - "Dockerのみ"
      - "テキストファイルのみ"
    answer: 1
  - question: "GitHub PackagesのContainer Registryのホスト名は？"
    options:
      - "packages.github.com"
      - "ghcr.io"
      - "docker.github.com"
      - "registry.github.com"
    answer: 1
  - question: "GitHub Packagesのストレージ無料枠はFreeプランでいくらですか？"
    options:
      - "100MB"
      - "500MB"
      - "1GB"
      - "無制限"
    answer: 1
---

この章では、GitHub Packagesを使ったnpm、Docker等のパッケージホスティングについて学びます。

## GitHub Packagesとは

**GitHub Packages**は、GitHubが提供するパッケージレジストリです。npm、Docker、Maven等のパッケージをGitHubで一元管理できます。

### 対応レジストリ

| レジストリ | 対応形式 |
|------------|----------|
| **npm** | Node.jsパッケージ |
| **Container** | Dockerイメージ |
| **Maven** | Javaパッケージ |
| **Gradle** | Java/Kotlinパッケージ |
| **NuGet** | .NETパッケージ |
| **RubyGems** | Rubyパッケージ |

### 料金

```yaml
パブリックリポジトリ:
  ストレージ: 無料
  転送量: 無料

プライベートリポジトリ:
  Free: 500MB / 1GB転送
  Pro: 2GB / 10GB転送
  Team: 2GB / 10GB転送
  Enterprise: 50GB / 100GB転送
```

## npm パッケージ

### パッケージの公開

1. package.json の設定:

```json
{
  "name": "@username/my-package",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-package.git"
  }
}
```

2. 認証設定:

```bash
# .npmrc
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@username:registry=https://npm.pkg.github.com
```

3. 公開:

```bash
npm publish
```

### GitHub Actionsでの自動公開

```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'

      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### パッケージのインストール

```bash
# .npmrc の設定
@username:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN

# インストール
npm install @username/my-package
```

## Docker コンテナ

### GitHub Container Registry（ghcr.io）

```yaml
特徴:
- ghcr.io ドメイン
- パブリックイメージは無料
- 匿名プル可能（パブリック）
- 細かいアクセス制御
```

### イメージのビルドとプッシュ

```bash
# ログイン
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# ビルド
docker build -t ghcr.io/username/my-app:latest .

# プッシュ
docker push ghcr.io/username/my-app:latest
```

### GitHub Actionsでの自動ビルド

```yaml
# .github/workflows/docker.yml
name: Build and Push Docker

on:
  push:
    tags: ['v*']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### マルチプラットフォームビルド

```yaml
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3

- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    context: .
    platforms: linux/amd64,linux/arm64
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### イメージのプル

```bash
# パブリックイメージ（認証不要）
docker pull ghcr.io/username/my-app:latest

# プライベートイメージ
docker login ghcr.io -u USERNAME -p TOKEN
docker pull ghcr.io/username/private-app:latest
```

## パッケージの管理

### 可視性の設定

```yaml
パッケージの設定ページ:
  Visibility:
    ☐ Public（誰でもアクセス可能）
    ☑ Private（権限のあるユーザーのみ）

  Inherit access from source repository:
    ☑ リポジトリの権限を継承
```

### バージョン管理

```yaml
# パッケージページで確認できる情報
- 全バージョン一覧
- ダウンロード数
- 依存リポジトリ
- 公開日時

# 古いバージョンの削除
Settings → Packages → 対象パッケージ → Delete version
```

### アクセス制御

```yaml
# パッケージの権限設定
Manage access:
  - チーム: Read / Write / Admin
  - ユーザー: Read / Write / Admin
  - リポジトリ: 連携

# Organization での設定
Settings → Packages:
  Default visibility: Private
  Inherit from repository: Yes
```

## 認証

### Personal Access Token（PAT）

```bash
# 必要なスコープ
read:packages   # パッケージの読み取り
write:packages  # パッケージの書き込み
delete:packages # パッケージの削除

# 使用例
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# npm
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> ~/.npmrc

# Docker
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

### GITHUB_TOKEN（Actions）

```yaml
# ワークフローでの使用
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      packages: write  # 書き込み権限
    steps:
      - name: Publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Maven / Gradle

### Maven設定

```xml
<!-- pom.xml -->
<distributionManagement>
  <repository>
    <id>github</id>
    <name>GitHub Packages</name>
    <url>https://maven.pkg.github.com/OWNER/REPOSITORY</url>
  </repository>
</distributionManagement>
```

```xml
<!-- ~/.m2/settings.xml -->
<servers>
  <server>
    <id>github</id>
    <username>USERNAME</username>
    <password>TOKEN</password>
  </server>
</servers>
```

### Gradle設定

```kotlin
// build.gradle.kts
publishing {
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/OWNER/REPOSITORY")
            credentials {
                username = System.getenv("GITHUB_ACTOR")
                password = System.getenv("GITHUB_TOKEN")
            }
        }
    }
}
```

---

## 中級者向けTips

### モノレポでの複数パッケージ公開

```yaml
# .github/workflows/publish-packages.yml
name: Publish Packages

on:
  push:
    tags: ['v*']

jobs:
  publish:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: [core, utils, cli]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'

      - name: Publish ${{ matrix.package }}
        run: |
          cd packages/${{ matrix.package }}
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### パッケージの自動クリーンアップ

```yaml
# .github/workflows/cleanup.yml
name: Cleanup old packages

on:
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜日

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Delete old versions
        uses: actions/delete-package-versions@v4
        with:
          package-name: 'my-package'
          package-type: 'npm'
          min-versions-to-keep: 10
          delete-only-pre-release-versions: true
```

### プライベートレジストリとの併用

```yaml
# .npmrc
# GitHub Packages（自社パッケージ）
@mycompany:registry=https://npm.pkg.github.com

# npmjs.org（公開パッケージ）
registry=https://registry.npmjs.org

# 認証
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Dependabotとの連携

```yaml
# .github/dependabot.yml
version: 2
registries:
  github-npm:
    type: npm-registry
    url: https://npm.pkg.github.com
    token: ${{ secrets.PACKAGES_TOKEN }}

updates:
  - package-ecosystem: "npm"
    directory: "/"
    registries:
      - github-npm
    schedule:
      interval: "weekly"
```

---

## まとめ

| レジストリ | URL | 用途 |
|------------|-----|------|
| npm | npm.pkg.github.com | Node.jsパッケージ |
| Container | ghcr.io | Dockerイメージ |
| Maven | maven.pkg.github.com | Javaパッケージ |

### GitHub Packagesのベストプラクティス

1. **GitHub Actionsで自動化**: 手動公開を避ける
2. **セマンティックバージョニング**: 明確なバージョン管理
3. **README整備**: パッケージの使い方を明記
4. **古いバージョン削除**: ストレージ節約
5. **スコープ付き名前**: `@org/package` 形式を使用

### 選択の指針

```yaml
GitHub Packages を使うべき場合:
- プライベートパッケージ
- 組織内での共有
- GitHubワークフローとの統合
- 一元管理したい

公開レジストリを使うべき場合:
- オープンソースパッケージ
- 広く配布したい
- 既存のエコシステム活用
```

次の章では、GitHub Releasesについて学びます。
