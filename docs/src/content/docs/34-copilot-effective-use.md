---
title: "Copilot効果的な使い方"
---

この章では、Copilotを最大限活用するためのプロンプトの書き方、コンテキストの与え方、苦手なケースについて学びます。

## プロンプトの書き方

### 基本原則

良いプロンプトの4要素：

| 要素 | 説明 | 例 |
|------|------|-----|
| **目的** | 何を達成したいか | 「ユーザー認証を実装する」 |
| **制約** | 守るべき条件 | 「TypeScript、エラーハンドリング必須」 |
| **入出力** | 期待する入力と出力 | 「メールとパスワードを受け取り、JWTを返す」 |
| **例** | 具体的な使用例 | 「例: login("user@example.com", "pass123")」 |

### 良いプロンプトの例

```javascript
// ❌ 曖昧なプロンプト
// ユーザーを検証する関数

// ✅ 具体的なプロンプト
// ユーザー入力を検証する関数
// 引数: email (string), password (string)
// 戻り値: { valid: boolean, errors: string[] }
// 検証ルール:
// - emailは有効なメール形式
// - passwordは8文字以上
// - passwordは大文字、小文字、数字を含む
function validateUserInput(email, password) {
```

### 段階的なプロンプト

複雑な機能は段階的に：

```javascript
// Step 1: 基本構造
// HTTPクライアントクラスを作成
// - GET, POST, PUT, DELETE メソッド
// - ベースURLを設定可能
class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
}

// Step 2: メソッドを追加
// GETリクエストを実装
// - URLパラメータをサポート
// - エラーハンドリング付き
async get(endpoint, params = {}) {
}

// Step 3: 機能を拡張
// リトライ機能を追加
// - 最大3回リトライ
// - 指数バックオフ
```

## コンテキストの与え方

### ファイル構造でコンテキストを提供

```typescript
// types.ts - 先に型定義を開いておく
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// service.ts - 型を参照した実装が提案される
async function getUser(id: string): Promise<ApiResponse<User>> {
  // Copilotは上記の型を参照して適切な実装を提案
}
```

### インポートでライブラリを明示

```typescript
// 使用するライブラリをインポートしておく
import { z } from 'zod';
import { prisma } from './db';
import { redis } from './cache';

// Copilotはこれらのライブラリを使った提案をする
// zodでのバリデーションスキーマ
const userSchema = z.object({
  // zodの構文を使った提案
});
```

### 既存のコードパターンを示す

```javascript
// 既存のAPI関数
async function getUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to fetch users');
  }
  return response.json();
}

// 同じパターンで新しい関数を書くと
// 既存のスタイルに合わせた提案がされる
async function getProducts() {
  // 同じエラーハンドリングパターンが提案される
}
```

### コメントでドメイン知識を伝える

```python
# ECサイトの注文処理システム
# - 在庫管理はリアルタイム
# - 支払いは外部APIを使用
# - 配送は複数業者から選択可能

class OrderProcessor:
    """
    注文処理クラス

    処理フロー:
    1. 在庫確認
    2. 支払い処理
    3. 在庫減少
    4. 配送手配
    5. 通知送信
    """

    def process_order(self, order):
        # 上記のドメイン知識を考慮した実装が提案される
```

## 苦手なケースと対策

### ケース1: 最新のAPI・ライブラリ

```javascript
// ❌ 苦手: 最新版のAPI（学習データに含まれない）
// React 19の新機能を使う場合

// ✅ 対策: バージョンを明記してドキュメントを参照
// React 19の use() フックを使用
// 参考: https://react.dev/reference/react/use
function DataComponent({ promise }) {
  const data = use(promise);
  return <div>{data}</div>;
}
```

### ケース2: プロジェクト固有のロジック

```javascript
// ❌ 苦手: 業務固有の計算ロジック
// 「当社の価格計算ルール」を知らない

// ✅ 対策: ルールを詳細にコメントで説明
// 価格計算ルール:
// - 基本価格 × 数量
// - 10個以上で10%割引
// - 会員は追加5%割引
// - 消費税10%を加算
// - 小数点以下切り捨て
function calculatePrice(basePrice, quantity, isMember) {
```

### ケース3: 複雑な状態管理

```typescript
// ❌ 苦手: 複雑な状態遷移

// ✅ 対策: 状態遷移図をコメントで説明
// 注文ステータスの状態遷移:
// pending → paid → shipped → delivered
//    ↓        ↓       ↓
// cancelled  cancelled  returned
//
// 許可される遷移のみ実行、それ以外はエラー
function updateOrderStatus(order, newStatus) {
  const allowedTransitions = {
    pending: ['paid', 'cancelled'],
    paid: ['shipped', 'cancelled'],
    shipped: ['delivered', 'returned'],
    delivered: ['returned'],
    cancelled: [],
    returned: []
  };
  // ...
}
```

### ケース4: セキュリティ関連

```javascript
// ❌ 苦手: セキュリティのベストプラクティス
// Copilotが古い方法や脆弱な実装を提案することがある

// ✅ 対策: セキュリティ要件を明示
// パスワードハッシュ化
// - bcryptを使用（コスト係数12以上）
// - 平文パスワードをログに出力しない
// - タイミング攻撃に対策（定数時間比較）
async function hashPassword(password) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}
```

### ケース5: テスト戦略

