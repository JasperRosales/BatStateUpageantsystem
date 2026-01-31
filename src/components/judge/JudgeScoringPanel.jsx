import { useState, useEffect } from "react";
import { ScoringHeader } from "@/components/fragments/ScoringHeader";
import { ScoringContestants } from "@/components/fragments/ScoringContestants";
import { ViewSegmentModal } from "@/components/fragments/ViewSegmentModal";
import { ScoreModal } from "@/components/fragments/ScoreModal";
import { segmentService } from "@/services/segment.service";
import { criteriaService } from "@/services/criteriaService";
import { getScoresByUserAndSegment, upsertScore } from "@/repository/scoreRepository";
import { participantService } from "@/services/participant.service";

export function JudgeScoringPanel({ judge }) {
  const [contestants, setContestants] = useState([]);
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [segmentCriteria, setSegmentCriteria] = useState([]);
  const [segmentScores, setSegmentScores] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewSegment, setViewSegment] = useState(null);
  const [scoreContestant, setScoreContestant] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [segmentsData, contestantsData] = await Promise.all([
          segmentService.getAll(),
          participantService.getAll(),
        ]);
        setSegments(segmentsData || []);
        setContestants(contestantsData || []);
        if (segmentsData && segmentsData.length > 0) {
          setSelectedSegment(segmentsData[0]);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadSegmentData() {
      if (!selectedSegment) {
        setSegmentCriteria([]);
        setSegmentScores({});
        return;
      }

      setIsLoading(true);
      try {
        const criteriaData = await criteriaService.getBySegmentId(selectedSegment.id);
        setSegmentCriteria(criteriaData || []);

        if (judge?.id) {
          const scoresData = await getScoresByUserAndSegment(
            judge.id,
            selectedSegment.id
          );
          const scoresByParticipant = {};
          scoresData.forEach((item) => {
            if (!scoresByParticipant[item.participantId]) {
              scoresByParticipant[item.participantId] = {};
            }
            scoresByParticipant[item.participantId][item.criteriaId] = item.score;
          });
          setSegmentScores(scoresByParticipant);
        }
      } catch (error) {
        console.error("Failed to load segment data:", error);
        setSegmentCriteria([]);
        setSegmentScores({});
      } finally {
        setIsLoading(false);
      }
    }
    loadSegmentData();
  }, [selectedSegment, judge?.id]);

  const handleSegmentChange = (segmentId) => {
    const segment = segments.find((s) => s.id === parseInt(segmentId, 10));
    setSelectedSegment(segment || null);
  };

  const handleScoreSave = async (scoreData) => {
    setIsSaving(true);
    try {
      for (const [criteriaId, score] of Object.entries(scoreData.scores)) {
        await upsertScore(
          scoreData.participantId,
          parseInt(criteriaId, 10),
          score
        );
      }
      setSegmentScores((prev) => ({
        ...prev,
        [scoreData.participantId]: scoreData.scores,
      }));
      setScoreContestant(null);
    } catch (error) {
      console.error("Failed to save scores:", error);
      alert(error.message || "Failed to save scores");
    } finally {
      setIsSaving(false);
    }
  };

  const mrContestants = contestants.filter((c) => c.role === "MR");
  const msContestants = contestants.filter((c) => c.role === "MS");

  return (
    <div className="space-y-6">
      <ScoringHeader
        segments={segments}
        selectedSegment={selectedSegment}
        onSegmentChange={handleSegmentChange}
        onViewSegment={setViewSegment}
        segmentCriteria={segmentCriteria}
        isLoading={isLoading}
      />

      {selectedSegment && segmentCriteria.length > 0 && !isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          <ScoringContestants
            title="Mr. BatStateU"
            contestants={mrContestants}
            role="MR"
            criteria={segmentCriteria}
            scoresByParticipant={segmentScores}
            onAddScore={setScoreContestant}
            showAddButton={true}
          />
          <ScoringContestants
            title="Ms. BatStateU"
            contestants={msContestants}
            role="MS"
            criteria={segmentCriteria}
            scoresByParticipant={segmentScores}
            onAddScore={setScoreContestant}
            showAddButton={true}
          />
        </div>
      )}

      {!selectedSegment && segments.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Please select a segment above to start scoring.
          </p>
        </div>
      )}

      {segments.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            No segments available. Please contact the administrator.
          </p>
        </div>
      )}

      <ViewSegmentModal
        isOpen={!!viewSegment}
        onClose={() => setViewSegment(null)}
        segment={viewSegment}
        criteria={viewSegment ? segmentCriteria : []}
      />

      <ScoreModal
        isOpen={!!scoreContestant}
        onClose={() => setScoreContestant(null)}
        contestant={scoreContestant}
        segment={selectedSegment}
        criteria={segmentCriteria}
        existingScores={
          scoreContestant ? segmentScores[scoreContestant.id] || {} : {}
        }
        onSave={handleScoreSave}
        isSubmitting={isSaving}
        judge={judge}
      />
    </div>
  );
}

