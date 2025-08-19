"use client"

import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useReactFlowData } from '@/context/react-flow-data-context';
 
 
export default function App({reactClass}:{reactClass:any}) {

  const {nodeData} = useReactFlowData()

  const [nodes, setNodes] = useState(nodeData?.parsedData?.nodes);
  const [edges,setEdges] = useState(nodeData?.parsedData?.edges)
 
  const onNodesChange = useCallback(
    (changes:any) => setNodes((nodesSnapshot:any) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes:any) => setEdges((edgesSnapshot:any) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params:any) => setEdges((edgesSnapshot:any) => addEdge(params, edgesSnapshot)),
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