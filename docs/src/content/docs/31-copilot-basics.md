---
title: "Copilot基本機能"
---

この章では、GitHub Copilotのコード補完機能、複数候補の表示、コメントからのコード生成について学びます。

## コード補完

### 基本的な動作

コードを入力すると、Copilotが続きを予測して提案します：

```javascript
// 入力中...
function calculateTax(price, rate) {
  // ここでCopilotが提案 ↓
  return price * rate;
}
```

### 提案の採用

| キー | 動作 |
|------|------|
| `Tab` | 提案を採用 |
| `Esc` | 提案を却下 |
| `Ctrl+]` | 次の候補を表示 |
| `Ctrl+[` | 前の候補を表示 |
| `Alt+]` | 次の単語のみ採用 |

### インラインでの提案

```python
# 入力
def send_email(to, subject, body):
    # Copilotの提案（グレーで表示）
    import smtplib
    from email.mime.text import MIMEText

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['To'] = to

    # Tab で採用
```

## 複数候補の表示

### Copilot パネル

`Ctrl+Enter`（Mac: `Cmd+Enter`）で複数の候補を一覧表示：

```javascript
// function sort(arr) で候補を表示

// 候補1: クイックソート
function sort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...sort(left), pivot, ...sort(right)];
}

// 候補2: バブルソート
function sort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 候補3: 組み込みメソッド使用
function sort(arr) {
  return [...arr].sort((a, b) => a - b);
}
```

### 候補の選択

パネル内で：
- 上下キーで候補を移動
- `Enter` または `Accept` で採用
- `Esc` で閉じる

## コメントからのコード生成

### 関数の自動生成

```javascript
// ユーザーIDからユーザー情報を取得する関数
// APIエンドポイント: /api/users/:id
// 戻り値: { id, name, email, createdAt }
async function getUserById(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json();
}
```

### 詳細なコメントで精度向上

```python
# CSVファイルを読み込んでDataFrameに変換する関数
# 引数:
#   - file_path: CSVファイルのパス
#   - encoding: 文字エンコーディング（デフォルト: utf-8）
#   - skip_rows: スキップする先頭行数（デフォルト: 0）
# 戻り値: pandas DataFrame
# 例外: ファイルが存在しない場合はFileNotFoundError

def read_csv_to_dataframe(file_path, encoding='utf-8', skip_rows=0):
    import pandas as pd

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    return pd.read_csv(
        file_path,
        encoding=encoding,
        skiprows=skip_rows
    )
```

### テストコードの生成

```javascript
// テスト対象の関数
function add(a, b) {
  return a + b;
}

// add関数のテストを書く
// - 正の数同士の加算
// - 負の数を含む加算
// - 0を含む加算
// - 小数点を含む加算

describe('add', () => {
  test('adds positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  test('adds with zero', () => {
    expect(add(5, 0)).toBe(5);
  });

  test('adds decimal numbers', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});
```

## コンテキストの活用

### ファイル全体のコンテキスト

Copilotは現在のファイル全体を参照します：

```typescript
// ファイル上部で定義
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// 下部でUser型を使う関数を書くと、
// Copilotは上部の型定義を参照して適切な提案をする
function formatUser(user: User): string {
  return `${user.name} (${user.email}) - ${user.role}`;
}
```

### 関連ファイルのコンテキスト

開いているタブのファイルも参照されます：

```
# 開いているファイル
- types.ts（型定義）
- api.ts（API関数）
- utils.ts（ユーティリティ）

# 新しいファイルで
# これらの型や関数を使うコードを書くと
# 適切な提案が得られやすい
```

### プロジェクトの慣習を学習

```javascript
// プロジェクトで既存のコード
const fetchUser = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

// 同じパターンで新しい関数を書くと
// 既存のスタイルに合わせた提案がされる
const fetchProduct = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
```

## 効果的な使い方

### 命名で意図を伝える

```python
# 曖昧な名前 → 曖昧な提案
def process(data):
    # ...

# 明確な名前 → 適切な提案
def validate_email_format(email: str) -> bool:
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))
```

### 段階的に書く

