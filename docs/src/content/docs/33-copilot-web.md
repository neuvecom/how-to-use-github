---
title: "Copilot in GitHub（Web）"
---

この章では、GitHub.com上で使えるCopilot機能（PR要約、レビュー支援、Issue要約、コミットメッセージ提案）について学びます。

## 概要

GitHub.com上のCopilot機能は、Webブラウザからエディタなしで利用できるAI支援機能です。

### 利用可能な機能

| 機能 | 説明 |
|------|------|
| **Copilot Chat** | リポジトリについて質問 |
| **PR要約** | プルリクエストの内容を要約 |
| **PR説明生成** | PR作成時の説明文を自動生成 |
| **コミットメッセージ提案** | 変更内容からメッセージを提案 |
| **Issue要約** | Issueのディスカッションを要約 |
| **コードレビュー支援** | レビューコメントの提案 |

## PR要約

### 使い方

1. プルリクエストを開く
2. 「Copilot」ボタンをクリック
3. 「Summarize this pull request」を選択

### 要約の例

```markdown
## Summary

This PR introduces user authentication functionality:

### Changes
- Added JWT-based authentication middleware
- Implemented login and logout endpoints
- Created user session management
- Added password hashing with bcrypt

### Files changed
- `src/auth/middleware.ts` - New authentication middleware
- `src/routes/auth.ts` - Login/logout endpoints
- `src/services/session.ts` - Session management
- `package.json` - Added jsonwebtoken and bcrypt dependencies

### Testing
- Unit tests added for authentication functions
- Integration tests for auth endpoints
```

### 日本語での要約

```
質問: このPRを日本語で要約してください

要約:
## 概要
このPRはユーザー認証機能を追加します。

### 主な変更
- JWT認証ミドルウェアの実装
- ログイン/ログアウトエンドポイントの追加
- セッション管理機能の実装
- bcryptによるパスワードハッシュ化

### テスト
- 認証関数のユニットテスト追加済み
- エンドポイントの統合テスト追加済み
```

## PR説明の自動生成

### PR作成時の使用

1. 「New pull request」をクリック
2. 変更内容を確認
3. 説明欄の「Copilot」ボタンをクリック
4. 自動生成された説明を編集

### 生成例

```markdown
## What this PR does

Implements a new caching layer for the API responses to improve performance.

## Changes

- Added Redis-based caching service (`src/services/cache.ts`)
- Integrated caching middleware for GET endpoints
- Added cache invalidation on data mutations
- Updated configuration for Redis connection

## How to test

1. Start Redis server locally
2. Run `npm run dev`
3. Make API requests and observe caching behavior
4. Verify cache invalidation on POST/PUT/DELETE

## Related issues

Closes #123
```

## コミットメッセージ提案

### Web上でのコミット時

1. ファイルを編集
2. 「Commit changes」をクリック
3. 「Generate message」ボタンをクリック

### 提案例

```
変更内容: src/utils/validation.ts にメールバリデーション関数を追加

提案されるメッセージ:
feat(validation): add email validation utility function

Add validateEmail function that checks:
- Valid email format using regex
- Domain existence check
- Maximum length validation
```

### Conventional Commits形式

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: フォーマット変更
refactor: リファクタリング
test: テスト追加
chore: その他の変更
```

## Issue要約

### 長いディスカッションの要約

1. Issueページを開く
2. 「Copilot」ボタンをクリック
3. 「Summarize this discussion」を選択

### 要約例

```markdown
## Issue Summary

**Problem**: Users report slow page load times on the dashboard (>5s)

**Root cause identified**:
- Multiple unnecessary API calls on initial load
- Large bundle size due to unoptimized imports

**Proposed solutions**:
1. Implement lazy loading for dashboard components
2. Add API response caching
3. Use code splitting for large dependencies

**Current status**:
- PR #456 addresses API caching
- Bundle optimization scheduled for next sprint

**Key participants**: @alice, @bob, @charlie
```

## Copilot Chat（Web）

### リポジトリについて質問

```
質問: このリポジトリの認証はどのように実装されていますか？

回答:
このリポジトリの認証は以下のように実装されています:

1. **認証方式**: JWT (JSON Web Token)
   - `src/auth/jwt.ts` でトークン生成・検証

2. **ログインフロー**:
   - `src/routes/auth.ts` の `/login` エンドポイント
   - bcryptでパスワード検証
   - 成功時にJWTトークンを発行

3. **保護されたルート**:
   - `src/middleware/auth.ts` でトークン検証
   - 無効なトークンは401エラー

4. **セッション管理**:
   - Redisでリフレッシュトークンを管理
   - 24時間で期限切れ
