---
title: "PR運用ルール"
quiz:
  - question: "理想的なPRサイズとして最も推奨されるのはどれですか?"
    options:
      - "800行以上"
      - "400〜800行"
      - "200行以下"
      - "50行以下のみ"
    answer: 2
  - question: "Draft PRの主な用途として適切でないものはどれですか?"
    options:
      - "作業中であることの可視化"
      - "早期フィードバックの取得"
      - "CI確認"
      - "即座にマージする"
    answer: 3
  - question: "PRのセルフレビューで確認すべきでないものはどれですか?"
    options:
      - "命名は適切か"
      - "エラーハンドリングは適切か"
      - "他のチームメンバーの作業進捗"
      - "機密情報は含まれていないか"
    answer: 2
---

この章では、効果的なプルリクエストの運用ルールについて学びます。適切なPRサイズ、テンプレートの設計、ドラフトPRの活用方法を解説します。

## PRサイズの目安

### 理想的なPRサイズ

| サイズ | 行数 | レビュー時間 | 推奨度 |
|--------|------|--------------|--------|
| XS | 〜50行 | 5分以内 | ⭐⭐⭐ |
| S | 51〜200行 | 15分以内 | ⭐⭐⭐ |
| M | 201〜400行 | 30分以内 | ⭐⭐ |
| L | 401〜800行 | 1時間以内 | ⭐ |
| XL | 800行〜 | 1時間以上 | 🚫 |

:::note
**経験則**: PRサイズが2倍になると、バグの見逃し確率は2倍以上になります。
:::

### 大きなPRを避ける理由

1. **レビュー品質の低下**: 大きすぎると「LGTM」で済まされがち
2. **マージコンフリクト**: 長期間のブランチは衝突しやすい
3. **リスクの増大**: 問題発生時の切り分けが困難
4. **フィードバック遅延**: 大きな修正が必要になりがち

### PRを小さく保つテクニック

```
1. 機能を分割する
   ❌ ユーザー管理機能
   ✅ ユーザー登録 → プロフィール編集 → パスワード変更

2. リファクタリングを分離する
   ❌ 機能追加 + リファクタリング
   ✅ リファクタリングPR → 機能追加PR

3. テストを別PRにする（場合による）
   ❌ 機能 + テスト（800行）
   ✅ テストの土台PR → 機能PR

4. 段階的に実装する
   ❌ 完成品を一括で
   ✅ API → UI → 統合
```

## PRテンプレートの設計

### 基本テンプレート

`.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## 概要
<!-- このPRで何を行うか簡潔に説明 -->

## 関連Issue
<!-- 関連するIssue番号 -->
Closes #

## 変更種別
- [ ] 新機能（feat）
- [ ] バグ修正（fix）
- [ ] リファクタリング（refactor）
- [ ] ドキュメント（docs）
- [ ] その他

## 変更内容
<!-- 具体的な変更点をリストで記載 -->
-
-

## テスト方法
<!-- レビュアーが動作確認できる手順 -->
1.

## スクリーンショット
<!-- UIの変更がある場合は添付 -->

## チェックリスト
- [ ] コードはセルフレビュー済み
- [ ] テストを追加/更新した
- [ ] ドキュメントを更新した（必要な場合）
- [ ] 破壊的変更はない（またはマイグレーション手順を記載）
```

### 種別ごとのテンプレート

#### 機能追加用

`.github/PULL_REQUEST_TEMPLATE/feature.md`:

```markdown
## 新機能の概要
<!-- 追加する機能の説明 -->

## ユーザーストーリー
<!-- 誰が、何を、なぜ -->
As a [ユーザー種別],
I want to [やりたいこと],
so that [得られる価値].

## 実装詳細
<!-- 技術的なアプローチの説明 -->

## テストシナリオ
- [ ] 正常系:
- [ ] 異常系:
- [ ] 境界値:

## デモ
<!-- GIFやスクリーンショット -->
```

#### バグ修正用

`.github/PULL_REQUEST_TEMPLATE/bugfix.md`:

```markdown
## バグの概要
Fixes #

## 再現手順
1.
2.
3.

## 原因
<!-- 根本原因の説明 -->

## 修正内容
<!-- どのように修正したか -->

## テスト
- [ ] バグが修正されていることを確認
- [ ] リグレッションがないことを確認

## Before / After
| Before | After |
|--------|-------|
| ![before](url) | ![after](url) |
```

### テンプレートの選択

URLパラメータでテンプレートを指定：

```
https://github.com/user/repo/compare/main...feature?template=feature.md
```

## Draft PRの活用

### Draft PRとは

レビュー準備ができていないPRを明示的に示す機能です。

### 使い分け

| 状態 | 用途 |
|------|------|
| **Draft** | 作業中、早期フィードバック、CI確認 |
| **Ready** | レビュー可能、マージ可能 |

