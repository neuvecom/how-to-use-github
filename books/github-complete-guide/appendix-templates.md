---
title: "サンプルテンプレート集"
---

# サンプルテンプレート集

すぐに使えるGitHub関連のテンプレートをまとめます。

## Issue テンプレート

### バグ報告

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: バグ報告
description: バグを報告する
title: "[Bug]: "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        バグ報告ありがとうございます。以下の項目をご記入ください。

  - type: textarea
    id: description
    attributes:
      label: バグの説明
      description: 発生している問題を説明してください
      placeholder: 何が起きていますか？
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

  - type: textarea
    id: expected
    attributes:
      label: 期待する動作
      description: 本来どう動作すべきですか？

  - type: dropdown
    id: os
    attributes:
      label: OS
      options:
        - Windows
        - macOS
        - Linux
        - iOS
        - Android
    validations:
      required: true

  - type: input
    id: version
    attributes:
      label: バージョン
      description: 使用しているバージョン
      placeholder: "1.0.0"

  - type: textarea
    id: logs
    attributes:
      label: ログ・スクリーンショット
      description: 関連するログやスクリーンショットがあれば添付してください
```

### 機能要望

```yaml
# .github/ISSUE_TEMPLATE/feature_request.yml
name: 機能要望
description: 新機能の提案
title: "[Feature]: "
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: 解決したい問題
      description: どんな問題を解決したいですか？
      placeholder: "〜ができないので困っている"
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: 提案する解決策
      description: どんな機能があればいいですか？
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: 代替案
      description: 検討した他の解決策があれば

  - type: textarea
    id: context
    attributes:
      label: 追加情報
      description: その他の関連情報
```

## PR テンプレート

### 標準テンプレート

```markdown
<!-- .github/pull_request_template.md -->
## 概要
<!-- このPRで行う変更の概要 -->

## 変更内容
<!-- 主な変更点をリスト形式で -->
-
-

## 関連Issue
<!-- 関連するIssueがあれば -->
Closes #

## テスト方法
<!-- 動作確認の手順 -->
1.
2.

## チェックリスト
- [ ] テストを追加した
- [ ] ドキュメントを更新した
- [ ] セルフレビューを行った

## スクリーンショット
<!-- UIの変更がある場合 -->
```

## GitHub Actions ワークフロー

### Node.js CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

### Python CI

```yaml
# .github/workflows/python-ci.yml
name: Python CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.10', '3.11', '3.12']

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Lint with ruff
        run: |
          pip install ruff
          ruff check .

      - name: Test with pytest
        run: pytest --cov=src tests/
```

### Docker Build & Push

```yaml
# .github/workflows/docker.yml
name: Docker

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

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

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

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Release

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags: ['v*']

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

## 設定ファイル

### Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Tokyo"
    labels:
      - "dependencies"
    groups:
      minor-and-patch:
        update-types:
          - "minor"
          - "patch"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### CODEOWNERS

```
# .github/CODEOWNERS

# デフォルト
*                       @team-leads

# フロントエンド
/src/frontend/          @frontend-team
*.tsx                   @frontend-team

# バックエンド
/src/backend/           @backend-team
/src/api/               @backend-team

# インフラ
/.github/               @devops-team
/infrastructure/        @devops-team
Dockerfile              @devops-team

# ドキュメント
/docs/                  @docs-team
*.md                    @docs-team
```

### リリースノート設定

```yaml
# .github/release.yml
changelog:
  exclude:
    labels:
      - skip-changelog
      - dependencies
  categories:
    - title: 🚀 新機能
      labels:
        - enhancement
        - feature
    - title: 🐛 バグ修正
      labels:
        - bug
        - fix
    - title: 📚 ドキュメント
      labels:
        - documentation
    - title: 🔧 メンテナンス
      labels:
        - chore
        - maintenance
```

### ラベラー設定

```yaml
# .github/labeler.yml
frontend:
  - changed-files:
      - any-glob-to-any-file: 'src/frontend/**'

backend:
  - changed-files:
      - any-glob-to-any-file: 'src/backend/**'

documentation:
  - changed-files:
      - any-glob-to-any-file: '**/*.md'

tests:
  - changed-files:
      - any-glob-to-any-file: '**/*.test.{js,ts}'

infrastructure:
  - changed-files:
      - any-glob-to-any-file:
          - '.github/**'
          - 'Dockerfile'
          - 'docker-compose*.yml'
```

## devcontainer

### 基本設定

```json
// .devcontainer/devcontainer.json
{
  "name": "Development Container",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "github.copilot",
        "github.copilot-chat"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
  },

  "postCreateCommand": "npm install",
  "forwardPorts": [3000],
  "remoteUser": "node"
}
```

## .gitignore

### Node.js

```gitignore
# .gitignore (Node.js)
node_modules/
dist/
build/
.next/

# ログ
*.log
npm-debug.log*

# 環境変数
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# テスト
coverage/
```

### Python

```gitignore
# .gitignore (Python)
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
dist/
*.egg-info/

# 仮想環境
venv/
.venv/
ENV/

# 環境変数
.env

# IDE
.vscode/
.idea/
*.swp

# テスト
.coverage
htmlcov/
.pytest_cache/
```

---

これらのテンプレートは必要に応じてカスタマイズしてお使いください。
プロジェクトの要件に合わせて調整することをお勧めします。
