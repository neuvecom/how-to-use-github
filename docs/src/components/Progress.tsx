import { useState, useEffect } from 'react';

interface ChapterInfo {
  id: string;
  title: string;
  link: string;
}

interface PartInfo {
  label: string;
  chapters: ChapterInfo[];
}

const STORAGE_KEY_PREFIX = 'github-guide-quiz-';

// 全章の構成データ
const parts: PartInfo[] = [
  {
    label: '第1部：入門編',
    chapters: [
      { id: '01-what-is-github', title: 'GitHubとは', link: '/how-to-use-github/01-what-is-github/' },
      { id: '02-account-setup', title: 'アカウントの作成と設定', link: '/how-to-use-github/02-account-setup/' },
      { id: '03-repository-basics', title: 'リポジトリの基本', link: '/how-to-use-github/03-repository-basics/' },
    ],
  },
  {
    label: '第2部：日常操作編',
    chapters: [
      { id: '04-git-basics', title: '基本的なGit操作', link: '/how-to-use-github/04-git-basics/' },
      { id: '05-branch-management', title: 'ブランチ管理', link: '/how-to-use-github/05-branch-management/' },
      { id: '06-pull-requests', title: 'プルリクエスト（PR）', link: '/how-to-use-github/06-pull-requests/' },
      { id: '07-code-review', title: 'コードレビュー', link: '/how-to-use-github/07-code-review/' },
    ],
  },
  {
    label: '第3部：WebUI操作編',
    chapters: [
      { id: '08-webui-file-editing', title: 'WebUIでのファイル編集', link: '/how-to-use-github/08-webui-file-editing/' },
      { id: '09-github-dev-editor', title: 'github.devエディタ', link: '/how-to-use-github/09-github-dev-editor/' },
      { id: '10-webui-branch-pr', title: 'WebUIでのブランチ・PR操作', link: '/how-to-use-github/10-webui-branch-pr/' },
      { id: '11-webui-deploy', title: 'WebUIからのデプロイ', link: '/how-to-use-github/11-webui-deploy/' },
    ],
  },
  {
    label: '第4部：運用フロー編',
    chapters: [
      { id: '12-branch-strategy', title: 'ブランチ戦略', link: '/how-to-use-github/12-branch-strategy/' },
      { id: '13-branch-naming', title: 'ブランチ命名規則', link: '/how-to-use-github/13-branch-naming/' },
      { id: '14-commit-conventions', title: 'コミットメッセージ規約', link: '/how-to-use-github/14-commit-conventions/' },
      { id: '15-pr-guidelines', title: 'PR運用ルール', link: '/how-to-use-github/15-pr-guidelines/' },
      { id: '16-release-flow', title: 'リリースフロー', link: '/how-to-use-github/16-release-flow/' },
    ],
  },
  {
    label: '第5部：ルール設定編',
    chapters: [
      { id: '17-branch-protection', title: 'ブランチ保護ルール', link: '/how-to-use-github/17-branch-protection/' },
      { id: '18-rulesets', title: 'Rulesets', link: '/how-to-use-github/18-rulesets/' },
      { id: '19-codeowners', title: 'CODEOWNERS設定', link: '/how-to-use-github/19-codeowners/' },
      { id: '20-automation-rules', title: '自動化ルール', link: '/how-to-use-github/20-automation-rules/' },
    ],
  },
  {
    label: '第6部：Issue・プロジェクト管理編',
    chapters: [
      { id: '21-issues', title: 'Issues', link: '/how-to-use-github/21-issues/' },
      { id: '22-github-projects', title: 'GitHub Projects', link: '/how-to-use-github/22-github-projects/' },
      { id: '23-discussions', title: 'Discussions', link: '/how-to-use-github/23-discussions/' },
    ],
  },
  {
    label: '第7部：GitHub Actions編',
    chapters: [
      { id: '24-actions-basics', title: 'GitHub Actions基礎', link: '/how-to-use-github/24-actions-basics/' },
      { id: '25-actions-advanced', title: 'GitHub Actions応用', link: '/how-to-use-github/25-actions-advanced/' },
      { id: '26-cicd-pipeline', title: 'CI/CDパイプライン', link: '/how-to-use-github/26-cicd-pipeline/' },
    ],
  },
  {
    label: '第8部：セキュリティ編',
    chapters: [
      { id: '27-dependabot', title: 'Dependabot', link: '/how-to-use-github/27-dependabot/' },
      { id: '28-code-scanning', title: 'Code Scanning & Secret Scanning', link: '/how-to-use-github/28-code-scanning/' },
      { id: '29-access-management', title: 'アクセス管理', link: '/how-to-use-github/29-access-management/' },
    ],
  },
  {
    label: '第9部：GitHub Copilot編',
    chapters: [
      { id: '30-copilot-overview', title: 'Copilot概要', link: '/how-to-use-github/30-copilot-overview/' },
      { id: '31-copilot-basics', title: 'Copilot基本機能', link: '/how-to-use-github/31-copilot-basics/' },
      { id: '32-copilot-chat', title: 'Copilot Chat', link: '/how-to-use-github/32-copilot-chat/' },
      { id: '33-copilot-web', title: 'Copilot in GitHub（Web）', link: '/how-to-use-github/33-copilot-web/' },
      { id: '34-copilot-effective-use', title: 'Copilot効果的な使い方', link: '/how-to-use-github/34-copilot-effective-use/' },
      { id: '35-copilot-settings', title: 'Copilot設定とカスタマイズ', link: '/how-to-use-github/35-copilot-settings/' },
      { id: '36-copilot-best-practices', title: 'Copilot活用ベストプラクティス', link: '/how-to-use-github/36-copilot-best-practices/' },
    ],
  },
  {
    label: '第10部：組織・チーム管理編',
    chapters: [
      { id: '37-organization', title: 'Organization', link: '/how-to-use-github/37-organization/' },
      { id: '38-enterprise', title: 'Enterprise機能', link: '/how-to-use-github/38-enterprise/' },
    ],
  },
  {
    label: '第11部：その他の機能編',
    chapters: [
      { id: '39-github-pages', title: 'GitHub Pages', link: '/how-to-use-github/39-github-pages/' },
      { id: '40-github-packages', title: 'GitHub Packages', link: '/how-to-use-github/40-github-packages/' },
      { id: '41-github-releases', title: 'GitHub Releases', link: '/how-to-use-github/41-github-releases/' },
      { id: '42-gists-wiki', title: 'Gists & Wiki', link: '/how-to-use-github/42-gists-wiki/' },
      { id: '43-codespaces', title: 'GitHub Codespaces', link: '/how-to-use-github/43-codespaces/' },
    ],
  },
  {
    label: '第12部：API・CLI編',
    chapters: [
      { id: '44-github-cli', title: 'GitHub CLI（gh）', link: '/how-to-use-github/44-github-cli/' },
      { id: '45-github-api', title: 'GitHub API', link: '/how-to-use-github/45-github-api/' },
    ],
  },
  {
    label: '第13部：トラブルシューティング編',
    chapters: [
      { id: '46-troubleshooting', title: 'よくあるトラブルと解決法', link: '/how-to-use-github/46-troubleshooting/' },
    ],
  },
  {
    label: '付録',
    chapters: [
      { id: 'appendix-glossary', title: '用語集', link: '/how-to-use-github/appendix-glossary/' },
      { id: 'appendix-shortcuts', title: 'ショートカットキー一覧', link: '/how-to-use-github/appendix-shortcuts/' },
      { id: 'appendix-references', title: '参考リンク集', link: '/how-to-use-github/appendix-references/' },
      { id: 'appendix-templates', title: 'サンプルテンプレート集', link: '/how-to-use-github/appendix-templates/' },
    ],
  },
];

