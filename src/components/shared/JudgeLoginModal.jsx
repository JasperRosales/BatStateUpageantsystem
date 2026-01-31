import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";

export function JudgeLoginModal({ onClose, onSuccess }) {
  const navigate = useNavigate();
  const [judges, setJudges] = useState([]);
  const [selectedJudgeId, setSelectedJudgeId] = useState("");
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJudges, setIsLoadingJudges] = useState(true);

  useEffect(() => {
    async function loadJudges() {
      try {
        const judgesList = await userService.getJudges();
        setJudges(judgesList || []);
      } catch (error) {
        console.error("Failed to load judges:", error);
        setError("Failed to load judges. Please try again.");
      } finally {
        setIsLoadingJudges(false);
      }
    }
    loadJudges();
  }, []);

  function handleJudgeChange(e) {
    const judgeId = e.target.value;
    setSelectedJudgeId(judgeId);
    const judge = judges.find((j) => j.id === parseInt(judgeId));
    setSelectedJudge(judge);
    setPassword("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!selectedJudgeId || !password) {
      setError("Please select a judge and enter password");
      return;
    }

    setIsLoading(true);

    try {
      if (selectedJudge.password !== password) {
        setError("Invalid password");
        return;
      }

      const { password: _, ...userWithoutPassword } = selectedJudge;
      onSuccess(userWithoutPassword);
      navigate("/judge");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-lg max-w-md w-full p-6   animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-semibold mb-2">Judge Login</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Select your name and enter your password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="judge" className="text-sm font-medium">
              Select Judge
            </label>
            {isLoadingJudges ? (
              <div className="flex h-10 w-full rounded-md border border-input focus:outline-0 bg-background px-3 py-2 text-sm text-muted-foreground">
                Loading judges...
              </div>
            ) : (
              <select
                id="judge"
                value={selectedJudgeId}
                onChange={handleJudgeChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Select Judge --</option>
                {judges.map((judge) => (
                  <option key={judge.id} value={judge.id}>
                    {judge.username}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={!selectedJudgeId}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 font-black shadow-2xs text-black/70 btn-3d-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedJudgeId || !password}
              className="flex-1 font-black shadow-2xs btn-3d-red"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

