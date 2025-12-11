---
title: "GitHub API"
quiz:
  - question: "GitHub APIの2つの種類として正しい組み合わせはどれですか？"
    options:
      - "SOAP APIとREST API"
      - "REST APIとGraphQL API"
      - "XML APIとJSON API"
      - "CRUD APIとQuery API"
    answer: 1
  - question: "GitHub REST APIの認証ヘッダーとして正しいものはどれですか？"
    options:
      - "X-GitHub-Token: <token>"
      - "API-Key: <token>"
      - "Authorization: Bearer <token>"
      - "Auth: <token>"
    answer: 2
  - question: "Webhookとは何ですか？"
    options:
      - "手動でAPIを呼び出す機能"
      - "イベント発生時に指定URLにHTTPリクエストを送信する機能"
      - "GitHubのバックアップ機能"
      - "コードを自動修正する機能"
    answer: 1
---

この章では、GitHub REST APIとGraphQL API、Webhooksについて学びます。

## GitHub APIの概要

GitHubは2種類のAPIを提供しています：

| API | 特徴 | 用途 |
|-----|------|------|
| **REST API** | シンプル、広く普及 | 基本的な操作 |
| **GraphQL API** | 柔軟、効率的 | 複雑なクエリ |

### 認証

```yaml
認証方法:
- Personal Access Token (PAT)
- GitHub App
- OAuth App

ヘッダー:
  Authorization: Bearer <token>
  # または
  Authorization: token <token>
```

## REST API

### 基本的な使い方

```bash
# curlでの呼び出し
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/user

# gh api での呼び出し（推奨）
gh api /user
```

### 主要なエンドポイント

#### ユーザー情報

```bash
# 認証ユーザー
GET /user

# 特定ユーザー
GET /users/{username}

# ユーザーのリポジトリ
GET /users/{username}/repos
```

#### リポジトリ

```bash
# リポジトリ情報
GET /repos/{owner}/{repo}

# リポジトリ作成
POST /user/repos
{
  "name": "new-repo",
  "private": true
}

# ブランチ一覧
GET /repos/{owner}/{repo}/branches

# コミット一覧
GET /repos/{owner}/{repo}/commits

# ファイル内容
GET /repos/{owner}/{repo}/contents/{path}
```

#### Issue

```bash
# Issue一覧
GET /repos/{owner}/{repo}/issues

# Issue作成
POST /repos/{owner}/{repo}/issues
{
  "title": "Bug report",
  "body": "Description",
  "labels": ["bug"]
}

# Issue更新
PATCH /repos/{owner}/{repo}/issues/{issue_number}
{
  "state": "closed"
}

# コメント追加
POST /repos/{owner}/{repo}/issues/{issue_number}/comments
{
  "body": "Comment text"
}
```

#### Pull Request

```bash
# PR一覧
GET /repos/{owner}/{repo}/pulls

# PR作成
POST /repos/{owner}/{repo}/pulls
{
  "title": "Feature",
  "head": "feature-branch",
  "base": "main",
  "body": "Description"
}

# PRマージ
PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge
{
  "merge_method": "squash"
}

# レビュー追加
POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews
{
  "event": "APPROVE",
  "body": "LGTM!"
}
```

### ページネーション

```bash
# ページパラメータ
GET /repos/{owner}/{repo}/issues?page=2&per_page=50

# Linkヘッダーで次のページを確認
Link: <https://api.github.com/...?page=3>; rel="next",
      <https://api.github.com/...?page=10>; rel="last"

# gh api での自動ページネーション
gh api /repos/{owner}/{repo}/issues --paginate
```

### レート制限

```bash
# レート制限の確認
GET /rate_limit

# レスポンス例
{
  "resources": {
    "core": {
      "limit": 5000,
      "remaining": 4999,
      "reset": 1234567890
    }
  }
}
```

## GraphQL API

### 基本構造

```graphql
query {
  viewer {
    login
    name
    email
  }
}
```

### クエリの実行

```bash
# curlで実行
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  -X POST \
  -d '{"query": "query { viewer { login }}"}' \
  https://api.github.com/graphql

# gh apiで実行
gh api graphql -f query='query { viewer { login }}'
```

### 便利なクエリ例

#### リポジトリ情報の取得

```graphql
query($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    name
    description
    stargazerCount
    forkCount
    primaryLanguage {
      name
    }
    issues(states: OPEN) {
      totalCount
    }
    pullRequests(states: OPEN) {
      totalCount
    }
  }
}
```

#### ユーザーのコントリビューション

```graphql
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
    }
    repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}) {
      nodes {
        name
        stargazerCount
      }
    }
  }
}
```

#### PRとレビュー

```graphql
query($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    pullRequests(first: 10, states: OPEN) {
      nodes {
        number
        title
        author {
          login
        }
        reviews(first: 10) {
          nodes {
            state
            author {
              login
            }
          }
        }
      }
    }
  }
}
```