```

### コードの説明を求める

```
質問: src/utils/debounce.ts の実装を説明してください

回答:
`debounce.ts` は関数の実行を遅延させるユーティリティです。

実装:
- 指定したミリ秒間、関数呼び出しを待機
- 待機中に再度呼び出されるとタイマーをリセット
- 最後の呼び出しから指定時間経過後に実行

使用箇所:
- 検索入力のオートコンプリート
- ウィンドウリサイズイベント
- スクロールイベントのハンドリング
```

## コードレビュー支援

### レビューコメントの提案

PRのFilesタブで、変更されたコードに対してCopilotがコメントを提案：

```javascript
// 変更されたコード
function processData(data) {
  return data.map(item => item.value * 2);
}

// Copilotの提案コメント:
💡 Consider adding null check:
`if (!data) return [];`

Also, the function could benefit from TypeScript types
for better type safety.
```

### セキュリティレビュー

```javascript
// 変更されたコード
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Copilotのセキュリティ警告:
⚠️ Security Issue: SQL Injection vulnerability

This code is vulnerable to SQL injection.
Use parameterized queries instead:

const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

## 実践的な活用シナリオ

### シナリオ1: 大規模PRのレビュー

```
状況: 50ファイル以上変更されたPR

手順:
1. Copilotで全体を要約
2. 重要な変更点を把握
3. 各ファイルの変更意図を確認
4. セキュリティ関連の変更に注目

質問例:
- 「このPRでセキュリティに影響する変更はありますか？」
- 「破壊的変更はありますか？」
- 「テストカバレッジは十分ですか？」
```

### シナリオ2: 初めてのリポジトリ理解

```
質問例:
- 「このプロジェクトのアーキテクチャを説明してください」
- 「主要なエントリーポイントはどこですか？」
- 「データベースのスキーマ構造を教えてください」
- 「開発環境のセットアップ方法は？」
```

### シナリオ3: バグ調査

```
質問例:
- 「#234のIssueに関連するコードはどこですか？」
- 「認証エラーが発生する可能性があるコードを探してください」
- 「このエラーメッセージが出力される箇所を教えてください」
```

---

## 中級者向けTips

### 効果的な質問のコツ

```
❌ 悪い質問:
「このコードどう思う？」

✅ 良い質問:
「このPRの認証ロジックで、
セッションタイムアウトの処理は適切ですか？
特にリフレッシュトークンの更新タイミングを確認してください」
```

### PR説明テンプレートとの連携

```markdown
<!-- .github/pull_request_template.md -->

## 概要
<!-- Copilotで自動生成 -->

## 変更内容
<!-- Copilotで自動生成 -->

## テスト方法
<!-- 手動で記載 -->
- [ ] ユニットテスト実行
- [ ] 統合テスト実行
- [ ] 手動テスト実行

## チェックリスト
- [ ] ドキュメント更新
- [ ] 破壊的変更なし
- [ ] セキュリティレビュー済み
```

### GitHub Mobile での利用

```
GitHub Mobile アプリでも利用可能:
- PR要約の確認
- Issue要約の確認
- 簡単な質問への回答

制限:
- 複雑なコード生成は不可
- 詳細なレビューには不向き
```

### API経由での利用

```bash
# GitHub CLI でCopilot機能を使用
gh copilot suggest "list files changed in PR #123"

# PR要約を取得（将来的なAPI）
gh api /repos/{owner}/{repo}/pulls/{number}/copilot-summary
```

---

## まとめ

| 機能 | 場所 | 用途 |
|------|------|------|
| PR要約 | PRページ | 大規模PRの理解 |
| PR説明生成 | PR作成画面 | 説明文の自動作成 |
| コミットメッセージ | 編集画面 | 適切なメッセージ提案 |
| Issue要約 | Issueページ | 長い議論の把握 |
| Copilot Chat | 全ページ | リポジトリへの質問 |

### Web版Copilotのベストプラクティス

1. **大規模PRは要約から**: まず全体像を把握
2. **具体的に質問**: 曖昧な質問は避ける
3. **セキュリティ確認**: 重要な変更は必ずレビュー
4. **テンプレート活用**: 自動生成と手動記載を組み合わせ
5. **日本語対応**: 日本語での質問・回答も可能

### 制限事項

```
⚠️ 注意:
- リアルタイムのコード補完は不可（エディタ専用）
- 大規模なリファクタリング生成は不向き
- 機密情報を含むリポジトリでは注意
- 生成内容は必ず人間がレビュー
```

次の章では、Copilotの効果的な使い方について学びます。
