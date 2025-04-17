import { Edge } from "reactflow";

/**
 * Calculate the position of the next node based on the current position and the edges
 * @param  - The position of the current node as Position
 * @param currentNodeEdges - The edges of the current node as Edge[]
 */

type NodePosition = {
  id: string;
  x: number;
  y: number;
};

type Node = {
  id: string;
  position: NodePosition;
  children: Node[];
};

const GAP_WIDTH = 600;
const GAP_HEIGHT = 200;

// Convert edges to a tree structure
function buildTree(
  currentNodePosition: NodePosition,
  edges: Edge[],
  visited: Set<string> = new Set(),
  depth: number = 0
): Node {
  const node: Node = {
    id: currentNodePosition.id,
    position: currentNodePosition,
    children: [],
  };

  visited.add(node.id);

  // Find all children of current node
  const childEdges = edges.filter((edge) => edge.source === node.id);

  for (const edge of childEdges) {
    if (!visited.has(edge.target)) {
      const childPosition = {
        id: edge.target,
        x: currentNodePosition.x + GAP_WIDTH,
        y: currentNodePosition.y,
      };
      const childNode = buildTree(childPosition, edges, visited, depth + 1);
      node.children.push(childNode);
    }
  }

  return node;
}

// Get a flattened array of all nodes in the tree
function flattenTree(node: Node): NodePosition[] {
  const positions: NodePosition[] = [node.position];

  node.children.forEach((child, index) => {
    // For multiple children, adjust Y position to avoid overlap
    if (index > 0) {
      child.position.y = node.position.y + GAP_HEIGHT * index;
    }
    positions.push(...flattenTree(child));
  });

  return positions;
}

export type RecalculateNodePositionsProps = {
  currentNodePosition: NodePosition;
  currentNodeEdges: Edge[];
};

export function RecalculateNodePositions({
  currentNodePosition,
  currentNodeEdges,
}: RecalculateNodePositionsProps): NodePosition[] {
  try {
    // Build our tree structure
    const root = buildTree(currentNodePosition, currentNodeEdges);

    // Get all positions
    return flattenTree(root);
  } catch (error) {
    console.error(error);
    return [currentNodePosition];
  }
}

/**
 * Documentation:
 *  This function is used to recalculate the positions of the nodes in the flow. Its designed for creating a new nodes.
 *  Problem:
 *    - When a node is created, the position is not calculated correctly.
 *       so it messup the hirarich of flow also user have to fiddle out the positions by them selves which is not good
 *  Solution:
 *      ideal output of the flow:
 *          |-*
 *          |-*
 *        *-|-*
 *          |-*
 *          |-*
 *
 *      newnode added:
 *          |-*         |-*
 *          |-*         |-*
 *        *-|-* + *    *|-*
 *          |-*         |-*
 *          |-*         |-*
 *                      |-* -> New node is added here
 *      one more node added:
 *                      |-*
 *          |-*         |-*
 *          |-*         |-*
 *        *-|-* + *    *|-*
 *          |-*         |-*
 *          |-*         |-*
 *          |-*         |-* -> New node is still added to the bottom of the flow
 *
 *     Noi dea is to calculate the position of the new node based on the position of the previous nodes and the edges
 *     x = 100 y= 100 with gap width 200 is going to be x =  300 y = 100 if y had no edges
 *     x = 100 y= 100 with gap width 200 is going to be x still had to be 100 but y is going to be calculated based on the edges
 *     with two edges the y is going be  200 for edge 1 and 0 for edge 2
 *
 *  input of the flow:
 */

/**
 * Input:
 * currentNodePosition:
 *  {
 *    id: "1",
 *    x: 100,
 *    y: 100,
 *  },
 * currentNodeEdges:
 *  [
 *    {
 *      id: "1",
 *      source: "1",
 *      target: "2",
 *    },
 *    {
 *      id: "2",
 *      source: "2",
 *      target: "3",
 *    },
 *    {
 *      id: "3",
 *      source: "3",
 *      target: "4",
 *    },
 *  ],
 *
 *  ],
 */

/**
 * Expacted Response:
 * [
 *  {
 *    x: 100,
 *    y: 100,
 *  },
 *  {
 *    x: 200,
 *    y: 200,
 *  },
 *  {
 *    x: 300,
 *    y: 300,
 *  },
 * ]
 */
