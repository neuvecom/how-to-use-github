# GitHub完全ガイド

GitHubの基本から応用、AI活用までを網羅的に解説する完全ガイドです。

## 概要

このリポジトリは、GitHubを体系的に学ぶためのドキュメントサイトのソースコードです。初心者から中級者まで、GitHubの機能を網羅的に解説しています。

## コンテンツ構成

| 部 | 内容 |
|---|---|
| 第1部 | 入門編（GitHubとは、アカウント設定、リポジトリ基本） |
| 第2部 | 日常操作編（Git操作、ブランチ、PR、コードレビュー） |
| 第3部 | WebUI操作編（ブラウザ編集、github.dev、デプロイ） |
| 第4部 | 運用フロー編（ブランチ戦略、命名規則、リリースフロー） |
| 第5部 | ルール設定編（ブランチ保護、Rulesets、CODEOWNERS） |
| 第6部 | Issue・プロジェクト管理編 |
| 第7部 | GitHub Actions編 |
| 第8部 | セキュリティ編 |
| 第9部 | GitHub Copilot編（7章の詳細解説） |
| 第10部 | 組織・チーム管理編 |
| 第11部 | その他の機能編（Pages、Packages、Codespaces） |
| 第12部 | API・CLI編 |
| 第13部 | トラブルシューティング編 |
| 付録 | 用語集、ショートカット、参考リンク、テンプレート集 |

## 技術スタック

- [Astro](https://astro.build/) - 静的サイトジェネレーター
- [Starlight](https://starlight.astro.build/) - ドキュメントテーマ
- GitHub Pages - ホスティング
- GitHub Actions - 自動デプロイ

## ローカル開発

```bash
# 依存関係のインストール
cd docs
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## ライセンス

MIT License
