import {
  createCriteria,
  getAllCriteria,
  getCriteriaById,
  getCriteriaBySegmentId,
  deleteCriteriaBySegmentId,
  updateCriteria,
  deleteCriteria,
} from "@/repository/criteriaRepository";

const validateCriteriaName = (name) => {
  if (name !== undefined && name !== null) {
    if (typeof name !== "string" || name.trim().length < 2) {
      throw new Error("Criteria name must be at least 2 characters");
    }
    if (name.trim().length > 255) {
      throw new Error("Criteria name must be less than 255 characters");
    }
  }
};

const validateMaxScore = (maxscore) => {
  if (maxscore !== undefined && maxscore !== null) {
    if (typeof maxscore !== "number" || maxscore <= 0) {
      throw new Error("Max score must be a positive number");
    }
    if (maxscore > 1000) {
      throw new Error("Max score cannot exceed 1000");
    }
  }
};

export class CriteriaError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "CriteriaError";
    this.code = code;
  }
}

export const criteriaService = {
  async create(data) {
    try {
      if (!data.segmentId) {
        throw new CriteriaError("Segment ID is required", "INVALID_SEGMENT_ID");
      }

      if (!data.name || !data.name.trim()) {
        throw new CriteriaError("Criteria name is required", "INVALID_NAME");
      }
      validateCriteriaName(data.name);

      if (data.maxscore !== undefined) {
        validateMaxScore(data.maxscore);
      }

      const trimmedName = data.name.trim();
      const maxScoreValue = data.maxscore || 100;

      const criterion = await createCriteria({
        segmentId: data.segmentId,
        name: trimmedName,
        maxscore: maxScoreValue,
      });
      return criterion;
    } catch (error) {
      if (error instanceof CriteriaError) {
        throw error;
      }
      throw new CriteriaError(
        `Failed to create criteria: ${error.message}`,
        "CREATE_FAILED"
      );
    }
  },

  async getAll(options = {}) {
    try {
      const criteriaList = await getAllCriteria(options);
      return criteriaList || [];
    } catch (error) {
      throw new CriteriaError(
        `Failed to fetch criteria: ${error.message}`,
        "FETCH_FAILED"
      );
    }
  },

  async getById(id) {
    try {
      if (!id) {
        throw new CriteriaError("Criteria ID is required", "INVALID_ID");
      }

      const criterion = await getCriteriaById(id);
      if (!criterion) {
        throw new CriteriaError(`Criteria with ID ${id} not found`, "NOT_FOUND");
      }
      return criterion;
    } catch (error) {
      if (error instanceof CriteriaError) {
        throw error;
      }
      throw new CriteriaError(
        `Failed to fetch criteria: ${error.message}`,
        "FETCH_FAILED"
      );
    }
  },

  async getBySegmentId(segmentId) {
    try {
      if (!segmentId) {
        throw new CriteriaError("Segment ID is required", "INVALID_SEGMENT_ID");
      }

      const criteriaList = await getCriteriaBySegmentId(segmentId);
      return criteriaList || [];
    } catch (error) {
      if (error instanceof CriteriaError) {
        throw error;
      }
      throw new CriteriaError(
        `Failed to fetch criteria by segment: ${error.message}`,
        "FETCH_FAILED"
      );
    }
  },

  async update(id, data) {
    try {
      if (!id) {
        throw new CriteriaError("Criteria ID is required", "INVALID_ID");
      }

      if (data.name !== undefined) {
        validateCriteriaName(data.name);
      }

      if (data.maxscore !== undefined) {
        validateMaxScore(data.maxscore);
      }

      const updated = await updateCriteria(id, {
        ...data,
        name: data.name ? data.name.trim() : undefined,
      });
      if (!updated) {
        throw new CriteriaError(`Criteria with ID ${id} not found`, "NOT_FOUND");
      }
      return updated;
    } catch (error) {
      if (error instanceof CriteriaError) {
        throw error;
      }
      throw new CriteriaError(
        `Failed to update criteria: ${error.message}`,
        "UPDATE_FAILED"
      );
    }
  },

  async delete(id) {
    try {
      if (!id) {
        throw new CriteriaError("Criteria ID is required", "INVALID_ID");
      }

      const deleted = await deleteCriteria(id);
      if (!deleted) {
        throw new CriteriaError(`Criteria with ID ${id} not found`, "NOT_FOUND");
      }
      return deleted;
    } catch (error) {
      if (error instanceof CriteriaError) {
        throw error;
      }
      throw new CriteriaError(
        `Failed to delete criteria: ${error.message}`,
        "DELETE_FAILED"
      );
    }
  },

  async deleteBySegmentId(segmentId) {
    try {
      if (!segmentId) {
        throw new CriteriaError("Segment ID is required", "INVALID_SEGMENT_ID");
      }

      const count = await deleteCriteriaBySegmentId(segmentId);
      return count;
    } catch (error) {
      if (error instanceof CriteriaError) {
        throw error;
      }
      throw new CriteriaError(
        `Failed to delete criteria by segment: ${error.message}`,
        "DELETE_FAILED"
      );
    }
  },
};

export { validateCriteriaName, validateMaxScore };

