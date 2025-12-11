# Githubの使い方を詳細まで解説する

Githubの基本から応用、AI活用までを網羅的に解説します。

## 目次

### 第1部：入門編

1. [Githubとは](#githubとは)
   - GitとGitHubの違い
   - サービス体系（Free/Team/Enterprise）
2. [アカウントの作成と設定](#アカウントの作成と設定)
   - アカウント作成・プロフィール設定
   - 2要素認証（2FA）
   - SSH鍵・GPG署名・PAT
3. [リポジトリの基本](#リポジトリの基本)
   - 作成（Public/Private）
   - README/.gitignore/ライセンス
   - フォーク・クローン・テンプレート

### 第2部：日常操作編

4. [基本的なGit操作](#基本的なgit操作)
   - コミット・プッシュ・プル
   - ステージングエリア
5. [ブランチ管理](#ブランチ管理)
   - 作成・削除・保護ルール
   - デフォルトブランチ設定
6. [プルリクエスト（PR）](#プルリクエストpr)
   - 作成・ドラフトPR・テンプレート
   - ラベル・マイルストーン
   - マージ方法（Merge/Squash/Rebase）
7. [コードレビュー](#コードレビュー)
   - インラインコメント・サジェスチョン
   - レビューステータス
   - CODEOWNERS・必須レビュー

### 第3部：WebUI操作編

8. [WebUIでのファイル編集](#webuiでのファイル編集)
   - ブラウザ上での編集・作成・削除
   - ファイル名変更・移動
9. [github.devエディタ](#githubdevエディタ)
   - 「.」キーで起動
   - VS Code風エディタでの編集
   - 軽微な修正ワークフロー
10. [WebUIでのブランチ・PR操作](#webuiでのブランチpr操作)
    - ブランチ作成・切り替え
    - WebUI上でのコミット
    - コンフリクト解決
11. [WebUIからのデプロイ](#webuiからのデプロイ)
    - workflow_dispatch（手動実行）
    - Releasesからのトリガー
    - Environments承認フロー

### 第4部：運用フロー編

12. [ブランチ戦略](#ブランチ戦略)
    - Git Flow
    - GitHub Flow
    - Trunk Based Development
    - 選択基準
13. [ブランチ命名規則](#ブランチ命名規則)
    - feature/, fix/, hotfix/, release/
    - チケット番号連携
14. [コミットメッセージ規約](#コミットメッセージ規約)
    - Conventional Commits
    - プレフィックス（feat:, fix:, docs:等）
    - commitlint自動チェック
15. [PR運用ルール](#pr運用ルール)
    - PRサイズの目安
    - テンプレート設計
    - Draft PR活用
16. [リリースフロー](#リリースフロー)
    - セマンティックバージョニング
    - CHANGELOG管理
    - タグ運用・リリースノート自動生成

### 第5部：ルール設定編

17. [ブランチ保護ルール](#ブランチ保護ルール)
    - mainへの直接プッシュ禁止
    - PR必須化
    - 必須レビュー数
    - ステータスチェック必須
    - 管理者への適用
18. [Rulesets](#rulesets)
    - ブランチ保護との違い
    - 複数ブランチ一括適用
    - タグ保護・バイパス権限
19. [CODEOWNERS設定](#codeowners設定)
    - ファイルの書き方
    - パス・チーム単位指定
20. [自動化ルール](#自動化ルール)
    - 自動マージ条件
    - 自動ラベル付け
    - Stale自動クローズ

### 第6部：Issue・プロジェクト管理編

21. [Issues](#issues)
    - 作成・テンプレート・フォーム
    - ラベル・マイルストーン・アサイン
22. [GitHub Projects](#github-projects)
    - ボード・テーブル・ロードマップ
    - カスタムフィールド
    - 自動化ワークフロー
23. [Discussions](#discussions)
    - カテゴリ・Q&A
    - Issueへの変換

### 第7部：GitHub Actions編

24. [GitHub Actions基礎](#github-actions基礎)
    - ワークフロー構造
    - トリガー（push, PR, schedule, dispatch）
    - ランナー・マーケットプレイス
25. [GitHub Actions応用](#github-actions応用)
    - マトリックスビルド
    - シークレット・キャッシュ
    - 再利用可能ワークフロー
26. [CI/CDパイプライン](#cicdパイプライン)
    - 自動テスト・ビルド・デプロイ
    - Environments・承認フロー

### 第8部：セキュリティ編

27. [Dependabot](#dependabot)
    - 依存関係アラート
    - セキュリティ/バージョンアップデート
28. [Code Scanning & Secret Scanning](#code-scanning--secret-scanning)
    - CodeQL導入
    - シークレット検出・プッシュ保護
29. [アクセス管理](#アクセス管理)
    - 権限レベル
    - Deploy Keys・GitHub Apps

### 第9部：GitHub Copilot編

30. [Copilot概要](#copilot概要)
    - 料金プラン（Individual/Business/Enterprise）
    - 対応エディタ・利用規約
31. [Copilot基本機能](#copilot基本機能)
    - コード補完・複数候補
    - コメントからのコード生成
32. [Copilot Chat](#copilot-chat)
    - コード説明・バグ調査
    - リファクタリング・テスト生成
33. [Copilot in GitHub（Web）](#copilot-in-githubweb)
    - PR要約・レビュー支援
    - Issue要約・コミットメッセージ提案
34. [Copilot効果的な使い方](#copilot効果的な使い方)
    - プロンプトの書き方
    - コンテキストの与え方
    - 苦手なケース
35. [Copilot設定とカスタマイズ](#copilot設定とカスタマイズ)
    - 言語別設定
    - 組織ポリシー・プライバシー
36. [Copilot活用ベストプラクティス](#copilot活用ベストプラクティス)
    - レビュー必須・セキュリティ
    - 著作権・チーム運用

### 第10部：組織・チーム管理編

37. [Organization](#organization)
    - 作成・メンバー管理
    - チーム階層・権限
38. [Enterprise機能](#enterprise機能)
    - SAML SSO・監査ログ

### 第11部：その他の機能編

39. [GitHub Pages](#github-pages)
    - 静的サイトホスティング
    - カスタムドメイン
40. [GitHub Packages](#github-packages)
    - npm/Docker対応
41. [GitHub Releases](#github-releases)
    - リリース作成・自動生成
42. [Gists & Wiki](#gists--wiki)
    - スニペット共有・Wikiページ
43. [GitHub Codespaces](#github-codespaces)
    - クラウド開発環境
    - devcontainer設定

### 第12部：API・CLI編

44. [GitHub CLI（gh）](#github-cligh)
    - インストール・主要コマンド
    - エイリアス
45. [GitHub API](#github-api)
    - REST/GraphQL
    - Webhooks

### 第13部：トラブルシューティング編

46. [よくあるトラブルと解決法](#よくあるトラブルと解決法)
    - 認証エラー・プッシュ拒否
    - コンフリクト解決
    - 履歴修正・誤コミット取消

### 付録

- [用語集](#用語集)
- [ショートカットキー一覧](#ショートカットキー一覧)
- [参考リンク集](#参考リンク集)
- [サンプルテンプレート集](#サンプルテンプレート集)
