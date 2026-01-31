import { Button } from "@/components/ui/button";

export function ScoringHeader({
  segments = [],
  selectedSegment,
  onSegmentChange,
  onViewSegment,
  segmentCriteria = [],
  isLoading,
}) {
  return (
    <div className="space-y-4">  {segments.length > 0 ? (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-50">
              <label className="text-sm font-medium mb-2 block">
                Select Segment
              </label>
              <select
                value={selectedSegment?.id || ""}
                onChange={(e) => onSegmentChange(e.target.value)}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none"
              >
                <option value="">-- Select a segment --</option>
                {segments.map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.event}
                  </option>
                ))}
              </select>
            </div>
            {selectedSegment && (
              <div className="flex items-center -translate-y-2 gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewSegment(selectedSegment)}
                  className="btn-3d-white"
                >
                  View Segment
                </Button>
              </div>
            )}
          </div>

          {selectedSegment && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Segment:
                </span>
                <span className="font-medium">{selectedSegment.event}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  Criteria:
                </span>
                <span className="font-medium">
                  {segmentCriteria.length} criteria loaded
                </span>
              </div>
              {segmentCriteria.length === 0 && (
                <p className="text-sm text-destructive mt-2">
                  No criteria found for this segment. Please contact the
                  administrator to add criteria.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-center">
            No segments available. Please contact the administrator to
            create segments.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
          <span className="ml-3 text-muted-foreground">
            Loading scores...
          </span>
        </div>
      )}
    </div>
  );
}

