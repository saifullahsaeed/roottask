import { useFlowStore } from "../store/useFlowStore";
const store = useFlowStore.getState();

const GAP_WIDTH = 400;
const GAP_HEIGHT = 200;
export function getNextCardPosition(parrentNodeId: string) {
  const returnPosition = { x: 0, y: 0 };
  //x is always going to be x + GAP_WIDTH
  const parrentNode = store.nodes.find((node) => node.id === parrentNodeId);
  if (!parrentNode) {
    return { x: 0, y: 0 };
  }
  const parrentNodePosition = parrentNode.position;

  returnPosition.x = parrentNodePosition.x + GAP_WIDTH;

  return returnPosition;
}
