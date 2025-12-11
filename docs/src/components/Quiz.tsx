import { useState, useEffect } from 'react';
import AffiliateBanner from './AffiliateBanner';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

interface QuizProps {
  pageId: string;
  questions: QuizQuestion[];
}

interface QuizResult {
  score: number;
  completed: boolean;
  answers: number[];
  timestamp: string;
}

const STORAGE_KEY_PREFIX = 'github-guide-quiz-';

export default function Quiz({ pageId, questions }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // localStorage から結果を読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + pageId);
    if (saved) {
      try {
        const result: QuizResult = JSON.parse(saved);
        if (result.completed && result.answers) {
          setSelectedAnswers(result.answers);
          setShowResults(true);
          setIsCompleted(true);
        }
      } catch (e) {
        console.error('Failed to load quiz result:', e);
      }
    }
  }, [pageId]);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (isCompleted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (selectedAnswers.some(a => a === null)) {
      alert('すべての問題に回答してください');
      return;
    }

    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].answer ? 1 : 0);
    }, 0);

    const result: QuizResult = {
      score,
      completed: true,
      answers: selectedAnswers as number[],
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY_PREFIX + pageId, JSON.stringify(result));
    setShowResults(true);
    setIsCompleted(true);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + pageId);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setIsCompleted(false);
  };

  const score = selectedAnswers.reduce((acc, answer, index) => {
    return acc + (answer === questions[index].answer ? 1 : 0);
  }, 0);

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">理解度チェック</h2>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="quiz-question">
          <p className="quiz-question-text">
            Q{qIndex + 1}. {q.question}
          </p>
          <div className="quiz-options">
            {q.options.map((option, oIndex) => {
              const isSelected = selectedAnswers[qIndex] === oIndex;
              const isCorrect = q.answer === oIndex;
              const showCorrectness = showResults && isSelected;

              let optionClass = 'quiz-option';
              if (isSelected) optionClass += ' selected';
              if (showResults) {
                if (isSelected && isCorrect) optionClass += ' correct';
                if (isSelected && !isCorrect) optionClass += ' incorrect';
                if (!isSelected && isCorrect) optionClass += ' show-correct';
              }

              return (
                <button
                  key={oIndex}
                  className={optionClass}
                  onClick={() => handleSelect(qIndex, oIndex)}
                  disabled={isCompleted}
                >
                  <span className="option-label">{optionLabels[oIndex]})</span>
                  <span className="option-text">{option}</span>
                  {showCorrectness && isCorrect && <span className="result-icon">✓</span>}
                  {showCorrectness && !isCorrect && <span className="result-icon">✗</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="quiz-footer">
        {showResults ? (
          <div className="quiz-result">
            <p className="score">
              結果: {score}/{questions.length} 問正解
              {score === questions.length && ' 🎉'}
            </p>
            <div className="quiz-actions">
              <button className="quiz-button reset" onClick={handleReset}>
                もう一度挑戦する
              </button>
              <a href="/how-to-use-github/progress/" className="quiz-button progress-link">
                理解度一覧を見る
              </a>
            </div>
            <AffiliateBanner />
          </div>
        ) : (
          <button
            className="quiz-button submit"
            onClick={handleSubmit}
            disabled={selectedAnswers.some(a => a === null)}
          >
            回答を確認する
          </button>
        )}
      </div>
    </div>
  );
}