### Draft PRのメリット

1. **WIPの可視化**: チームに作業状況を共有
2. **早期フィードバック**: 方向性の確認
3. **CI確認**: テストが通るか事前チェック
4. **段階的なレビュー**: 大きな変更を小分けに

### ワークフロー例

```
1. 作業開始時にDraft PRを作成
   - タイトルに [WIP] をつける必要なし
   - 自動で「Draft」バッジが表示される

2. 作業しながらプッシュ
   - CIが実行される
   - レビュアーは任意でコメント可能

3. 完成したら「Ready for review」
   - レビュアーに通知が送られる
   - マージ可能になる
```

### Draft PRの作成

```bash
# GitHub CLI
gh pr create --draft --title "機能追加" --body "WIP"

# Webから
# Create pull request ボタンの横にあるドロップダウンから
# "Create draft pull request" を選択
```

## PRのセルフレビュー

### セルフレビューの重要性

PR作成前に自分でレビューすることで：

1. 明らかなミスを事前に発見
2. レビュアーの時間を節約
3. PRの品質向上

### セルフレビューチェックリスト

```markdown
## コード品質
- [ ] 命名は適切か
- [ ] 重複コードはないか
- [ ] 複雑すぎる箇所はないか

## 機能
- [ ] 要件を満たしているか
- [ ] エッジケースは考慮されているか
- [ ] エラーハンドリングは適切か

## テスト
- [ ] 必要なテストは追加したか
- [ ] 既存のテストは通るか

## セキュリティ
- [ ] 入力値のバリデーションは適切か
- [ ] 機密情報は含まれていないか

## ドキュメント
- [ ] 必要なコメントは追加したか
- [ ] APIドキュメントは更新したか
```

## PRレビューのSLA

### レビュー時間の目安

| PRサイズ | 初回レビュー開始まで | レビュー完了まで |
|----------|----------------------|------------------|
| XS/S | 4時間以内 | 1営業日以内 |
| M | 8時間以内 | 2営業日以内 |
| L | 1営業日以内 | 3営業日以内 |

### SLAを守るための工夫

1. **レビュー時間の確保**: カレンダーにブロック
2. **通知の設定**: Slack連携、メール通知
3. **レビュアーのローテーション**: 特定の人に集中させない
4. **自動アサイン**: アクションやCODEOWNERSで自動化

## マージ前チェック

### 必須チェック項目

```yaml
# .github/workflows/pr-check.yml
name: PR Check

on:
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test
        run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: npm run build
```

### ブランチ保護との連携

Settings → Branches → Branch protection rules:

```
✅ Require status checks to pass before merging
  - lint
  - test
  - build

✅ Require branches to be up to date before merging
```

---

## 中級者向けTips

### PRサイズの自動ラベル付け

```yaml
# .github/workflows/pr-size.yml
name: PR Size Label

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Calculate size
        id: size
        run: |
          ADDITIONS=$(gh pr view ${{ github.event.pull_request.number }} --json additions -q '.additions')
          DELETIONS=$(gh pr view ${{ github.event.pull_request.number }} --json deletions -q '.deletions')
          TOTAL=$((ADDITIONS + DELETIONS))

          if [ $TOTAL -le 50 ]; then
            SIZE="XS"
          elif [ $TOTAL -le 200 ]; then
            SIZE="S"
          elif [ $TOTAL -le 400 ]; then
            SIZE="M"
          elif [ $TOTAL -le 800 ]; then
            SIZE="L"
          else
            SIZE="XL"
          fi

          echo "size=$SIZE" >> $GITHUB_OUTPUT
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Add label
        run: gh pr edit ${{ github.event.pull_request.number }} --add-label "size/${{ steps.size.outputs.size }}"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 古いPRの警告

```yaml
name: Stale PR Check

on:
  schedule:
    - cron: '0 9 * * 1-5'  # 平日9時

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v9
        with:
          stale-pr-message: 'このPRは7日間更新がありません。クローズするか、作業を続行してください。'
          days-before-pr-stale: 7
          days-before-pr-close: 14
```

---

## まとめ

| 項目 | 推奨 |
|------|------|
| PRサイズ | 200行以下（M以下） |
| テンプレート | 種別ごとに用意 |
| Draft PR | 作業中は積極的に活用 |
| セルフレビュー | PR作成前に必ず実施 |
| レビューSLA | 初回24時間以内 |

### PR運用のベストプラクティス

1. **小さく保つ**: 1PR = 1つの目的
2. **説明を丁寧に**: レビュアーの時間を節約
3. **早めにPR**: Draft PRで早期フィードバック
4. **迅速にレビュー**: SLAを設定して守る
5. **自動化**: CI/CDで品質を担保

次の章では、リリースフローについて学びます。
