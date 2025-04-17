// Card dimensions
export const CARD = {
  width: "300px",
  height: "100px",
  padding: "px-2 py-2",
  borderRadius: "rounded-lg",
} as const;

// Node types
export const NODE_TYPES = {
  CARD: "card",
} as const;

export const EDGE_TYPES = {
  CUSTOM: "custom",
} as const;

// Background grid
export const BACKGROUND = {
  gap: 20,
  size: 1,
} as const;
