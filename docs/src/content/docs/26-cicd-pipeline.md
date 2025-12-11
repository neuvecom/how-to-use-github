---
title: "CI/CDパイプライン"
---

この章では、GitHub Actionsを使った自動テスト、ビルド、デプロイの一連のパイプライン構築について学びます。

## CI/CDとは

### CI（継続的インテグレーション）

コードの変更を頻繁にメインブランチに統合し、自動テストで品質を担保する手法です。

```
開発者がプッシュ
    ↓
自動テスト実行
    ↓
テスト成功 → マージ可能
テスト失敗 → 修正必要
```

### CD（継続的デリバリー/デプロイ）

- **継続的デリバリー**: 本番環境へのデプロイ準備を自動化（デプロイは手動承認）
- **継続的デプロイ**: 本番環境へのデプロイまで完全自動化

## 基本的なCIパイプライン

### Node.jsプロジェクトの例

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
```

### Pythonプロジェクトの例

```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.10', '3.11', '3.12']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'
      - run: pip install -r requirements.txt
      - run: pip install pytest pytest-cov
      - run: pytest --cov=src tests/
      - uses: codecov/codecov-action@v4
        if: matrix.python-version == '3.12'
```

## CDパイプライン

### ステージング → 本番の流れ

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.value }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - id: version
        run: echo "value=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT
      - uses: actions/upload-artifact@v4
        with:
          name: build-${{ steps.version.outputs.value }}
          path: dist/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-${{ needs.build.outputs.version }}
          path: dist/
      - name: Deploy to Staging
        run: |
          # ステージングへのデプロイコマンド
          echo "Deploying to staging..."
        env:
          DEPLOY_TOKEN: ${{ secrets.STAGING_DEPLOY_TOKEN }}

  deploy-production:
    needs: [build, deploy-staging]
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-${{ needs.build.outputs.version }}
          path: dist/
      - name: Deploy to Production
        run: |
          # 本番へのデプロイコマンド
          echo "Deploying to production..."
        env:
          DEPLOY_TOKEN: ${{ secrets.PROD_DEPLOY_TOKEN }}
```

## Environments（環境）

### 環境の設定

Settings → Environments で環境を作成：

| 環境 | 用途 | 保護ルール |
|------|------|------------|
| development | 開発環境 | なし |
| staging | ステージング | なし |
| production | 本番環境 | 承認必須 |

### 環境の保護ルール

```yaml
# production 環境の設定例
Required reviewers:
  - @release-manager
  - @tech-lead

Wait timer: 5 minutes  # デプロイ前の待機時間

Deployment branches:
  - main  # mainブランチからのみデプロイ可能
```

### 環境シークレット

各環境に固有のシークレットを設定：

```yaml
# 環境によって異なる値を使用
steps:
  - name: Deploy
    run: ./deploy.sh
    env:
      API_URL: ${{ vars.API_URL }}  # 環境変数
      API_KEY: ${{ secrets.API_KEY }}  # 環境シークレット
```

## 承認フロー

### 手動承認の設定

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Deploy
        run: ./deploy.sh
```

Environment に `Required reviewers` を設定すると、デプロイ前に承認が必要になります。

### 承認のワークフロー

```
1. ワークフローがproduction環境に到達
2. 指定された承認者に通知
3. 承認者がGitHub上で承認
4. デプロイが実行される
```

## デプロイ先別の設定

### Vercelへのデプロイ

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### AWS S3 + CloudFrontへのデプロイ

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci && npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1

      - name: Deploy to S3
        run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

### Dockerイメージのビルドとプッシュ

```yaml
name: Build and Push Docker

on:
  push:
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:${{ github.ref_name }}
            ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Kubernetesへのデプロイ

```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubeconfig
        run: |
          mkdir -p ~/.kube
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > ~/.kube/config

      - name: Deploy to cluster
        run: |
          kubectl apply -f k8s/
          kubectl rollout status deployment/myapp
```

