export const EDGE_TYPES = {
  NEXT_TASK: "next-task",
  OPTIONAL_NEXT: "optional-next",
  BLOCKED: "blocked",
} as const;

export type EdgeType = (typeof EDGE_TYPES)[keyof typeof EDGE_TYPES];

export const EDGE_STYLES = {
  [EDGE_TYPES.NEXT_TASK]: {
    stroke: "#64748b",
    strokeWidth: 2,
  },
  [EDGE_TYPES.OPTIONAL_NEXT]: {
    stroke: "#64748b",
    strokeWidth: 2,
    strokeDasharray: "5,5",
  },
  [EDGE_TYPES.BLOCKED]: {
    stroke: "#ef4444",
    strokeWidth: 2,
    strokeDasharray: "3,3",
  },
} as const;

export const EDGE_MARKERS = {
  [EDGE_TYPES.NEXT_TASK]: {
    type: "arrowclosed",
    color: "#64748b",
  },
  [EDGE_TYPES.OPTIONAL_NEXT]: {
    type: "arrowclosed",
    color: "#64748b",
  },
  [EDGE_TYPES.BLOCKED]: {
    type: "arrowclosed",
    color: "#ef4444",
  },
} as const;
