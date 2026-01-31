import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ScoreModal({
  isOpen,
  onClose,
  contestant,
  segment,
  criteria = [],
  existingScores = {},
  onSave,
  isSubmitting = false,
  judge,
}) {
  const [scores, setScores] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialScores = {};
      criteria.forEach((criterion) => {
        initialScores[criterion.id] = existingScores[criterion.id] ?? '';
      });
      setScores(initialScores);
      setErrors({});
    }
  }, [isOpen, criteria, existingScores]);

  if (!isOpen || !contestant || !segment) return null;

  const validateScores = () => {
    const newErrors = {};
    let hasError = false;

    criteria.forEach((criterion) => {
      const scoreValue = scores[criterion.id];

      if (scoreValue === undefined || scoreValue === null || scoreValue === '') {
        newErrors[criterion.id] = 'Score is required';
        hasError = true;
      } else {
        const scoreNum = parseFloat(scoreValue);
        if (isNaN(scoreNum)) {
          newErrors[criterion.id] = 'Invalid number';
          hasError = true;
        } else if (scoreNum < 0) {
          newErrors[criterion.id] = 'Score cannot be negative';
          hasError = true;
        } else if (scoreNum > criterion.maxscore) {
          newErrors[criterion.id] = `Score cannot exceed ${criterion.maxscore}`;
          hasError = true;
        }
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleScoreChange = (criteriaId, value, maxscore) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setScores((prev) => ({
      ...prev,
      [criteriaId]: value,
    }));

    if (errors[criteriaId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[criteriaId];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateScores()) {
      return;
    }

    const scoreData = {};
    criteria.forEach((criterion) => {
      scoreData[criterion.id] = parseFloat(scores[criterion.id]);
    });

    onSave({
      participantId: contestant.id,
      userId: judge?.id,
      scores: scoreData,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const inputs = form.querySelectorAll('input[type="number"]');
      const currentIndex = Array.from(inputs).indexOf(e.target);
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      }
    }
  };

  const roleLabel = contestant.role === 'MR' ? 'Mr. BatStateU' : 'Ms. BatStateU';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-lg max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Add Scores</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-red-700/90 flex items-center justify-center text-xl font-bold text-white text-shadow-2xs shadow-2xs">
              {contestant.number}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{contestant.fullname}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{segment.event}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-4">Criteria Scores</h4>
              <div className="space-y-4">
                {criteria.map((criterion, index) => {
                  const hasError = !!errors[criterion.id];
                  const currentScore = scores[criterion.id] || '';
                  const percentage =
                    criterion.maxscore > 0
                      ? Math.round((parseFloat(currentScore || 0) / criterion.maxscore) * 100)
                      : 0;

                  return (
                    <div
                      key={criterion.id}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                        hasError ? 'bg-destructive/10' : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 translate-y-2 rounded-full bg-red-700/90 flex items-center justify-center text-xs font-medium text-white">
                            {index + 1}
                          </span>
                          <span className="font-medium text-sm">{criterion.name}</span>
                        </div>
                        <p className="flex-1 text-xs text-muted-foreground ml-8">
                          Max Score: {criterion.maxscore}
                        </p>
                      </div>
                      <div className="w-32">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={criterion.maxscore}
                            step="0.01"
                            value={currentScore}
                            onChange={(e) =>
                              handleScoreChange(criterion.id, e.target.value, criterion.maxscore)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="0"
                            className={`flex h-10 w-full -mt-1 rounded-md border bg-background text-md text-black/60 text-right pr-10 pt-0
                                focus-visible:outline-none
                                [appearance:textfield]
                                [&::-webkit-inner-spin-button]:appearance-none
                                [&::-webkit-outer-spin-button]:appearance-none
                                ${
                                    hasError
                                    ? 'border-destructive focus-visible:ring-destructive/20'
                                    : 'border-input focus-visible:ring-ring/20'
                                }
                                `}
                                                        />
                          <span className="absolute right-3 top-1/3 -translate-y-1/6 text-muted-foreground text-sm">
                            / {criterion.maxscore}
                          </span>
                        </div>
                        {hasError && (
                          <p className="text-destructive text-xs mt-1 text-right">
                            {errors[criterion.id]}
                          </p>
                        )}
                      </div>
                      <div className="w-20 hidden sm:block">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              percentage >= 80
                                ? 'bg-green-500'
                                : percentage >= 60
                                  ? 'bg-yellow-500'
                                  : percentage >= 40
                                    ? 'bg-orange-500'
                                    : 'bg-red-500'
                            }`}
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-semibold">Total Score</span>
                <span className="text-2xl font-bold text-red-700">
                  {Object.values(scores)
                    .reduce((sum, val) => {
                      const num = parseFloat(val);
                      return sum + (isNaN(num) ? 0 : num);
                    }, 0)
                    .toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {criteria.reduce((sum, c) => sum + c.maxscore, 0)}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 font-black shadow-2xs text-black/70 btn-3d-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 font-black shadow-2xs btn-3d-red"
              >
                {isSubmitting ? 'Saving...' : 'Save Scores'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
