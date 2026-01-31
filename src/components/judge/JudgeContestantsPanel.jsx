import { useState, useEffect } from "react";
import { StatsCard } from "@/components/shared/StatsCard";
import { ContestantList } from "@/components/fragments/ContestantList";
import { ViewContestantModal } from "@/components/fragments/ViewContestantModal";
import { participantService } from "@/services/participant.service";

export function JudgeContestantsPanel() {
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, mrCount: 0, msCount: 0 });
  const [viewContestant, setViewContestant] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [contestantsData, statsData] = await Promise.all([
          participantService.getAll(),
          participantService.getStats(),
        ]);
        setContestants(contestantsData || []);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load contestants:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const mrContestants = contestants.filter((c) => c.role === "MR");
  const msContestants = contestants.filter((c) => c.role === "MS");

  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-red-700/90 text-shadow-2xs tracking-tighter font-bold text-lg mb-1">
              Contestants
            </h4>
            <p className="text-muted-foreground text-sm">
              View registered contestants for the pageant competition
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          number={loading ? "-" : stats.total}
          label="Total Contestants"
        />
        <StatsCard
          number={loading ? "-" : stats.mrCount}
          label="Mr. Candidates"
        />
        <StatsCard
          number={loading ? "-" : stats.msCount}
          label="Ms. Candidates"
        />
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground text-sm">Loading contestants...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <ContestantList
            title="Mr. BatStateU"
            contestants={mrContestants}
            onView={setViewContestant}
            onEdit={() => {}}
            onDelete={() => {}}
            showActions={false}
          />
          <ContestantList
            title="Ms. BatStateU"
            contestants={msContestants}
            onView={setViewContestant}
            onEdit={() => {}}
            onDelete={() => {}}
            showActions={false}
          />
        </div>
      )}

      <ViewContestantModal
        isOpen={!!viewContestant}
        onClose={() => setViewContestant(null)}
        contestant={viewContestant}
      />
    </div>
  );
}

