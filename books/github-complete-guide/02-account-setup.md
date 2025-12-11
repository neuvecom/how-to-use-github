---
title: "アカウントの作成と設定"
---

# アカウントの作成と設定

この章では、GitHubアカウントの作成から、セキュリティ設定、認証方法の設定まで行います。

## アカウント作成

### 1. サインアップページにアクセス

https://github.com/signup にアクセスします。

### 2. 必要情報を入力

1. **メールアドレス**: 有効なメールアドレス（後で変更可能）
2. **パスワード**: 15文字以上、または8文字以上で数字と小文字を含む
3. **ユーザー名**: 英数字とハイフンのみ（後で変更可能だが、URLに影響）

:::message
**ユーザー名の選び方**
- 短く覚えやすいもの
- 本名またはハンドルネーム
- 企業アカウントの場合は組織名を含める
例: `taro-yamada`, `cooldev123`, `acme-corp-taro`
:::

### 3. メール認証

登録したメールアドレスに届く確認コードを入力します。

## プロフィール設定

### 基本プロフィール

Settings → Profile で設定できます。

| 項目 | 説明 | 推奨 |
|------|------|------|
| Name | 表示名 | 本名またはハンドルネーム |
| Bio | 自己紹介（160文字） | スキル・興味を簡潔に |
| Company | 所属組織 | `@組織名` 形式で入力可 |
| Location | 所在地 | 任意 |
| Website | 個人サイト等 | ポートフォリオURL等 |

### プロフィールREADME

`ユーザー名`と同じ名前のリポジトリを作成し、README.mdを追加すると、プロフィールページに表示されます。

```markdown
# Hi there 👋

## About Me
- 🔭 I'm currently working on ...
- 🌱 I'm currently learning ...
- 📫 How to reach me: ...

## Skills
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
```

## 2要素認証（2FA）の設定

:::message alert
**必須設定**: 2FAは必ず有効にしてください。アカウント乗っ取りを防ぐ最も重要な設定です。
:::

### 設定手順

1. **Settings** → **Password and authentication** → **Two-factor authentication**
2. **Enable two-factor authentication** をクリック
3. 認証方法を選択

### 認証方法の選択

| 方法 | 推奨度 | 説明 |
|------|--------|------|
| **認証アプリ** | ⭐⭐⭐ | Google Authenticator、1Password等 |
| **セキュリティキー** | ⭐⭐⭐ | YubiKey等のハードウェアキー |
| **SMS** | ⭐ | 電話番号宛にコード送信（非推奨） |

### リカバリーコードの保存

2FA設定時に表示されるリカバリーコードは**必ず安全な場所に保存**してください。

```
リカバリーコードの保存先例：
- パスワードマネージャー（1Password、Bitwarden等）
- 暗号化されたノート
- 印刷して金庫に保管
```

## SSH鍵の登録

SSHを使うと、毎回パスワードを入力せずにGitHubと通信できます。

### 1. SSH鍵の生成

```bash
# Ed25519（推奨）
ssh-keygen -t ed25519 -C "your_email@example.com"

# RSA（互換性が必要な場合）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

パスフレーズを設定することを推奨します。

### 2. SSH公開鍵をコピー

```bash
# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard

# Linux
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard
```

### 3. GitHubに登録

1. **Settings** → **SSH and GPG keys** → **New SSH key**
2. Title: `MacBook Pro 2024` のように識別しやすい名前
3. Key: コピーした公開鍵を貼り付け
4. **Add SSH key** をクリック

### 4. 接続テスト

```bash
ssh -T git@github.com
# Hi username! You've successfully authenticated...
```

:::details 複数のSSH鍵を使い分ける
`~/.ssh/config` で設定できます：

```
# 個人アカウント
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

# 会社アカウント
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

使用時: `git clone git@github-work:company/repo.git`
:::

## GPG署名の設定

コミットに署名を付けることで、本人が作成したことを証明できます。

### 1. GPG鍵の生成

```bash
# GPGがインストールされていない場合
# macOS: brew install gnupg
# Ubuntu: sudo apt install gnupg

gpg --full-generate-key
```

選択肢：
- 鍵の種類: RSA and RSA（デフォルト）
- 鍵長: 4096
- 有効期限: 1年〜2年を推奨
- 名前・メール: GitHubアカウントと同じメールアドレス

### 2. 鍵IDを確認

```bash
gpg --list-secret-keys --keyid-format=long
# sec   rsa4096/3AA5C34371567BD2 2024-01-01 [SC]
#                ↑ この部分が鍵ID
```

### 3. 公開鍵をエクスポート

```bash
gpg --armor --export 3AA5C34371567BD2
```

### 4. GitHubに登録

1. **Settings** → **SSH and GPG keys** → **New GPG key**
2. `-----BEGIN PGP PUBLIC KEY BLOCK-----` から `-----END PGP PUBLIC KEY BLOCK-----` までを貼り付け

### 5. Gitの設定

```bash
git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgsign true
```

署名付きコミットには「Verified」バッジが表示されます。

## 個人アクセストークン（PAT）の管理

HTTPS経由でGitHubにアクセスする場合、パスワードの代わりにPATを使用します。

### Fine-grained tokens（推奨）

より細かい権限制御が可能な新しい形式のトークンです。

1. **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. **Generate new token**
3. 設定項目：

| 項目 | 説明 |
|------|------|
| Token name | 用途がわかる名前 |
| Expiration | 有効期限（90日以内推奨） |
| Repository access | アクセス可能なリポジトリを限定 |
| Permissions | 必要最小限の権限のみ付与 |

### Classic tokens

従来形式のトークン。広範囲のアクセスが必要な場合に使用。

```
よく使うスコープ:
- repo: プライベートリポジトリへのフルアクセス
- workflow: GitHub Actionsワークフローの更新
- read:org: 組織情報の読み取り
```

:::message alert
**セキュリティ注意事項**
- トークンは一度だけ表示されます。必ずコピーして安全に保管
- トークンをコードにハードコードしない
- 定期的にトークンをローテーション
- 不要になったトークンは削除
:::

---

## 中級者向けTips

### ssh-agentでパスフレーズ入力を省略

```bash
# macOS - キーチェーンに保存
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

# Linux - ssh-agentを起動
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 1Password SSH Agent

1Passwordを使っている場合、SSH鍵を1Password内で管理し、生体認証で使用できます。

### GitHub CLI での認証

```bash
# インタラクティブに認証
gh auth login

# トークンで認証
gh auth login --with-token < token.txt

# 認証状態の確認
gh auth status
```

---

## まとめ

| 設定項目 | 優先度 | 状態確認場所 |
|----------|--------|--------------|
| 2要素認証 | 必須 | Settings → Password and authentication |
| SSH鍵 | 推奨 | Settings → SSH and GPG keys |
| GPG署名 | 任意 | Settings → SSH and GPG keys |
| PAT | 必要に応じて | Settings → Developer settings |

次の章では、リポジトリの作成と基本操作を学びます。
