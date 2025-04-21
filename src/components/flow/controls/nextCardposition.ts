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
  returnPosition.x = parrentNode.position.x + GAP_WIDTH;

  //returnPosition.y is going to be the y of the list of children sort them with y and last child y + GAP_HEIGHT
  const children = store.nodes
    .filter((node) =>
      store.edges.some(
        (edge) => edge.source === parrentNodeId && edge.target === node.id
      )
    )
    .sort((a, b) => a.position.y - b.position.y);

  if (children.length === 0) {
    returnPosition.y = parrentNode.position.y;
  } else {
    const lastChild = children[children.length - 1];
    returnPosition.y = lastChild.position.y + GAP_HEIGHT;
  }

  return returnPosition;
}
