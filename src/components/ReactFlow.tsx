// "use client"

// import { useState, useCallback } from 'react';
// import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import { useReactFlowData } from '@/context/react-flow-data-context';
 
 
// export default function App({reactClass}:{reactClass:string}) {

//   const {nodeData} = useReactFlowData()

//   const [nodes, setNodes] = useState(nodeData?.nodes);
//   const [edges,setEdges] = useState(nodeData?.edges)
 
//   const onNodesChange = useCallback(
//     (changes:any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
//     [],
//   );

//   const onEdgesChange = useCallback(
//     (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
//     [],
//   );
//   const onConnect = useCallback(
//     (params:any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
//     [],
//   );

//   return (
//     <div className={reactClass}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       />
//     </div>
//   );
// }

"use client"

import { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useReactFlowData } from '@/context/react-flow-data-context';

export default function App({ reactClass }: { reactClass: string }) {
  const { nodeData } = useReactFlowData();

  const [nodes, setNodes] = useState<Node[]>(nodeData?.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(nodeData?.edges || []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className={reactClass}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}