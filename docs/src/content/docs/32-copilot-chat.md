---
title: "Copilot Chat"
---

この章では、Copilot Chatを使ったコードの説明、バグ調査、リファクタリング、テスト生成について学びます。

## Copilot Chatとは

**Copilot Chat**は、自然言語でコードについて質問・指示できるAIアシスタントです。コードの説明、バグ修正、リファクタリングなど、対話形式で開発をサポートします。

### 起動方法

| エディタ | 方法 |
|----------|------|
| VS Code | `Ctrl+Shift+I` または サイドバーのCopilotアイコン |
| JetBrains | `Ctrl+Shift+C` |
| GitHub.com | PRページのCopilotボタン |

## コードの説明

### 関数の説明を求める

```
質問: このコードは何をしていますか？

選択コード:
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

回答:
この関数は「デバウンス」パターンを実装しています。

1. 関数と遅延時間を引数として受け取ります
2. 新しい関数を返します
3. 返された関数が呼び出されると:
   - 前回のタイマーをキャンセル
   - 新しいタイマーを設定
   - 指定時間が経過してから元の関数を実行

用途: 検索入力やスクロールイベントなど、
頻繁に発火するイベントの処理を間引くのに使います。
```

### 複雑なロジックの解説

```
質問: このアルゴリズムを詳しく説明してください

選択コード:
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

回答:
これはクイックソートの実装です。

【アルゴリズムの流れ】
1. ピボット選択: 配列から基準値を選ぶ
2. パーティション: ピボットより小さい要素を左に、大きい要素を右に移動
3. 再帰: 左右それぞれの部分配列に対して同じ処理を繰り返す

【計算量】
- 平均: O(n log n)
- 最悪: O(n²) - すでにソート済みの場合

【特徴】
- インプレースソート（追加メモリ少）
- 不安定ソート（同値の順序が変わる可能性）
```

## バグの調査

### エラーの原因を特定

```
質問: このコードでTypeErrorが発生します。原因は何ですか？

コード:
function processUsers(users) {
  return users.map(user => user.name.toUpperCase());
}

processUsers([
  { name: "Alice" },
  { name: null },
  { name: "Bob" }
]);

回答:
エラーの原因: 2番目のユーザーの `name` が `null` であるため、
`null.toUpperCase()` を呼び出そうとしてTypeErrorが発生します。

修正案:
function processUsers(users) {
  return users.map(user => user.name?.toUpperCase() ?? '');
}

または、事前にバリデーション:
function processUsers(users) {
  return users
    .filter(user => user.name != null)
    .map(user => user.name.toUpperCase());
}
```

### デバッグの支援

```
質問: なぜこの関数は常にundefinedを返すのですか？

コード:
async function fetchUser(id) {
  fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(data => {
      return data;
    });
}

回答:
問題: async関数内でPromiseチェーンを使っていますが、
そのPromiseを `return` していません。

修正案1（Promiseを返す）:
async function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then(res => res.json());
}

修正案2（async/awaitを一貫して使用 - 推奨）:
async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
```

## リファクタリング

### コードの改善提案

```
質問: このコードをリファクタリングしてください

コード:
function getDiscount(user) {
  if (user.type === 'premium') {
    if (user.years > 5) {
      return 0.3;
    } else if (user.years > 2) {
      return 0.2;
    } else {
      return 0.1;
    }
  } else if (user.type === 'standard') {
    if (user.years > 5) {
      return 0.15;
    } else if (user.years > 2) {
      return 0.1;
    } else {
      return 0.05;
    }
  } else {
    return 0;
  }
}

回答:
リファクタリング案:

// 定数でルールを定義
const DISCOUNT_RULES = {
  premium: { 5: 0.3, 2: 0.2, 0: 0.1 },
  standard: { 5: 0.15, 2: 0.1, 0: 0.05 }
};

function getDiscount(user) {
  const rules = DISCOUNT_RULES[user.type];
  if (!rules) return 0;

  const thresholds = Object.keys(rules)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of thresholds) {
    if (user.years > threshold) {
      return rules[threshold];
    }
  }

  return 0;
}

改善点:
- 条件分岐のネストを解消
- ルールを設定として分離（変更が容易）
- 新しい会員タイプの追加が簡単
```

### パフォーマンス改善

```
質問: このコードのパフォーマンスを改善してください

コード:
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

回答:
現在の計算量: O(n³) - 二重ループ + includes

改善版（O(n)）:
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return [...duplicates];
}

改善ポイント:
- Setを使用してO(1)のルックアップ
- 計算量がO(n)に改善
- メモリ使用量は若干増加するがトレードオフとして許容範囲
```

## テスト生成

### ユニットテストの生成