### ミューテーション

```graphql
mutation($input: AddCommentInput!) {
  addComment(input: $input) {
    commentEdge {
      node {
        body
      }
    }
  }
}
```

```bash
# 実行
gh api graphql -f query='
  mutation($subjectId: ID!, $body: String!) {
    addComment(input: {subjectId: $subjectId, body: $body}) {
      commentEdge {
        node {
          id
        }
      }
    }
  }
' -f subjectId="MDU6SXNzdWUx" -f body="Comment via API"
```

## Webhooks

### Webhooksとは

**Webhook**は、GitHubで特定のイベントが発生した時に、指定したURLにHTTPリクエストを送信する機能です。

### 設定方法

Settings → Webhooks → Add webhook:

```yaml
Payload URL: https://example.com/webhook
Content type: application/json
Secret: [ランダムな秘密鍵]

Events:
  ☐ Just the push event
  ☐ Send me everything
  ☑ Let me select individual events
    ☑ Pull requests
    ☑ Issues
    ☑ Push
```

### 主要なイベント

| イベント | タイミング |
|----------|------------|
| `push` | プッシュ時 |
| `pull_request` | PR操作時 |
| `issues` | Issue操作時 |
| `issue_comment` | コメント時 |
| `release` | リリース時 |
| `workflow_run` | ワークフロー完了時 |

### ペイロード例（push）

```json
{
  "ref": "refs/heads/main",
  "before": "abc123...",
  "after": "def456...",
  "repository": {
    "name": "my-repo",
    "full_name": "owner/my-repo"
  },
  "pusher": {
    "name": "username",
    "email": "user@example.com"
  },
  "commits": [
    {
      "id": "def456...",
      "message": "Update README",
      "author": {
        "name": "User",
        "email": "user@example.com"
      }
    }
  ]
}
```

### Webhook受信サーバー

```javascript
// Node.js (Express)
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);

  if (!verifySignature(payload, signature)) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.headers['x-github-event'];

  switch (event) {
    case 'push':
      console.log('Push event:', req.body.commits);
      break;
    case 'pull_request':
      console.log('PR event:', req.body.action);
      break;
  }

  res.status(200).send('OK');
});

app.listen(3000);
```

### Webhook のデバッグ

```yaml
Settings → Webhooks → Recent Deliveries:

確認できる情報:
- リクエスト/レスポンス
- ペイロード
- ステータスコード
- 再送信ボタン
```

---

## 中級者向けTips

### SDKの活用

```javascript
// Octokit (JavaScript)
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function createIssue() {
  const response = await octokit.issues.create({
    owner: 'owner',
    repo: 'repo',
    title: 'Issue title',
    body: 'Issue body'
  });
  console.log(response.data);
}
```

```python
# PyGithub (Python)
from github import Github

g = Github(os.environ['GITHUB_TOKEN'])

repo = g.get_repo("owner/repo")
issue = repo.create_issue(
    title="Issue title",
    body="Issue body"
)
print(issue.number)
```

### GitHub Actions での API 使用

```yaml
jobs:
  api-call:
    runs-on: ubuntu-latest
    steps:
      - name: Call API
        run: |
          gh api /repos/${{ github.repository }}/issues \
            --method POST \
            -f title="Auto-created issue" \
            -f body="Created by Actions"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: GraphQL query
        run: |
          gh api graphql -f query='
            query {
              repository(owner: "${{ github.repository_owner }}", name: "${{ github.event.repository.name }}") {
                stargazerCount
              }
            }
          '
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 条件付きリクエスト

```bash
# ETagを使ったキャッシュ
curl -H "If-None-Match: \"abc123\"" \
  https://api.github.com/repos/owner/repo

# 304 Not Modified が返れば変更なし
```

### GraphQL Explorer

[GitHub GraphQL Explorer](https://docs.github.com/en/graphql/overview/explorer)でインタラクティブにクエリをテスト可能。

---

## まとめ

| API | 特徴 | 推奨用途 |
|-----|------|----------|
| REST | シンプル | 単純な操作 |
| GraphQL | 柔軟 | 複雑なデータ取得 |
| Webhooks | プッシュ型 | イベント駆動処理 |

### APIのベストプラクティス

1. **レート制限対応**: 残り回数を監視
2. **ページネーション**: 大量データは分割取得
3. **条件付きリクエスト**: ETagでキャッシュ活用
4. **SDKの使用**: 言語別SDKで効率化
5. **Webhook検証**: 署名を必ず検証

### 選択の指針

```yaml
REST APIを使う場合:
- シンプルな操作
- 単一リソースの取得/更新
- 既存のツールとの連携

GraphQL APIを使う場合:
- 複数の関連データを一度に取得
- 必要なフィールドのみ取得
- ネストしたデータ構造

Webhooksを使う場合:
- イベント駆動の処理
- リアルタイム通知
- 外部サービスとの連携
```

次の章では、よくあるトラブルと解決法について学びます。
