import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CriteriaModal({ isOpen, onClose, onSubmit, criteria = null, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    name: "",
    maxscore: 100,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (criteria) {
      setFormData({
        name: criteria.name || "",
        maxscore: criteria.maxscore || 100,
      });
    } else {
      setFormData({
        name: "",
        maxscore: 100,
      });
    }
    setErrors({});
  }, [criteria, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Criteria name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Criteria name must be at least 2 characters";
    } else if (formData.name.trim().length > 255) {
      newErrors.name = "Criteria name must be less than 255 characters";
    }
    if (!formData.maxscore || formData.maxscore <= 0) {
      newErrors.maxscore = "Max score must be a positive number";
    } else if (formData.maxscore > 1000) {
      newErrors.maxscore = "Max score cannot exceed 1000";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        maxscore: parseInt(formData.maxscore, 10),
      });
    }
  };

  const isEditing = !!criteria;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-semibold mb-2">
          {isEditing ? "Edit Criteria" : "Add New Criteria"}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {isEditing
            ? "Update criteria information"
            : "Add a new criteria for this segment"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Criteria Name <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ex. Stage Presence, Beauty, Intelligence..."
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none ${
                errors.name
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "border-input"
              }`}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="maxscore" className="text-sm font-medium">
              Max Score <span className="text-destructive">*</span>
            </label>
            <input
              id="maxscore"
              type="number"
              min="1"
              max="1000"
              value={formData.maxscore}
              onChange={(e) =>
                setFormData({ ...formData, maxscore: e.target.value })
              }
              placeholder="100"
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none ${
                errors.maxscore
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "border-input"
              }`}
            />
            {errors.maxscore && (
              <p className="text-destructive text-xs">{errors.maxscore}</p>
            )}
            {!errors.maxscore && (
              <p className="text-muted-foreground text-xs">
                Maximum score for this criteria (1-1000)
              </p>
            )}
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
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add Criteria"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