interface QuizResult {
  score: number;
  completed: boolean;
  timestamp: string;
}

export default function Progress() {
  const [results, setResults] = useState<Record<string, QuizResult | null>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadResults();
    setIsLoaded(true);
  }, []);

  const loadResults = () => {
    const newResults: Record<string, QuizResult | null> = {};
    parts.forEach(part => {
      part.chapters.forEach(chapter => {
        const saved = localStorage.getItem(STORAGE_KEY_PREFIX + chapter.id);
        if (saved) {
          try {
            newResults[chapter.id] = JSON.parse(saved);
          } catch (e) {
            newResults[chapter.id] = null;
          }
        } else {
          newResults[chapter.id] = null;
        }
      });
    });
    setResults(newResults);
  };

  const handleResetAll = () => {
    if (confirm('すべての進捗をリセットしますか？')) {
      parts.forEach(part => {
        part.chapters.forEach(chapter => {
          localStorage.removeItem(STORAGE_KEY_PREFIX + chapter.id);
        });
      });
      loadResults();
    }
  };

  const totalChapters = parts.reduce((acc, part) => acc + part.chapters.length, 0);
  const completedChapters = Object.values(results).filter(r => r?.completed).length;
  const totalScore = Object.values(results).reduce((acc, r) => acc + (r?.score || 0), 0);
  const maxScore = totalChapters * 3;
  const progressPercent = Math.round((completedChapters / totalChapters) * 100);

  const renderScore = (result: QuizResult | null) => {
    if (!result || !result.completed) {
      return <span className="progress-score not-started">未挑戦</span>;
    }
    const stars = '★'.repeat(result.score) + '☆'.repeat(3 - result.score);
    return (
      <span className={`progress-score score-${result.score}`}>
        {stars} ({result.score}/3)
      </span>
    );
  };

  if (!isLoaded) {
    return <div className="progress-container">読み込み中...</div>;
  }

  return (
    <div className="progress-container">
      <div className="progress-summary">
        <h2>学習進捗</h2>
        <p className="progress-stats">
          完了: {completedChapters}/{totalChapters}章 ({progressPercent}%) |
          合計スコア: {totalScore}/{maxScore}点
        </p>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="progress-parts">
        {parts.map((part, partIndex) => (
          <div key={partIndex} className="progress-part">
            <h3>{part.label}</h3>
            <ul className="progress-chapters">
              {part.chapters.map(chapter => (
                <li key={chapter.id} className="progress-chapter">
                  <a href={chapter.link}>{chapter.title}</a>
                  {renderScore(results[chapter.id])}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="progress-actions">
        <button className="back-button" onClick={() => history.back()}>
          ← 戻る
        </button>
        <button className="reset-all-button" onClick={handleResetAll}>
          すべての進捗をリセット
        </button>
      </div>
    </div>
  );
}
