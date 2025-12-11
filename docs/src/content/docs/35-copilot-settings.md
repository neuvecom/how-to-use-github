---
title: "Copilot設定とカスタマイズ"
---

# Copilot設定とカスタマイズ

この章では、GitHub Copilotの言語別設定、組織ポリシー、プライバシー設定について学びます。

## 個人設定

### GitHub.comでの設定

Settings → Copilot:

```yaml
# コード補完の動作
Suggestions matching public code: Block  # 公開コード一致をブロック

# データ収集
Allow GitHub to use my code snippets: No  # コードスニペットの収集を拒否

# エディタ設定
Default editor: VS Code  # デフォルトエディタ
```

### VS Codeでの設定

`settings.json`:

```json
{
  // Copilot の有効/無効
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true,
    "yaml": true
  },

  // インラインサジェストの表示
  "github.copilot.inlineSuggest.enable": true,

  // 自動提案の遅延（ミリ秒）
  "github.copilot.inlineSuggest.delay": 50,

  // Chat の設定
  "github.copilot.chat.localeOverride": "ja",

  // コードアクションの有効化
  "github.copilot.editor.enableCodeActions": true,

  // 高度な設定
  "github.copilot.advanced": {
    "length": 500,
    "temperature": "",
    "top_p": 1,
    "inlineSuggestCount": 3
  }
}
```

## 言語別設定

### 特定言語での無効化

```json
{
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": false,
    "scminput": false,
    "env": false
  }
}
```

### 言語別の理由

| 言語 | 推奨設定 | 理由 |
|------|----------|------|
| **JavaScript/TypeScript** | 有効 | 高精度 |
| **Python** | 有効 | 高精度 |
| **Markdown** | 好みで | ドキュメント生成に便利 |
| **JSON** | 有効 | スキーマ補完に便利 |
| **env** | 無効 | 機密情報の漏洩防止 |
| **plaintext** | 無効 | 意図しない提案防止 |

### ファイルパターンでの除外

```json
{
  // .copilotignore ファイルを作成
  // (正式サポートは開発中)

  // VS Code の files.exclude で対応
  "files.exclude": {
    "**/.env*": true,
    "**/secrets/**": true
  }
}
```

## JetBrains IDEでの設定

### IntelliJ IDEA / WebStorm

Settings → Tools → GitHub Copilot:

```yaml
# 基本設定
Enable GitHub Copilot: ✅

# 言語別設定
Languages:
  JavaScript: ✅
  TypeScript: ✅
  Python: ✅
  Java: ✅
  Kotlin: ✅
  HTML: ✅
  CSS: ✅
  Markdown: ☐

# 詳細設定
Show suggestions automatically: ✅
Suggestion delay (ms): 50
Maximum suggestions: 3
```

### キーマップ

```yaml
# デフォルトキーマップ
Accept suggestion: Tab
Dismiss suggestion: Escape
Show next suggestion: Alt + ]
Show previous suggestion: Alt + [
Open Copilot panel: Alt + Enter
```

## 組織（Organization）ポリシー

### ポリシー設定場所

Organization Settings → Copilot → Policies:

```yaml
# メンバーへの許可
Copilot access:
  ☑ All organization members
  ☐ Selected teams only
  ☐ Selected members only

# 機能制限
Features:
  ☑ Code completion
  ☑ Copilot Chat
  ☑ Copilot in GitHub.com
  ☐ Copilot in CLI

# データポリシー
Suggestions matching public code: Block
Allow Copilot to use your organization's code: No
```

### チーム単位の設定

```yaml
# チームごとに異なる設定
engineering-team:
  Copilot: Enabled
  All features: Enabled

contractors:
  Copilot: Enabled
  Chat: Disabled
  CLI: Disabled

interns:
  Copilot: Disabled
```

### 許可するエディタ

```yaml
Allowed editors:
  ☑ Visual Studio Code
  ☑ Visual Studio
  ☑ JetBrains IDEs
  ☐ Neovim
  ☐ Vim

# 制限の理由
# - セキュリティソフトとの互換性
# - 監査対応
# - ライセンス管理
```

## プライバシー設定

### データ収集の制御

```yaml
GitHub Settings → Copilot:

# コードスニペットの収集
Allow GitHub to use my code snippets for product improvements:
  ☐ Allow（許可）
  ☑ Block（ブロック）

# 影響
Allow の場合:
  - 提案の品質向上に貢献
  - コードがGitHubに送信される

Block の場合:
  - コードは学習に使用されない
  - 提案の基となるコンテキストのみ送信
```

### テレメトリの設定

VS Code:

```json
{
  // VS Code のテレメトリ
  "telemetry.telemetryLevel": "off",

  // Copilot固有の設定
  "github.copilot.advanced": {
    "debug.overrideEngine": "",
    "debug.testOverrideProxyUrl": "",
    "debug.overrideProxyUrl": ""
  }
}
```

