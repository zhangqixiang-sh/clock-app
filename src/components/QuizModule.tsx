import { useState, useRef, useCallback } from 'react';
import { Clock } from './Clock';
import type { ClockRef } from './Clock';
import type { QuizMode, Difficulty, QuizState, Question } from '../types';
import { formatTimeDigital, formatTimeWords } from '../utils';
import { useFeedback, FeedbackOverlay } from './Feedback';

interface QuizModuleProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  soundManager: {
    click: () => void;
    correct: () => void;
    wrong: () => void;
    fanfare: () => void;
  };
  lang: 'zh' | 'en';
}

const TOTAL_QUESTIONS = 10;

export const QuizModule: React.FC<QuizModuleProps> = ({ t, soundManager, lang }) => {
  const [mode, setMode] = useState<QuizMode>('A');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const clockRef = useRef<ClockRef>(null);
  const { feedback, showFeedback } = useFeedback();

  // Generate random time based on difficulty
  const generateTime = useCallback((): Question => {
    const h = Math.floor(Math.random() * 12) + 1;
    let m = 0;
    switch (difficulty) {
      case 'medium':
        m = Math.random() < 0.5 ? 0 : 30;
        break;
      case 'hard':
        m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        break;
      case 'expert':
        m = Math.floor(Math.random() * 12) * 5;
        break;
      case 'minute':
        m = Math.floor(Math.random() * 60);
        break;
    }
    return { h, m };
  }, [difficulty]);

  // Generate distractor options
  const generateDistractors = useCallback((correct: Question) => {
    const distractors = new Set<string>();
    const cKey = `${correct.h}:${String(correct.m).padStart(2, '0')}`;
    distractors.add(cKey);

    // Similar hour
    const alt1h = correct.h === 12 ? 1 : correct.h + 1;
    distractors.add(`${alt1h}:${String(correct.m).padStart(2, '0')}`);

    // Similar minute
    let alt2m: number;
    if (correct.m === 0) alt2m = 30;
    else if (correct.m === 30) alt2m = 0;
    else if (correct.m === 15) alt2m = 45;
    else if (correct.m === 45) alt2m = 15;
    else alt2m = (correct.m + 30) % 60;
    distractors.add(`${correct.h}:${String(alt2m).padStart(2, '0')}`);

    // Random
    while (distractors.size < 4) {
      const rh = Math.floor(Math.random() * 12) + 1;
      let rm: number;
      switch (difficulty) {
        case 'medium':
          rm = Math.random() < 0.5 ? 0 : 30;
          break;
        case 'hard':
          rm = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
          break;
        case 'expert':
          rm = Math.floor(Math.random() * 12) * 5;
          break;
        case 'minute':
          rm = Math.floor(Math.random() * 60);
          break;
      }
      distractors.add(`${rh}:${String(rm).padStart(2, '0')}`);
    }

    const arr = Array.from(distractors).map(s => {
      const [hh, mm] = s.split(':').map(Number);
      return { h: hh, m: mm, key: s };
    });

    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [difficulty]);

  const startQuiz = () => {
    soundManager.click();
    const newQuestions: Question[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      newQuestions.push(generateTime());
    }
    setQuestions(newQuestions);
    setCurrentQ(0);
    setScore(0);
    setQuizState('playing');
    setAnswered(false);
    setSelectedAnswer(null);
  };

  const handleModeAAnswer = (opt: { h: number; m: number; key: string }) => {
    if (answered) return;
    soundManager.click();
    setAnswered(true);
    setSelectedAnswer(opt.key);

    const q = questions[currentQ];
    const isCorrect = opt.h === q.h && opt.m === q.m;

    if (isCorrect) {
      setScore(s => s + 1);
      soundManager.correct();
      showFeedback('🎉', 800);
    } else {
      soundManager.wrong();
      showFeedback('🤔', 800);
    }

    setTimeout(() => nextQuestion(), 1500);
  };

  const handleModeBSubmit = () => {
    if (answered || !clockRef.current) return;
    soundManager.click();
    setAnswered(true);

    const time = clockRef.current.getTime();
    const totalMin = Math.round(time.hours * 60 + time.minutes);
    const normH = Math.floor(totalMin / 60);
    const normM = totalMin - normH * 60;
    const userH = ((normH % 12) + 12) % 12 || 12;

    const q = questions[currentQ];
    const targetH = q.h % 12 || 12;
    const isCorrect = userH === targetH && Math.abs(normM - q.m) <= 2;

    if (isCorrect) {
      setScore(s => s + 1);
      soundManager.correct();
      showFeedback('🎉', 800);
    } else {
      soundManager.wrong();
      showFeedback('🤔', 800);
      clockRef.current.setTime(q.h, q.m, 0);
    }

    setTimeout(() => nextQuestion(), 1800);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= TOTAL_QUESTIONS) {
      soundManager.fanfare();
      setQuizState('summary');
    } else {
      setCurrentQ(q => q + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const renderSetup = () => (
    <div className="quiz-setup">
      <div className="quiz-setup-icon">🎯</div>
      <h2>{t('quiz.title')}</h2>

      <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
        {t('quiz.selectMode')}
      </div>

      <div className="quiz-mode-tabs">
        {(['A', 'B'] as QuizMode[]).map(m => (
          <button
            key={m}
            className={`quiz-mode-tab ${mode === m ? 'active' : ''}`}
            onClick={() => {
              soundManager.click();
              setMode(m);
            }}
          >
            {t(m === 'A' ? 'quiz.modeA' : 'quiz.modeB')}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>
        {t('quiz.difficulty')}
      </div>

      <div className="difficulty-selector">
        {(['medium', 'hard', 'expert', 'minute'] as Difficulty[]).map(d => (
          <button
            key={d}
            className={`diff-btn ${difficulty === d ? 'active' : ''}`}
            onClick={() => {
              soundManager.click();
              setDifficulty(d);
            }}
          >
            {t(`quiz.diff.${d}`)}
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: '12px', fontSize: '20px', padding: '16px 48px' }}
        onClick={startQuiz}
      >
        {t('quiz.start')}
      </button>
    </div>
  );

  const renderModeA = () => {
    const q = questions[currentQ];
    const options = generateDistractors(q);

    return (
      <div className="quiz-body">
        <div id="quiz-clock-wrap">
          <Clock
            ref={clockRef}
            interactive={false}
            showSecond={false}
            hours={q.h}
            minutes={q.m}
          />
        </div>
        <div className="quiz-right-panel">
          <div className="quiz-question">{t('quiz.question.a')}</div>
          <div className="quiz-options">
            {options.map(opt => (
              <button
                key={opt.key}
                className={`quiz-option ${answered
                  ? opt.h === q.h && opt.m === q.m
                    ? 'correct'
                    : selectedAnswer === opt.key
                      ? 'wrong'
                      : ''
                  : ''
                  } ${answered ? 'disabled' : ''}`}
                onClick={() => handleModeAAnswer(opt)}
                disabled={answered}
              >
                {formatTimeDigital(opt.h, opt.m)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderModeB = () => {
    const q = questions[currentQ];

    return (
      <div className="quiz-body">
        <div id="quiz-clock-wrap">
          <Clock
            ref={clockRef}
            interactive={true}
            showSecond={false}
            hours={12}
            minutes={0}
            snapTo5={true}
          />
        </div>
        <div className="quiz-right-panel">
          <div className="quiz-question">{t('quiz.question.b')}</div>
          <div className="quiz-target-time">{formatTimeDigital(q.h, q.m)}</div>
          <div className="quiz-target-words">{formatTimeWords(q.h, q.m, lang)}</div>
          <button
            className="btn btn-success"
            style={{ fontSize: '18px', marginTop: '8px' }}
            onClick={handleModeBSubmit}
            disabled={answered}
          >
            {answered ? (selectedAnswer === 'correct' ? t('quiz.correct') : t('quiz.answer') + formatTimeDigital(q.h, q.m)) : t('quiz.submit')}
          </button>
        </div>
      </div>
    );
  };

  const renderQuestion = () => (
    <>
      <div className="quiz-header">
        <div className="quiz-score">
          {'⭐'.repeat(score)}{'☆'.repeat(TOTAL_QUESTIONS - score)}
        </div>
        <div className="quiz-progress">{currentQ + 1} / {TOTAL_QUESTIONS}</div>
      </div>
      {mode === 'A' ? renderModeA() : renderModeB()}
    </>
  );

  const renderSummary = () => {
    let msgKey: string;
    if (score >= 10) msgKey = 'summary.perfect';
    else if (score >= 7) msgKey = 'summary.great';
    else if (score >= 4) msgKey = 'summary.ok';
    else msgKey = 'summary.try';

    return (
      <div className="quiz-summary">
        <div className="summary-stars">
          {'⭐'.repeat(score)}{'☆'.repeat(TOTAL_QUESTIONS - score)}
        </div>
        <div className="summary-msg">{t(msgKey)}</div>
        <div className="summary-score">{t('summary.score', { n: score })}</div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={() => {
            soundManager.click();
            setQuizState('setup');
          }}>
            {t('quiz.back')}
          </button>
          <button className="btn btn-primary" onClick={startQuiz}>
            {t('quiz.again')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="module active" id="module-quiz">
      <div id="quizContent">
        {quizState === 'setup' && renderSetup()}
        {quizState === 'playing' && renderQuestion()}
        {quizState === 'summary' && renderSummary()}
      </div>
      <FeedbackOverlay feedback={feedback} />
    </section>
  );
};
