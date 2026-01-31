import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CriteriaModal } from "./CriteriaModal";
import { Plus, X, Pencil, Trash2 } from "lucide-react";

export function SegmentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  segment = null, 
  isSubmitting = false, 
  onAddCriteria, 
  pendingCriteria = [], 
  onRemovePendingCriteria,
  segmentCriteria = [],
  onEditCriteria,
  onDeleteCriteria
}) {
  const [formData, setFormData] = useState({
    event: "",
  });
  const [errors, setErrors] = useState({});
  const [isAddingCriteria, setIsAddingCriteria] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);

  useEffect(() => {
    if (segment) {
      setFormData({
        event: segment.event || "",
      });
    } else {
      setFormData({
        event: "",
      });
    }
    setErrors({});
  }, [segment, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.event.trim()) {
      newErrors.event = "Event name is required";
    } else if (formData.event.trim().length < 2) {
      newErrors.event = "Event name must be at least 2 characters";
    } else if (formData.event.trim().length > 255) {
      newErrors.event = "Event name must be less than 255 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        event: formData.event.trim(),
      });
    }
  };

  const handleAddCriteriaClick = () => {
    setEditingCriteria(null);
    setIsAddingCriteria(true);
  };

  const handleEditCriteriaClick = (criteria) => {
    setEditingCriteria(criteria);
    setIsAddingCriteria(true);
  };

  const handleCriteriaSubmit = (criteriaData) => {
    if (editingCriteria) {
      if (onEditCriteria) {
        onEditCriteria({ ...editingCriteria, ...criteriaData });
      }
    } else {
      if (onAddCriteria) {
        onAddCriteria(criteriaData);
      }
    }
    setIsAddingCriteria(false);
    setEditingCriteria(null);
  };

  const handleRemoveCriteria = (index) => {
    if (onRemovePendingCriteria) {
      onRemovePendingCriteria(index);
    }
  };

  const handleDeleteExistingCriteria = (criteria) => {
    if (onDeleteCriteria) {
      onDeleteCriteria(criteria);
    }
  };

  const isEditing = !!segment;
  const showCriteriaSection = isEditing ? true : (onAddCriteria && !isEditing);

  const allCriteria = isEditing 
    ? [...segmentCriteria, ...pendingCriteria]
    : pendingCriteria;

  const pendingCriteriaIds = new Set(pendingCriteria.map(c => c._tempId || c.id));

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-xl shadow-lg max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-2">
            {isEditing ? "Edit Segment" : "Add New Segment"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {isEditing
              ? "Update segment/event information and manage criteria"
              : "Create a new segment/event for the pageant competition"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="event" className="text-sm font-medium">
                Event Name <span className="text-destructive">*</span>
              </label>
              <input
                id="event"
                type="text"
                value={formData.event}
                onChange={(e) =>
                  setFormData({ ...formData, event: e.target.value })
                }
                placeholder="ex. Formal Wear, Uniform, Swimwear..."
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none ${
                  errors.event
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : "border-input"
                }`}
              />
              {errors.event && (
                <p className="text-destructive text-xs">{errors.event}</p>
              )}
              {!errors.event && (
                <p className="text-muted-foreground text-xs">
                  Name of the segment or category
                </p>
              )}
            </div>

            {showCriteriaSection && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">
                    Criteria ({allCriteria.length})
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCriteriaClick}
                    className="btn-3d-white"
                  >
                    <Plus className="size-4 mr-1" />
                    Add Criteria
                  </Button>
                </div>

                {allCriteria.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allCriteria.map((criteria, index) => {
                      const isPending = !criteria.id || pendingCriteriaIds.has(criteria.id) || criteria._tempId;
                      const displayIndex = isEditing 
                        ? index 
                        : index;
                      
                      return (
                        <div
                          key={criteria.id || criteria._tempId || index}
                          className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-medium truncate">{criteria.name}</span>
                            <span className="text-xs text-muted-foreground">
                              (Max: {criteria.maxscore})
                            </span>
                           
                            {isPending && !isEditing && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {isEditing && !isPending && (
                              <button
                                type="button"
                                onClick={() => handleEditCriteriaClick(criteria)}
                                className="text-muted-foreground hover:text-primary p-1 rounded"
                                title="Edit criteria"
                              >
                                <Pencil className="size-4" />
                              </button>
                            )}
                            {isPending && !isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCriteria(displayIndex)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded"
                                title="Remove criteria"
                              >
                                <X className="size-4" />
                              </button>
                            )}
                            {isEditing && !isPending && (
                              <button
                                type="button"
                                onClick={() => handleDeleteExistingCriteria(criteria)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded"
                                title="Delete criteria"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                            {isEditing && isPending && (
                              <button
                                type="button"
                                onClick={() => handleRemovePendingCriteria(displayIndex - segmentCriteria.length)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded"
                                title="Remove criteria"
                              >
                                <X className="size-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                    No criteria added yet. Click "Add Criteria" to add some.
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
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
                {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add Segment"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {isAddingCriteria && (
        <CriteriaModal
          isOpen={isAddingCriteria}
          onClose={() => {
            setIsAddingCriteria(false);
            setEditingCriteria(null);
          }}
          onSubmit={handleCriteriaSubmit}
          criteria={editingCriteria}
          isSubmitting={false}
        />
      )}
    </>
  );
}