### 監査ログ

Organization Settings → Audit log:

```bash
# Copilot関連のログをフィルタ
action:copilot.seat_assigned
action:copilot.seat_cancelled
action:copilot.cfb_seat_added

# 確認できる情報
- いつ誰がCopilotを使用開始したか
- シートの割り当て/解除
- ポリシー変更
```

## ネットワーク設定

### プロキシ設定

```json
// VS Code settings.json
{
  "http.proxy": "http://proxy.example.com:8080",
  "http.proxyStrictSSL": true,
  "github.copilot.advanced": {
    "proxy": "http://proxy.example.com:8080"
  }
}
```

### ファイアウォール許可

```yaml
# 許可が必要なドメイン
- copilot-proxy.githubusercontent.com
- api.github.com
- github.com
- *.githubcopilot.com

# ポート
- 443 (HTTPS)
```

### IP許可リスト

```yaml
Organization Settings → Authentication security:

IP allow list:
  - 203.0.113.0/24  # オフィスネットワーク
  - 10.0.0.0/8      # VPN

# Copilot は許可されたIPからのみ使用可能
```

## Copilot Instructionsファイル

### プロジェクト固有の指示

```markdown
<!-- .github/copilot-instructions.md -->
# Copilot Instructions

このプロジェクトでは以下のガイドラインに従ってください:

## コーディングスタイル
- TypeScriptを使用
- 関数型プログラミングを推奨
- 変数名はcamelCase
- 定数はUPPER_SNAKE_CASE

## ライブラリ
- HTTPクライアント: axios
- 状態管理: Zustand
- バリデーション: Zod
- テスト: Vitest

## 禁止事項
- `any` 型の使用
- `console.log` の残存
- 非推奨APIの使用

## エラーハンドリング
- Result型パターンを使用
- 例外は最上位でキャッチ
```

### Organization全体の指示

```markdown
<!-- Organization設定で指定 -->
# Organization Copilot Instructions

## セキュリティ
- 平文でのシークレット埋め込み禁止
- SQLクエリはパラメータ化必須
- ユーザー入力は必ずサニタイズ

## コンプライアンス
- ログに個人情報を出力しない
- GDPRに準拠したデータ処理
- 監査証跡を残す

## ライセンス
- GPL系ライブラリの使用禁止
- MITまたはApache 2.0のみ許可
```

---

## 中級者向けTips

### 高度なVS Code設定

```json
{
  // 実験的機能
  "github.copilot.editor.enableAutoCompletions": true,

  // デバッグ設定
  "github.copilot.advanced": {
    "debug.overrideChatEngine": "",
    "debug.chatOverrideProxyUrl": "",
    "listCount": 10,
    "inlineSuggestCount": 5
  },

  // キーバインド
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "json": true
  }
}
```

### カスタムキーバインド

`keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+space",
    "command": "github.copilot.generate",
    "when": "editorTextFocus && github.copilot.activated"
  },
  {
    "key": "ctrl+alt+c",
    "command": "github.copilot.toggleCopilot"
  },
  {
    "key": "ctrl+shift+/",
    "command": "github.copilot.interactiveEditor.explain",
    "when": "editorHasSelection"
  }
]
```

### 環境別の設定

```json
// .vscode/settings.json (プロジェクト固有)
{
  // このプロジェクトでのみ有効な設定
  "github.copilot.enable": {
    "*": true,
    "env": false,
    "*.secret": false
  }
}
```

### Copilot使用状況のモニタリング

```bash
# GitHub CLI で使用状況を確認
gh api /orgs/{org}/copilot/billing

# 結果例
{
  "seat_breakdown": {
    "total": 50,
    "active_this_cycle": 45,
    "inactive_this_cycle": 5
  },
  "seat_management_setting": "assign_selected"
}
```

---

## まとめ

| 設定カテゴリ | 設定場所 | 対象 |
|--------------|----------|------|
| 個人設定 | GitHub.com + エディタ | 自分のみ |
| 組織ポリシー | Organization Settings | 組織全体 |
| プロジェクト設定 | .github/copilot-instructions.md | リポジトリ |

### 設定のベストプラクティス

1. **プライバシー優先**: コードスニペット収集はオフ推奨
2. **言語別設定**: 機密ファイル（.env等）は無効化
3. **組織ポリシー**: 統一されたルールを設定
4. **プロジェクト指示**: copilot-instructions.mdを活用
5. **定期レビュー**: 設定を定期的に見直し

### 推奨設定（企業向け）

```yaml
# Organization ポリシー
Suggestions matching public code: Block
Data collection: Disabled
Allowed editors: VS Code, JetBrains only

# 個人設定（強制）
Code snippets for improvements: No
Telemetry: Minimal

# プロジェクト設定
- copilot-instructions.md を各リポジトリに配置
- セキュリティガイドラインを明記
```

次の章では、Copilot活用のベストプラクティスについて学びます。