```
質問: この関数のユニットテストを書いてください

コード:
function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain an uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain a lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain a number' };
  }
  return { valid: true };
}

回答:
describe('validatePassword', () => {
  describe('invalid passwords', () => {
    test('rejects password shorter than 8 characters', () => {
      const result = validatePassword('Ab1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('8 characters');
    });

    test('rejects password without uppercase letter', () => {
      const result = validatePassword('password1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    test('rejects password without lowercase letter', () => {
      const result = validatePassword('PASSWORD1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    test('rejects password without number', () => {
      const result = validatePassword('Password');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('number');
    });
  });

  describe('valid passwords', () => {
    test('accepts valid password', () => {
      const result = validatePassword('Password1');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('accepts longer valid password', () => {
      const result = validatePassword('SecurePassword123');
      expect(result.valid).toBe(true);
    });
  });
});
```

### エッジケースのテスト

```
質問: この関数のエッジケースをテストしてください

コード:
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

回答:
describe('divide - edge cases', () => {
  test('throws error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  test('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
    expect(divide(10, -2)).toBe(-5);
    expect(divide(-10, -2)).toBe(5);
  });

  test('handles decimal numbers', () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 2);
  });

  test('handles very large numbers', () => {
    expect(divide(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('handles Infinity', () => {
    expect(divide(Infinity, 2)).toBe(Infinity);
    expect(divide(10, Infinity)).toBe(0);
  });

  test('handles zero as dividend', () => {
    expect(divide(0, 5)).toBe(0);
  });
});
```

## スラッシュコマンド

### 組み込みコマンド

| コマンド | 説明 |
|----------|------|
| `/explain` | 選択コードの説明 |
| `/fix` | 問題の修正提案 |
| `/tests` | テストコード生成 |
| `/doc` | ドキュメント生成 |
| `/simplify` | コードの簡素化 |
| `/optimize` | パフォーマンス最適化 |

### 使用例

```
/explain
選択したコードの動作を説明します

/fix このコードでメモリリークが発生しています
問題を特定して修正案を提示

/tests Jest形式で
テストコードを生成

/doc JSDoc形式で
ドキュメントコメントを生成
```

## コンテキスト変数

### @workspace

プロジェクト全体を参照：

```
@workspace このプロジェクトの認証フローを説明してください

回答:
このプロジェクトの認証フローは以下の通りです:

1. /src/auth/login.ts - ログイン処理
2. /src/middleware/auth.ts - 認証ミドルウェア
3. /src/services/jwt.ts - JWTトークン管理

フロー:
1. ユーザーがログインフォームを送信
2. login.ts でクレデンシャルを検証
3. JWTトークンを発行してCookieに設定
4. 以降のリクエストはミドルウェアで検証
```

### @file

特定ファイルを参照：

```
@file:src/config.ts この設定ファイルで環境変数が正しく読み込まれていますか？
```

### @selection

選択中のコードを参照：

```
@selection このコードをasync/awaitで書き直してください
```

---

## 中級者向けTips

### 効果的なプロンプト

```
悪い例:
「このコードを直して」

良い例:
「このコードで発生しているTypeErrorを修正してください。
入力としてnullが渡される可能性を考慮し、
Optional Chainingを使った安全な実装にしてください。」
```

### 会話の継続

```
1. 最初の質問
「この関数をリファクタリングしてください」

2. フォローアップ
「ありがとうございます。さらにTypeScriptの型を追加してください」

3. 追加の要望
「エラーハンドリングも追加してください」
```

### カスタム指示

VS Code の設定:

```json
{
  "github.copilot.chat.localeOverride": "ja",
  "github.copilot.editor.enableCodeActions": true
}
```

### チャット履歴の活用

```
- 過去の会話を参照して一貫性を保つ
- 複雑な変更は段階的に進める
- 「前回の修正に加えて...」のように継続
```

---

## まとめ

| 用途 | コマンド/操作 |
|------|--------------|
| コード説明 | `/explain` または質問 |
| バグ修正 | `/fix` |
| リファクタリング | 「リファクタリングして」 |
| テスト生成 | `/tests` |
| ドキュメント | `/doc` |

### Copilot Chatのベストプラクティス

1. **具体的に質問**: 曖昧な質問より具体的な質問
2. **コンテキストを与える**: `@workspace`や`@file`を活用
3. **段階的に進める**: 大きな変更は小さく分割
4. **検証する**: 生成されたコードは必ずテスト
5. **フィードバック**: 良い回答には「それで大丈夫です」と伝える

### セキュリティ上の注意

```
⚠️ 注意事項:
- 機密情報をチャットに入力しない
- 生成されたコードのセキュリティを確認
- APIキーやパスワードを含むコードは避ける
- 本番コードには必ずレビューを実施
```

次の章では、GitHub上のCopilot機能について学びます。
