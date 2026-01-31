import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/shared/StatsCard";
import { SegmentList } from "@/components/fragments/SegmentList";
import { SegmentModal } from "@/components/fragments/SegmentModal";
import { ViewSegmentModal } from "@/components/fragments/ViewSegmentModal";
import { DeleteSegmentModal } from "@/components/fragments/DeleteSegmentModal";
import { segmentService } from "@/services/segment.service";
import { criteriaService } from "@/services/criteriaService";

export function SegmentsPanel() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [selectedSegmentCriteria, setSelectedSegmentCriteria] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCriteria, setPendingCriteria] = useState([]);
  const [editModeCriteria, setEditModeCriteria] = useState([]);
  const [criteriaToDelete, setCriteriaToDelete] = useState([]);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const segments = await segmentService.getAll({ orderByDesc: true });
      setSegments(segments);
    } catch (err) {
      setError("Failed to load segments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const totalCount = segments.length;

  const handleAddClick = () => {
    setSelectedSegment(null);
    setPendingCriteria([]);
    setIsAddModalOpen(true);
  };

  const handleViewClick = async (segment) => {
    setSelectedSegment(segment);
    try {
      const criteria = await criteriaService.getBySegmentId(segment.id);
      setSelectedSegmentCriteria(criteria || []);
    } catch (err) {
      console.error("Failed to load criteria:", err);
      setSelectedSegmentCriteria([]);
    }
    setIsViewModalOpen(true);
  };

  const handleEditClick = async (segment) => {
    setSelectedSegment(segment);
    setPendingCriteria([]);
    setCriteriaToDelete([]);
    
    try {
      const criteria = await criteriaService.getBySegmentId(segment.id);
      setEditModeCriteria(criteria || []);
    } catch (err) {
      console.error("Failed to load criteria:", err);
      setEditModeCriteria([]);
    }
    
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (segment) => {
    setSelectedSegment(segment);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const newSegment = await segmentService.create(data);
      
      if (pendingCriteria.length > 0) {
        for (const criteria of pendingCriteria) {
          await criteriaService.create({
            segmentId: newSegment.id,
            name: criteria.name,
            maxscore: criteria.maxscore,
          });
        }
      }
      
      await fetchSegments();
      setIsAddModalOpen(false);
      setPendingCriteria([]);
    } catch (err) {
      setError(err.message || "Failed to add segment");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCriteria = (criteriaData) => {
    const newCriteria = {
      ...criteriaData,
      _tempId: Date.now() + Math.random(),
    };
    setPendingCriteria((prev) => [...prev, newCriteria]);
  };

  const handleRemovePendingCriteria = (index) => {
    setPendingCriteria((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      await segmentService.update(selectedSegment.id, data);
      
      for (const criteria of criteriaToDelete) {
        if (criteria.id) {
          await criteriaService.delete(criteria.id);
        }
      }
      
      for (const criteria of editModeCriteria) {
        if (criteria._updated) {
          await criteriaService.update(criteria.id, {
            name: criteria.name,
            maxscore: criteria.maxscore,
          });
        }
      }
      
      for (const criteria of pendingCriteria) {
        await criteriaService.create({
          segmentId: selectedSegment.id,
          name: criteria.name,
          maxscore: criteria.maxscore,
        });
      }
      
      await fetchSegments();
      setIsEditModalOpen(false);
      setSelectedSegment(null);
      setEditModeCriteria([]);
      setPendingCriteria([]);
      setCriteriaToDelete([]);
    } catch (err) {
      setError(err.message || "Failed to update segment");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCriteria = (updatedCriteria) => {
    setEditModeCriteria((prev) =>
      prev.map((c) =>
        c.id === updatedCriteria.id ? { ...c, ...updatedCriteria, _updated: true } : c
      )
    );
  };

  const handleDeleteExistingCriteria = (criteria) => {
    if (criteria.id) {
      setCriteriaToDelete((prev) => [...prev, criteria]);
    }
    setEditModeCriteria((prev) => prev.filter((c) => (c.id || c._tempId) !== (criteria.id || criteria._tempId)));
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await segmentService.delete(selectedSegment.id);
      await fetchSegments();
      setIsDeleteModalOpen(false);
      setSelectedSegment(null);
    } catch (err) {
      setError(err.message || "Failed to delete segment");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h4 className="text-red-700/90 text-shadow-2xs tracking-tighter font-bold text-lg mb-1">Segments</h4>
            <p className="text-muted-foreground text-sm">
              Manage segments/categories for the pageant competition
            </p>
          </div>
          <Button onClick={handleAddClick} className="btn-3d-red">
            + Add Segment
          </Button>
        </div>
      </div>

      <div className="flex bg-card text-card-foreground border border-border rounded-lg p-6 gap-6">
        <div className="justify-center w-32 h-26">
          <StatsCard
            number={loading ? "-" : totalCount}
            label="Total Segments"
          />
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                Loading segments...
              </p>
            </div>
          ) : (
            <SegmentList
              segments={segments}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      <SegmentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPendingCriteria([]);
        }}
        onSubmit={handleAddSubmit}
        isSubmitting={isSubmitting}
        onAddCriteria={handleAddCriteria}
        pendingCriteria={pendingCriteria}
        onRemovePendingCriteria={handleRemovePendingCriteria}
      />

      <SegmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSegment(null);
          setEditModeCriteria([]);
          setPendingCriteria([]);
          setCriteriaToDelete([]);
        }}
        onSubmit={handleEditSubmit}
        segment={selectedSegment}
        isSubmitting={isSubmitting}
        segmentCriteria={editModeCriteria}
        onAddCriteria={handleAddCriteria}
        onEditCriteria={handleEditCriteria}
        onDeleteCriteria={handleDeleteExistingCriteria}
        onRemovePendingCriteria={handleRemovePendingCriteria}
      />

      <ViewSegmentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSegment(null);
          setSelectedSegmentCriteria([]);
        }}
        segment={selectedSegment}
        criteria={selectedSegmentCriteria}
      />

      <DeleteSegmentModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSegment(null);
        }}
        onConfirm={handleDeleteConfirm}
        segment={selectedSegment}
        isDeleting={isDeleting}
      />
    </div>
  );
}

