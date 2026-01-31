export function JudgeSubmissionsPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-red-700/90 text-shadow-2xs tracking-tighter font-bold text-lg mb-1">
              My Submissions
            </h4>
            <p className="text-muted-foreground text-sm">
              View your score submissions history
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">My Submissions</h3>
        <p className="text-muted-foreground">
          Your score submissions will be displayed here
        </p>
      </div>
    </div>
  );
}

