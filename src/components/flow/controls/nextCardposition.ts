import { useFlowStore } from "../store/useFlowStore";
const store = useFlowStore.getState();

const GAP_WIDTH = 400;
const GAP_HEIGHT = 200;

export function getNextCardPosition(parrentNodeId: string) {
  // Find the parent node
  const parrentNode = store.nodes.find((node) => node.id === parrentNodeId);
  if (!parrentNode) {
    return { x: 0, y: 0 };
  }
  const parrentNodePosition = parrentNode.position;

  // Find all children (nodes where an edge's source is the parent)
  const childrenEdges = store.edges.filter(
    (edge) => edge.source === parrentNodeId
  );
  const childrenIds = childrenEdges.map((edge) => edge.target);
  const childrenNodes = store.nodes.filter((node) =>
    childrenIds.includes(node.id)
  );

  // Collect all occupied y positions at the target x
  const targetX = parrentNodePosition.x + GAP_WIDTH;
  const occupiedY = new Set(
    childrenNodes
      .filter((node) => node.position.x === targetX)
      .map((node) => node.position.y)
  );

  // Try to place at the same y as parent first
  if (!occupiedY.has(parrentNodePosition.y)) {
    return { x: targetX, y: parrentNodePosition.y };
  }

  // Fan out above and below parent, alternating, until a free slot is found
  let offset = 1;
  while (true) {
    // Above
    const aboveY = parrentNodePosition.y - offset * GAP_HEIGHT;
    if (!occupiedY.has(aboveY)) {
      return { x: targetX, y: aboveY };
    }
    // Below
    const belowY = parrentNodePosition.y + offset * GAP_HEIGHT;
    if (!occupiedY.has(belowY)) {
      return { x: targetX, y: belowY };
    }
    offset++;
  }
}