```javascript
// 一度に全部書かせるより、段階的に

// Step 1: 関数シグネチャ
async function uploadFile(file, options) {

// Step 2: バリデーション（コメントで指示）
  // ファイルサイズをチェック（最大10MB）
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit');
  }

// Step 3: メイン処理
  // S3にアップロード
  const formData = new FormData();
  formData.append('file', file);
  // ...
}
```

### エラーハンドリングの追加

```typescript
// 基本実装を書いた後、エラーハンドリングを追加
async function fetchData(url: string) {
  // try-catchでエラーハンドリング
  // リトライは3回まで
  // タイムアウトは5秒

  let attempts = 0;
  const maxAttempts = 3;
  const timeout = 5000;

  while (attempts < maxAttempts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(`Failed after ${maxAttempts} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
}
```

## 言語別のTips

### JavaScript/TypeScript

```typescript
// JSDocコメントで型情報を伝える
/**
 * ユーザーを検索する
 * @param {string} query - 検索クエリ
 * @param {Object} options - オプション
 * @param {number} options.limit - 取得件数
 * @param {number} options.offset - オフセット
 * @returns {Promise<User[]>} ユーザーの配列
 */
async function searchUsers(query, options = {}) {
  // Copilotが型情報を参照して適切な実装を提案
}
```

### Python

```python
# 型ヒントで意図を伝える
from typing import List, Dict, Optional

def process_items(
    items: List[Dict[str, any]],
    filter_key: Optional[str] = None
) -> List[Dict[str, any]]:
    """
    アイテムリストを処理する

    Args:
        items: 処理対象のアイテムリスト
        filter_key: フィルタリングするキー

    Returns:
        処理済みのアイテムリスト
    """
    if filter_key:
        return [item for item in items if filter_key in item]
    return items
```

### SQL

```sql
-- テーブル構造をコメントで説明
-- users テーブル: id, name, email, created_at
-- orders テーブル: id, user_id, total, status, created_at

-- 過去30日間で最も注文金額が多いユーザートップ10
SELECT
    u.id,
    u.name,
    SUM(o.total) as total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.name
ORDER BY total_amount DESC
LIMIT 10;
```

---

## 中級者向けTips

### カスタムショートカット

VS Code の `keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+space",
    "command": "github.copilot.generate",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+c",
    "command": "github.copilot.toggleCopilot"
  }
]
```

### インラインChat

VS Code で `Ctrl+I` でインラインChatを起動：

```javascript
// 選択したコードに対して
// "この関数をTypeScriptに変換して" と指示

// 変換前
function add(a, b) {
  return a + b;
}

// 変換後
function add(a: number, b: number): number {
  return a + b;
}
```

### 提案の質を上げるテクニック

```javascript
// 1. 具体的な例を示す
// 入力例: "hello" → 出力例: "Hello"
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 2. 制約を明記
// 制約: 配列は空でない、要素は全て正の整数
function findMax(arr) {
  return Math.max(...arr);
}

// 3. エッジケースを列挙
// エッジケース: 空文字列、null、undefined、特殊文字
function sanitize(input) {
  if (!input) return '';
  return input.replace(/[<>&"']/g, char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}
```

---

## まとめ

| 機能 | 操作 | 用途 |
|------|------|------|
| 単一補完 | 入力中に自動表示 | 日常的なコーディング |
| 複数候補 | `Ctrl+Enter` | 複数のアプローチを比較 |
| コメント生成 | コメント → Tab | 新規関数の作成 |
| インラインChat | `Ctrl+I` | 選択コードの変換 |

### コード補完のベストプラクティス

1. **明確な命名**: 関数名・変数名で意図を伝える
2. **コメント活用**: 詳細なコメントで精度向上
3. **型情報**: TypeScript/型ヒントを活用
4. **段階的に**: 一度に全部ではなく段階的に生成
5. **レビュー必須**: 生成されたコードは必ず確認

### 採用/却下の判断基準

```
✅ 採用すべき場合:
- コードが正確で意図通り
- セキュリティ上の問題がない
- プロジェクトの規約に準拠

❌ 却下すべき場合:
- 非推奨のAPIを使用
- セキュリティリスクがある
- 既存のコードと整合性がない
```

次の章では、Copilot Chatについて学びます。
