// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://neuvecom.github.io',
	base: '/how-to-use-github',
	integrations: [
		starlight({
			title: 'GitHub完全ガイド',
			description: 'GitHubの基本から応用、AI活用までを網羅的に解説する完全ガイド',
			defaultLocale: 'root',
			locales: {
				root: {
					label: '日本語',
					lang: 'ja',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/neuvecom/how-to-use-github' },
			],
			sidebar: [
				{
					label: '第1部：入門編',
					items: [
						{ label: 'GitHubとは', link: '/01-what-is-github/' },
						{ label: 'アカウントの作成と設定', link: '/02-account-setup/' },
						{ label: 'リポジトリの基本', link: '/03-repository-basics/' },
					],
				},
				{
					label: '第2部：日常操作編',
					items: [
						{ label: '基本的なGit操作', link: '/04-git-basics/' },
						{ label: 'ブランチ管理', link: '/05-branch-management/' },
						{ label: 'プルリクエスト（PR）', link: '/06-pull-requests/' },
						{ label: 'コードレビュー', link: '/07-code-review/' },
					],
				},
				{
					label: '第3部：WebUI操作編',
					items: [
						{ label: 'WebUIでのファイル編集', link: '/08-webui-file-editing/' },
						{ label: 'github.devエディタ', link: '/09-github-dev-editor/' },
						{ label: 'WebUIでのブランチ・PR操作', link: '/10-webui-branch-pr/' },
						{ label: 'WebUIからのデプロイ', link: '/11-webui-deploy/' },
					],
				},
				{
					label: '第4部：運用フロー編',
					items: [
						{ label: 'ブランチ戦略', link: '/12-branch-strategy/' },
						{ label: 'ブランチ命名規則', link: '/13-branch-naming/' },
						{ label: 'コミットメッセージ規約', link: '/14-commit-conventions/' },
						{ label: 'PR運用ルール', link: '/15-pr-guidelines/' },
						{ label: 'リリースフロー', link: '/16-release-flow/' },
					],
				},
				{
					label: '第5部：ルール設定編',
					items: [
						{ label: 'ブランチ保護ルール', link: '/17-branch-protection/' },
						{ label: 'Rulesets', link: '/18-rulesets/' },
						{ label: 'CODEOWNERS設定', link: '/19-codeowners/' },
						{ label: '自動化ルール', link: '/20-automation-rules/' },
					],
				},
				{
					label: '第6部：Issue・プロジェクト管理編',
					items: [
						{ label: 'Issues', link: '/21-issues/' },
						{ label: 'GitHub Projects', link: '/22-github-projects/' },
						{ label: 'Discussions', link: '/23-discussions/' },
					],
				},
				{
					label: '第7部：GitHub Actions編',
					items: [
						{ label: 'GitHub Actions基礎', link: '/24-actions-basics/' },
						{ label: 'GitHub Actions応用', link: '/25-actions-advanced/' },
						{ label: 'CI/CDパイプライン', link: '/26-cicd-pipeline/' },
					],
				},
				{
					label: '第8部：セキュリティ編',
					items: [
						{ label: 'Dependabot', link: '/27-dependabot/' },
						{ label: 'Code Scanning & Secret Scanning', link: '/28-code-scanning/' },
						{ label: 'アクセス管理', link: '/29-access-management/' },
					],
				},
				{
					label: '第9部：GitHub Copilot編',
					items: [
						{ label: 'Copilot概要', link: '/30-copilot-overview/' },
						{ label: 'Copilot基本機能', link: '/31-copilot-basics/' },
						{ label: 'Copilot Chat', link: '/32-copilot-chat/' },
						{ label: 'Copilot in GitHub（Web）', link: '/33-copilot-web/' },
						{ label: 'Copilot効果的な使い方', link: '/34-copilot-effective-use/' },
						{ label: 'Copilot設定とカスタマイズ', link: '/35-copilot-settings/' },
						{ label: 'Copilot活用ベストプラクティス', link: '/36-copilot-best-practices/' },
					],
				},
				{
					label: '第10部：組織・チーム管理編',
					items: [
						{ label: 'Organization', link: '/37-organization/' },
						{ label: 'Enterprise機能', link: '/38-enterprise/' },
					],
				},
				{
					label: '第11部：その他の機能編',
					items: [
						{ label: 'GitHub Pages', link: '/39-github-pages/' },
						{ label: 'GitHub Packages', link: '/40-github-packages/' },
						{ label: 'GitHub Releases', link: '/41-github-releases/' },
						{ label: 'Gists & Wiki', link: '/42-gists-wiki/' },
						{ label: 'GitHub Codespaces', link: '/43-codespaces/' },
					],
				},
				{
					label: '第12部：API・CLI編',
					items: [
						{ label: 'GitHub CLI（gh）', link: '/44-github-cli/' },
						{ label: 'GitHub API', link: '/45-github-api/' },
					],
				},
				{
					label: '第13部：トラブルシューティング編',
					items: [
						{ label: 'よくあるトラブルと解決法', link: '/46-troubleshooting/' },
					],
				},
				{
					label: '付録',
					items: [
						{ label: '用語集', link: '/appendix-glossary/' },
						{ label: 'ショートカットキー一覧', link: '/appendix-shortcuts/' },
						{ label: '参考リンク集', link: '/appendix-references/' },
						{ label: 'サンプルテンプレート集', link: '/appendix-templates/' },
					],
				},
			],
			customCss: ['./src/styles/custom.css'],
		}),
	],
});
