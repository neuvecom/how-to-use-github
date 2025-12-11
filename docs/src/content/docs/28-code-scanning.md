---
title: "Code Scanning & Secret Scanning"
---

この章では、コードの脆弱性を検出するCode Scanningと、シークレットの漏洩を防ぐSecret Scanningについて学びます。

## Code Scanning

### Code Scanningとは

**Code Scanning**は、コード内のセキュリティ脆弱性を自動検出する機能です。主にCodeQLを使用して静的解析を行います。

### 対応言語

CodeQLが対応する言語：

| 言語 | サポート状況 |
|------|--------------|
| JavaScript/TypeScript | ✅ フルサポート |
| Python | ✅ フルサポート |
| Java/Kotlin | ✅ フルサポート |
| C/C++ | ✅ フルサポート |
| C# | ✅ フルサポート |
| Go | ✅ フルサポート |
| Ruby | ✅ フルサポート |
| Swift | ✅ サポート |

### 有効化（デフォルト設定）

Settings → Security → Code security and analysis:

```
Code scanning → Set up → Default
```

自動で `.github/workflows/codeql.yml` が作成されます。

### 手動設定

```yaml
# .github/workflows/codeql.yml
name: "CodeQL"

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'  # 毎週月曜日

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: ['javascript', 'python']

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
          queries: +security-extended

      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: "/language:${{ matrix.language }}"
```

### クエリスイート

| スイート | 説明 |
|----------|------|
| `default` | 標準的なセキュリティクエリ |
| `security-extended` | より多くのセキュリティクエリ |
| `security-and-quality` | セキュリティ + コード品質 |

### 結果の確認

Security → Code scanning alerts で確認：

```
┌─────────────────────────────────────────┐
│ High (3)                                │
├─────────────────────────────────────────┤
│ ⚠️ SQL Injection                        │
│   src/db/query.js:45                    │
│   CWE-89                                │
├─────────────────────────────────────────┤
│ ⚠️ Cross-site Scripting (XSS)          │
│   src/components/Comment.jsx:23         │
│   CWE-79                                │
├─────────────────────────────────────────┤
│ ⚠️ Insecure Randomness                  │
│   src/utils/token.js:12                 │
│   CWE-330                               │
└─────────────────────────────────────────┘
```

### アラートへの対応

1. **Dismiss**: 誤検知の場合
   - Won't fix: 対応しない
   - False positive: 誤検知
   - Used in tests: テストコード
2. **修正**: コードを修正してPR
3. **コメント**: 調査結果を記録

## Secret Scanning

### Secret Scanningとは

**Secret Scanning**は、リポジトリ内のシークレット（APIキー、トークン等）を検出する機能です。

### 検出対象

100種類以上のシークレットパターンを検出：

- AWS Access Key
- GitHub Personal Access Token
- Google API Key
- Stripe API Key
- Slack Webhook URL
- その他多数

### 有効化

Settings → Security → Code security and analysis:

```
✅ Secret scanning
✅ Push protection（プッシュ保護）
```

### アラートの確認

Security → Secret scanning alerts:

```
┌─────────────────────────────────────────┐
│ Active (2)                              │
├─────────────────────────────────────────┤
│ 🔑 AWS Access Key                       │
│   config/aws.js:5                       │
│   Detected: 2024-01-15                  │
│   Partner: Amazon Web Services          │
├─────────────────────────────────────────┤
│ 🔑 GitHub Personal Access Token         │
│   scripts/deploy.sh:12                  │
│   Detected: 2024-01-14                  │
└─────────────────────────────────────────┘
```

### アラートへの対応

1. **シークレットを無効化**: 漏洩したキーをすぐに無効化
2. **新しいシークレットを発行**: 新しいキーを生成
3. **履歴から削除**: git filter-branch等で履歴から削除
4. **環境変数に移行**: ハードコードをやめる

## Push Protection

### Push Protectionとは

シークレットを含むコミットの**プッシュを事前にブロック**する機能です。

### 有効化

Settings → Security → Code security and analysis:

```
✅ Push protection
```

### 動作

```bash
$ git push origin main

remote: error: GH013: Repository rule violations found.
remote:
remote: Secret scanning detected the following secrets:
remote:   - AWS Access Key ID in config/aws.js:5
remote:
remote: To push, you must remove the secret from your commits.
```

