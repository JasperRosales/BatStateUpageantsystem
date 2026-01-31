import { useState } from "react";
import { JudgeHeader } from "@/components/judge/JudgeHeader";
import { JudgeTabs } from "@/components/judge/JudgeTabs";
import { JudgeContestantsPanel } from "@/components/judge/JudgeContestantsPanel";
import { JudgeScoringPanel } from "@/components/judge/JudgeScoringPanel";
import { JudgeSubmissionsPanel } from "@/components/judge/JudgeSubmissionsPanel";

export function JudgeDashboardPage({ judge, onLogout }) {
  const [activeTab, setActiveTab] = useState("contestants");

  const renderTabContent = () => {
    switch (activeTab) {
      case "contestants":
        return <JudgeContestantsPanel />;
      case "scoring":
        return <JudgeScoringPanel judge={judge} />;
      case "submissions":
        return <JudgeSubmissionsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <JudgeHeader judgeName={judge?.username || "Judge"} onLogout={onLogout} />
        <JudgeTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}

