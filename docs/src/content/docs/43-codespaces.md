---
title: "GitHub Codespaces"
quiz:
  - question: "GitHub Codespacesとは何ですか？"
    options:
      - "ローカルにインストールするIDE"
      - "クラウド上でホストされる開発環境"
      - "GitHubのファイルストレージサービス"
      - "コードレビュー専用ツール"
    answer: 1
  - question: "devcontainer設定ファイルの正しいパスはどれですか？"
    options:
      - ".devcontainer.json"
      - ".github/devcontainer.json"
      - ".devcontainer/devcontainer.json"
      - "devcontainer/config.json"
    answer: 2
  - question: "GitHub CLIでCodespaceを作成するコマンドはどれですか？"
    options:
      - "gh codespace new"
      - "gh codespace create"
      - "gh cs create"
      - "gh create codespace"
    answer: 1
---

この章では、GitHub Codespacesを使ったクラウド開発環境とdevcontainer設定について学びます。

## Codespacesとは

**GitHub Codespaces**は、クラウド上でホストされる開発環境です。ブラウザやVS Codeから、設定済みの開発環境に即座にアクセスできます。

### 特徴

| 特徴 | 説明 |
|------|------|
| **即座に開始** | 環境構築不要 |
| **どこからでも** | ブラウザまたはVS Code |
| **設定共有** | チームで同じ環境 |
| **スケーラブル** | CPU/メモリを選択可能 |
| **統合** | GitHubと完全統合 |

### 料金

```yaml
無料枠:
  Free: 120コア時間/月
  Pro: 180コア時間/月

有料:
  計算: $0.18/コア時間〜
  ストレージ: $0.07/GB/月

マシンタイプ:
  - 2コア/4GB: $0.18/時間
  - 4コア/8GB: $0.36/時間
  - 8コア/16GB: $0.72/時間
  - 16コア/32GB: $1.44/時間
  - 32コア/64GB: $2.88/時間
```

## Codespacesの起動

### リポジトリから起動

```yaml
方法1: ボタンから
  リポジトリページ → Code → Codespaces → Create codespace

方法2: キーボードショートカット
  リポジトリページで「.」キー → github.devが開く
  リポジトリページで「,」キー → Codespacesが開く

方法3: GitHub CLI
  gh codespace create --repo user/repo
  gh codespace create --repo user/repo --machine largePremiumLinux
```

### PRからの起動

```yaml
PRページ → Code → Open with Codespaces

メリット:
- PRのブランチで直接起動
- コードレビュー時のテストに便利
- 環境の再現性確保
```

## devcontainerの設定

### devcontainerとは

**Dev Container**は、開発環境をコンテナとして定義する仕様です。Codespacesや VS Code Remote Containers で使用されます。

### 基本構成

```
.devcontainer/
├── devcontainer.json   # 設定ファイル
└── Dockerfile          # カスタムイメージ（オプション）
```

### 基本的なdevcontainer.json

```json
{
  "name": "My Project",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
      ],
      "settings": {
        "editor.formatOnSave": true
      }
    }
  },

  "postCreateCommand": "npm install",

  "forwardPorts": [3000],

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {}
  }
}
```

### 言語別の設定例

#### Node.js

```json
{
  "name": "Node.js",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss"
      ]
    }
  },
  "postCreateCommand": "npm install",
  "forwardPorts": [3000, 5173]
}
```

#### Python

```json
{
  "name": "Python",
  "image": "mcr.microsoft.com/devcontainers/python:3.12",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-python.python",
        "ms-python.vscode-pylance",
        "charliermarsh.ruff"
      ],
      "settings": {
        "python.linting.enabled": true
      }
    }
  },
  "postCreateCommand": "pip install -r requirements.txt",
  "forwardPorts": [8000]
}
```

#### Go

```json
{
  "name": "Go",
  "image": "mcr.microsoft.com/devcontainers/go:1.21",
  "customizations": {
    "vscode": {
      "extensions": [
        "golang.go"
      ],
      "settings": {
        "go.useLanguageServer": true
      }
    }
  },
  "postCreateCommand": "go mod download"
}
```

### カスタムDockerfile

```dockerfile
# .devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# 追加のツールをインストール
RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Node.jsのインストール
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs
```

```json
{
  "name": "Custom Dev Environment",
  "build": {
    "dockerfile": "Dockerfile"
  }
}
```

### Docker Compose との連携

```yaml
# .devcontainer/docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ../:/workspace:cached
    command: sleep infinity

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7

volumes:
  postgres-data:
```