```javascript
// ❌ 苦手: 適切なテスト戦略の判断

// ✅ 対策: テスト方針を明示
// 統合テスト
// - 実際のDBを使用（テスト用DB）
// - 各テスト後にデータをリセット
// - モックは外部APIのみ
describe('User registration', () => {
  beforeEach(async () => {
    await db.truncate('users');
  });

  // 具体的なテストケースを指定
  // 正常系: 有効な入力で登録成功
  // 異常系: 重複メールでエラー
  // 境界値: パスワード8文字ちょうど
});
```

## 効果的なワークフロー

### 反復的な改善

```javascript
// 1. まず基本実装を生成
function fetchData(url) {
  return fetch(url).then(res => res.json());
}

// 2. エラーハンドリングを追加
// エラーハンドリングを追加してください
// - ネットワークエラー
// - HTTPエラー（4xx, 5xx）

// 3. 型を追加
// TypeScriptの型を追加してください

// 4. テストを生成
// この関数のテストを書いてください
```

### ペアプログラミング的な使い方

```javascript
// 開発者: 構造を決める
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // Copilot: メソッドを提案
  addItem(product, quantity) {
    // ...
  }

  // 開発者: 要件を追加
  // 同じ商品があれば数量を加算、なければ新規追加

  // Copilot: 実装を修正
}
```

### レビュー駆動の開発

```javascript
// 1. Copilotにコードを生成させる
// 2. 問題点を指摘
// 3. 修正を依頼

// 生成されたコード
function divide(a, b) {
  return a / b;
}

// レビュー: ゼロ除算のチェックがない
// → 「ゼロ除算のエラーハンドリングを追加して」

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}
```

## 生産性を最大化するTips

### ショートカットの活用

```
VS Code:
- Tab: 提案を採用
- Esc: 提案を却下
- Alt+]: 単語単位で採用
- Ctrl+Enter: 複数候補表示
- Ctrl+I: インラインChat
- Ctrl+Shift+I: Chatパネル
```

### テンプレートの活用

```javascript
// よく使うパターンをテンプレート化
// snippet: api-endpoint
// ${1:エンドポイント名}のAPIハンドラ
// メソッド: ${2:GET|POST|PUT|DELETE}
// 認証: ${3:必要|不要}
// レスポンス: ${4:型名}

export async function handle${1}(req, res) {
  // Copilotがテンプレートを元に実装を提案
}
```

### プロジェクト設定ファイル

```json
// .github/copilot-instructions.md
// プロジェクト固有の指示を記載

このプロジェクトでは以下のルールに従ってください:
- TypeScriptを使用
- 関数型プログラミングスタイル
- エラーは Result 型で返す
- テストは Vitest を使用
- 命名規則: camelCase
```

---

## 中級者向けTips

### プロンプトエンジニアリング

```javascript
// 高度なプロンプト例
/*
 * 実装要件:
 * - 非同期バッチ処理
 * - 同時実行数は5に制限
 * - 失敗した項目はリトライキューへ
 * - プログレス報告機能付き
 *
 * 参考実装: Promise.allSettled + p-limit
 *
 * 使用例:
 * const results = await batchProcess(items, async (item) => {
 *   return await api.process(item);
 * }, { concurrency: 5, onProgress: (done, total) => {} });
 */
async function batchProcess(items, processor, options = {}) {
```

### コンテキストウィンドウの最適化

```javascript
// Copilotが参照するコンテキスト:
// 1. 現在のファイル（全体）
// 2. 開いているタブ（関連度順）
// 3. 最近編集したファイル

// 最適化Tips:
// - 関連ファイルを開いておく
// - 不要なタブは閉じる
// - 型定義ファイルを開いておく
// - テストファイルを参照させる
```

### デバッグ時の活用

```javascript
// エラーメッセージをそのまま貼り付けて解決策を求める
/*
Error: TypeError: Cannot read property 'map' of undefined
at UserList (src/components/UserList.jsx:15:23)
at renderWithHooks (node_modules/react-dom/...)

このエラーの原因と解決策を教えてください
*/

// Copilotの回答を元に修正:
function UserList({ users }) {
  // users が undefined の可能性がある
  if (!users) return <div>Loading...</div>;
  return users.map(user => <UserItem key={user.id} user={user} />);
}
```

---

## まとめ

| テクニック | 効果 |
|------------|------|
| 具体的なプロンプト | 精度向上 |
| 段階的な生成 | 複雑な機能の実装 |
| コンテキスト提供 | プロジェクト適合 |
| 制約の明示 | 品質向上 |

### 効果的な使い方のチェックリスト

```
プロンプト作成時:
☐ 目的を明確に記述
☐ 入出力を具体的に
☐ 制約条件を列挙
☐ 例を含める

コンテキスト設定:
☐ 関連ファイルを開く
☐ 型定義を用意
☐ 既存パターンを示す

レビュー時:
☐ セキュリティ確認
☐ エッジケース確認
☐ パフォーマンス確認
☐ 既存コードとの整合性
```

### やってはいけないこと

```
❌ 生成コードを無検証でコミット
❌ セキュリティ関連を盲信
❌ 機密情報をプロンプトに含める
❌ ライセンス未確認のコードを使用
❌ テストなしで本番投入
```

次の章では、Copilotの設定とカスタマイズについて学びます。