### バイパス方法

正当な理由がある場合、バイパス可能：

1. WebUIでバイパス理由を選択
2. 理由を記録してプッシュ

バイパス理由：
- **False positive**: 誤検知
- **Used in tests**: テスト用
- **Will fix later**: 後で修正

:::caution
バイパスは監査ログに記録されます。正当な理由がある場合のみ使用してください。


## カスタムパターン

### 組織固有のシークレットパターン

Organization設定でカスタムパターンを追加：

```
Settings → Code security and analysis →
Secret scanning → Custom patterns → New pattern
```

### パターン例

```
Name: Internal API Key
Pattern: INTERNAL_[A-Z0-9]{32}
Description: 社内システムのAPIキー
```

## サードパーティツールとの連携

### SonarCloud

```yaml
name: SonarCloud

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Snyk

```yaml
name: Snyk Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### Trivy（コンテナスキャン）

```yaml
name: Trivy Scan

on:
  push:
    branches: [main]

jobs:
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build image
        run: docker build -t myapp:latest .

      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

---

## 中級者向けTips

### カスタムCodeQLクエリ

```ql
// .github/codeql/custom-queries/sql-injection.ql
/**
 * @name Custom SQL Injection Check
 * @description Finds potential SQL injection vulnerabilities
 * @kind path-problem
 * @problem.severity error
 * @security-severity 9.0
 * @precision high
 * @id custom/sql-injection
 * @tags security
 */

import javascript
import DataFlow::PathGraph

class SqlInjectionConfig extends TaintTracking::Configuration {
  SqlInjectionConfig() { this = "SqlInjectionConfig" }

  override predicate isSource(DataFlow::Node source) {
    exists(Express::RequestInputAccess input |
      source = input
    )
  }

  override predicate isSink(DataFlow::Node sink) {
    exists(DataFlow::CallNode call |
      call.getCalleeName() = "query" and
      sink = call.getArgument(0)
    )
  }
}

from SqlInjectionConfig config, DataFlow::PathNode source, DataFlow::PathNode sink
where config.hasFlowPath(source, sink)
select sink.getNode(), source, sink, "Potential SQL injection from $@.", source.getNode(), "user input"
```

### セキュリティポリシーファイル

```markdown
<!-- SECURITY.md -->
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

1. **DO NOT** open a public issue
2. Email security@example.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
4. Response within 48 hours
5. Fix timeline: 90 days
```

### 統合ダッシュボード

Security → Overview で統合表示：

```
┌─────────────────────────────────────────┐
│ Security Overview                       │
├─────────────────────────────────────────┤
│ Dependabot alerts:     5 (2 critical)   │
│ Code scanning:         3 (1 high)       │
│ Secret scanning:       2 active         │
│ Security advisories:   1 draft          │
└─────────────────────────────────────────┘
```

### PRでのセキュリティチェック

```yaml
name: Security Gate

on:
  pull_request:
    branches: [main]

jobs:
  security-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check for high severity alerts
        run: |
          ALERTS=$(gh api repos/${{ github.repository }}/code-scanning/alerts \
            --jq '[.[] | select(.state == "open" and .rule.severity == "error")] | length')

          if [ "$ALERTS" -gt 0 ]; then
            echo "❌ $ALERTS high severity alerts found"
            exit 1
          fi
          echo "✅ No high severity alerts"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## まとめ

| 機能 | 対象 | タイミング |
|------|------|------------|
| Code Scanning | コードの脆弱性 | Push/PR/定期 |
| Secret Scanning | シークレット漏洩 | 常時監視 |
| Push Protection | シークレット混入防止 | Push時 |

### セキュリティスキャンのベストプラクティス

1. **全機能を有効化**: Code Scanning + Secret Scanning + Push Protection
2. **PRでブロック**: セキュリティ問題があるPRはマージ禁止
3. **定期スキャン**: 週次のスケジュールスキャン
4. **アラート対応SLA**: Critical 24時間、High 1週間
5. **セキュリティレビュー**: 高リスク変更は追加レビュー
6. **SECURITY.md**: 脆弱性報告プロセスを明記

### 推奨設定

```yaml
# .github/workflows/security.yml
name: Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'

jobs:
  codeql:
    uses: ./.github/workflows/codeql.yml

  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high
```

次の章では、アクセス管理について学びます。