```json
{
  "name": "Full Stack",
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "forwardPorts": [3000, 5432, 6379]
}
```

## Featuresの活用

### Dev Container Features

```json
{
  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/aws-cli:1": {},
    "ghcr.io/devcontainers/features/terraform:1": {}
  }
}
```

### 主要なFeatures

| Feature | 説明 |
|---------|------|
| `github-cli` | GitHub CLI |
| `docker-in-docker` | Docker in Docker |
| `aws-cli` | AWS CLI |
| `azure-cli` | Azure CLI |
| `terraform` | Terraform |
| `kubectl-helm-minikube` | Kubernetes tools |

## Codespacesの管理

### 起動中のCodespaces

```bash
# 一覧表示
gh codespace list

# 接続
gh codespace ssh -c <codespace-name>
gh codespace code -c <codespace-name>  # VS Codeで開く

# 停止
gh codespace stop -c <codespace-name>

# 削除
gh codespace delete -c <codespace-name>
```

### シークレットの設定

```yaml
Settings → Codespaces → Secrets:

Codespaces secrets:
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - DATABASE_URL

リポジトリごとにアクセス許可を設定
```

### GPG署名の設定

```yaml
Settings → Codespaces → GPG verification:

☑ Enable GPG verification

結果:
- Codespacesからのコミットに署名
- 「Verified」バッジが付く
```

## Prebuilds

### Prebuildsとは

**Prebuilds**は、devcontainerのビルドを事前に行っておく機能です。起動時間を大幅に短縮できます。

### 設定

```yaml
Settings → Codespaces → Prebuild configuration:

Repository: user/repo
Branch: main
Region: US East, Europe West
Configuration: .devcontainer/devcontainer.json

Triggers:
  ☑ On push to branch
  ☑ On configuration change
```

### Prebuildの効果

```yaml
Prebuildなし: 起動に3-5分
Prebuildあり: 起動に30秒-1分
```

---

## 中級者向けTips

### 起動スクリプトの最適化

```json
{
  "postCreateCommand": ".devcontainer/setup.sh",
  "postStartCommand": "npm run dev &",
  "postAttachCommand": "echo 'Welcome to the project!'"
}
```

```bash
# .devcontainer/setup.sh
#!/bin/bash
set -e

# 依存関係のインストール
npm install

# データベースのセットアップ
npm run db:migrate
npm run db:seed

# 環境変数の確認
if [ -z "$API_KEY" ]; then
  echo "Warning: API_KEY is not set"
fi

echo "Setup complete!"
```

### VS Code設定のカスタマイズ

```json
{
  "customizations": {
    "vscode": {
      "settings": {
        "editor.tabSize": 2,
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "files.autoSave": "afterDelay",
        "terminal.integrated.defaultProfile.linux": "zsh"
      },
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "github.copilot",
        "github.copilot-chat",
        "ms-azuretools.vscode-docker"
      ]
    }
  }
}
```

### リソース使用の最適化

```json
{
  "hostRequirements": {
    "cpus": 4,
    "memory": "8gb",
    "storage": "32gb"
  }
}
```

### チーム用テンプレート

```yaml
# 組織で共通のdevcontainer設定をテンプレートリポジトリとして管理
.devcontainer/
├── base/
│   └── devcontainer.json
├── frontend/
│   └── devcontainer.json
├── backend/
│   └── devcontainer.json
└── fullstack/
    ├── devcontainer.json
    └── docker-compose.yml
```

---

## まとめ

| 項目 | 内容 |
|------|------|
| 起動方法 | ボタン、キーボード、CLI |
| 設定ファイル | devcontainer.json |
| 高速化 | Prebuilds |
| カスタマイズ | Features、Dockerfile |

### Codespacesのベストプラクティス

1. **devcontainer必須**: 環境の再現性確保
2. **Prebuilds活用**: 起動時間の短縮
3. **シークレット管理**: 環境変数で機密情報を管理
4. **適切なマシン選択**: コスト最適化
5. **停止習慣**: 使わない時は停止

### devcontainer推奨設定

```json
{
  "name": "Project Name",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "github.copilot",
        "github.copilot-chat"
      ],
      "settings": {
        "editor.formatOnSave": true
      }
    }
  },

  "postCreateCommand": "echo 'Environment ready!'",
  "forwardPorts": [3000],

  "remoteUser": "vscode"
}
```

次の章では、GitHub CLIについて学びます。
