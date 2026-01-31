import { Button } from '@/components/ui/button';

export function JudgeHeader({ judgeName, onLogout }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl text-red-700/90 text-shadow-2xs tracking-tighter font-bold">
          JUDGE PANEL
        </h1>
        <p className="text-muted-foreground tracking-tight text-shadow-2xs text-sm">
          Welcome, {judgeName}
        </p>
      </div>
      <Button variant="outline" className="btn-3d-white" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}

