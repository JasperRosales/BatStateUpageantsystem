import { Button } from "@/components/ui/button";

export function ScoringContestants({
  title,
  contestants = [],
  role,
  criteria = [],
  scoresByParticipant = {},
  onAddScore,
  showAddButton = true,
}) {
  const getScoreForParticipant = (participantId) => {
    const participantScores = scoresByParticipant[participantId] || {};
    return Object.values(participantScores).reduce((sum, val) => sum + (val || 0), 0);
  };

  const getMaxPossibleScore = () => {
    return criteria.reduce((sum, c) => sum + c.maxscore, 0);
  };

 

  return (
    <div className="border border-border shadow-2xs rounded-lg overflow-hidden">
      <div className={'bg-red-700 shadow-2xs px-4 py-3 border-b border-border'}>
        <h5 className="text-white text-shadow-2xs font-bold">{title}</h5>
      </div>
      <div className="divide-y divide-border">
        {contestants.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No {role === "MR" ? "Mr." : "Ms."} candidates registered yet
          </div>
        ) : (
          contestants.map((contestant) => {
            const totalScore = getScoreForParticipant(contestant.id);
            const maxScore = getMaxPossibleScore();
            const hasScores = Object.keys(scoresByParticipant[contestant.id] || {}).length > 0;

            return (
              <div
                key={contestant.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className={'w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-sm font-medium text-white text-shadow-2xs shadow-2xs'}>
                  {contestant.number}
                </div>
                <div className="flex-1 font-medium min-w-0">
                  <span className="truncate block">{contestant.fullname}</span>
              
                </div>
                {hasScores && criteria.length > 0 && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-700">
                      {totalScore.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      / {maxScore}
                    </div>
                  </div>
                )}
                {showAddButton && (
                  <Button
                    size="sm"
                    onClick={() => onAddScore(contestant)}
                    className="font-black btn-3d-red"
                  >
                    {hasScores ? "Update" : "Add"} Score
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