## ロールバック戦略

### 手動ロールバック

```yaml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to'
        required: true
        type: string

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Download previous artifact
        uses: actions/download-artifact@v4
        with:
          name: build-${{ inputs.version }}
          path: dist/

      - name: Deploy previous version
        run: ./deploy.sh
```

### 自動ロールバック

```yaml
- name: Deploy and verify
  run: |
    ./deploy.sh

    # ヘルスチェック
    for i in {1..10}; do
      if curl -s https://example.com/health | grep -q "ok"; then
        echo "Deploy successful"
        exit 0
      fi
      sleep 10
    done

    echo "Health check failed, rolling back"
    ./rollback.sh
    exit 1
```

## 完全なCI/CDパイプライン例

```yaml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # ============ CI Phase ============
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4

  build:
    needs: [lint, typecheck, test]
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.value }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - id: version
        run: echo "value=${{ github.sha }}" >> $GITHUB_OUTPUT
      - uses: actions/upload-artifact@v4
        with:
          name: build-${{ github.sha }}
          path: dist/
          retention-days: 7

  # ============ CD Phase ============
  deploy-staging:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-${{ needs.build.outputs.version }}
          path: dist/
      - name: Deploy to Staging
        run: echo "Deploying to staging..."
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

  e2e-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      - run: npm ci
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: https://staging.example.com

  deploy-production:
    needs: [build, e2e-test]
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-${{ needs.build.outputs.version }}
          path: dist/
      - name: Deploy to Production
        run: echo "Deploying to production..."
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

  notify:
    needs: deploy-production
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deployment ${{ needs.deploy-production.result }}: ${{ github.repository }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 中級者向けTips

### ブランチ別のデプロイ先

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Set environment
        id: env
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "environment=production" >> $GITHUB_OUTPUT
            echo "url=https://example.com" >> $GITHUB_OUTPUT
          elif [ "${{ github.ref }}" == "refs/heads/develop" ]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
            echo "url=https://staging.example.com" >> $GITHUB_OUTPUT
          else
            echo "environment=preview" >> $GITHUB_OUTPUT
            echo "url=https://pr-${{ github.event.number }}.example.com" >> $GITHUB_OUTPUT
          fi
```

### PRプレビュー環境

```yaml
name: Deploy Preview

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build

      - name: Deploy to preview
        id: preview
        run: |
          # PRごとにプレビュー環境を作成
          PREVIEW_URL="https://pr-${{ github.event.number }}.preview.example.com"
          echo "url=$PREVIEW_URL" >> $GITHUB_OUTPUT

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployed to: ${{ steps.preview.outputs.url }}'
            })
```

### Blue-Greenデプロイ

```yaml
- name: Blue-Green Deploy
  run: |
    # 現在のアクティブ環境を確認
    CURRENT=$(curl -s https://example.com/env)

    if [ "$CURRENT" == "blue" ]; then
      NEW_ENV="green"
    else
      NEW_ENV="blue"
    fi

    # 新環境にデプロイ
    ./deploy.sh --env $NEW_ENV

    # ヘルスチェック後に切り替え
    ./switch-traffic.sh $NEW_ENV
```

---

## まとめ

| フェーズ | 内容 | 自動化 |
|----------|------|--------|
| CI | テスト・Lint・ビルド | 完全自動 |
| CD（ステージング） | ステージングデプロイ | 完全自動 |
| CD（本番） | 本番デプロイ | 承認後自動 |

### CI/CDのベストプラクティス

1. **高速なフィードバック**: CIは10分以内を目標
2. **並列実行**: 独立したジョブは並列化
3. **キャッシュ活用**: 依存関係のキャッシュで高速化
4. **環境分離**: staging → production の流れ
5. **承認フロー**: 本番デプロイは人間の承認を
6. **ロールバック準備**: いつでも戻せる状態を維持
7. **通知設定**: 成功/失敗をチームに通知

次の章では、Dependabotについて学びます。
