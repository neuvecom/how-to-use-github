---
title: "目的別の読む順番"
quiz:
  - question: "チームのmainブランチを誤操作から守りたいときに読むべき章はどれですか?"
    options:
      - "GitHub Pages"
      - "ブランチ保護ルール"
      - "Gists & Wiki"
      - "Copilot概要"
    answer: 1
  - question: "テストやデプロイを自動化したいときに読むべき部はどれですか?"
    options:
      - "GitHub Actions編"
      - "Issue・プロジェクト管理編"
      - "WebUI操作編"
      - "付録"
    answer: 0
---

この章で学ぶこと

- 自分の役割や課題に合った読み進め方
- 役割ごとに「最低限ここまで」読んでおきたい章
- 困ったときに直接開ける逆引きの章

## 自分のタイプを選ぶ

このガイドは第1部から順番に読むと体系的に学べるように作っていますが、すぐに仕事で使いたい人が46章を順に読むのは大変です。まず、次の表から自分に近いタイプを選んでください。

| タイプ | こんな人 | 最初のゴール |
|--------|----------|--------------|
| はじめての開発者 | GitHubを使うのが初めて | ひとりで迷わずPRを出せる |
| チームリーダー | チームの運用ルールを決める立場 | 事故の起きない運用を作れる |
| 非エンジニア | ドキュメントやサイトの更新を頼まれた | ブラウザだけで更新できる |
| 自動化・AI活用派 | 作業をもっと楽にしたい | テスト・デプロイ・コード補助を自動化できる |

どのタイプも、クイックマスターの4章を読み終えていれば準備は完了です。各ルートの章は上から順に読むことをおすすめします。

## はじめての開発者ルート

1. [リポジトリの基本](/how-to-use-github/03-repository-basics/)
2. [基本的なGit操作](/how-to-use-github/04-git-basics/)
3. [ブランチ管理](/how-to-use-github/05-branch-management/)
4. [プルリクエスト（PR）](/how-to-use-github/06-pull-requests/)
5. [コードレビュー](/how-to-use-github/07-code-review/)
6. [よくあるトラブルと解決法](/how-to-use-github/46-troubleshooting/)

## チームリーダールート

1. [ブランチ戦略](/how-to-use-github/12-branch-strategy/)
2. [コミットメッセージ規約](/how-to-use-github/14-commit-conventions/)
3. [PR運用ルール](/how-to-use-github/15-pr-guidelines/)
4. [ブランチ保護ルール](/how-to-use-github/17-branch-protection/)
5. [CODEOWNERS設定](/how-to-use-github/19-codeowners/)
6. [アクセス管理](/how-to-use-github/29-access-management/)
7. [Organization](/how-to-use-github/37-organization/)

## 非エンジニアルート

1. [WebUIでのファイル編集](/how-to-use-github/08-webui-file-editing/)
2. [github.devエディタ](/how-to-use-github/09-github-dev-editor/)
3. [WebUIでのブランチ・PR操作](/how-to-use-github/10-webui-branch-pr/)
4. [Issues](/how-to-use-github/21-issues/)
5. [WebUIからのデプロイ](/how-to-use-github/11-webui-deploy/)

## 自動化・AI活用ルート

1. [GitHub Actions基礎](/how-to-use-github/24-actions-basics/)
2. [CI/CDパイプライン](/how-to-use-github/26-cicd-pipeline/)
3. [Dependabot](/how-to-use-github/27-dependabot/)
4. [Copilot概要](/how-to-use-github/30-copilot-overview/)
5. [Copilot効果的な使い方](/how-to-use-github/34-copilot-effective-use/)
6. [GitHub CLI（gh）](/how-to-use-github/44-github-cli/)

## 困ったときの逆引き

| 困りごと | 開く章 |
|----------|--------|
| pushが拒否された、コンフリクトした | [よくあるトラブルと解決法](/how-to-use-github/46-troubleshooting/) |
| 間違えてコミットした、取り消したい | [基本的なGit操作](/how-to-use-github/04-git-basics/) |
| mainに直接pushされないようにしたい | [ブランチ保護ルール](/how-to-use-github/17-branch-protection/) |
| パスワードやキーをコミットしてしまった | [Code Scanning & Secret Scanning](/how-to-use-github/28-code-scanning/) |
| サイトを無料で公開したい | [GitHub Pages](/how-to-use-github/39-github-pages/) |
| 用語の意味がわからない | [用語集](/how-to-use-github/appendix-glossary/) |

学習の進み具合は [学習進捗](/how-to-use-github/progress/) で確認できます。

## まとめ

- クイックマスターのあとは、自分のタイプに合ったルートから読み始める
- 困りごとがはっきりしているときは、逆引きの表から直接その章を開く
- 時間ができたら第1部から順番に読むと、ルートで飛ばした部分が埋まる

ここまででクイックマスターは終わりです。次は第1部「入門編」で、各テーマをじっくり学んでいきましょう。
