// src/components/SchemaVisualizer.tsx
import React, { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  OnConnect,
  MiniMap,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TableNode from './TableNode'; // Import the custom node component

interface SchemaVisualizerProps {
  schema: string;
}

const nodeTypes = {
  tableNode: TableNode,
};

const SchemaVisualizer: React.FC<SchemaVisualizerProps> = ({ schema }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (schema) {
      try {
        const parsedSchema = JSON.parse(schema);
        const { nodes, edges } = convertSchemaToElements(parsedSchema);
        setNodes(nodes);
        setEdges(edges);
      } catch (error) {
        console.error('Invalid JSON schema:', error);
      }
    }
  }, [schema]);

  const convertSchemaToElements = (schema: any): { nodes: Node[], edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let xPosition = 0;
    const verticalSpacing = 150;

    for (const [collectionName, collectionSchema] of Object.entries(schema)) {
      const nodeId = `collection-${collectionName}`;
      const node: Node = {
        id: nodeId,
        data: { label: collectionName, fields: collectionSchema.fields },
        position: { x: xPosition, y: 0 },
        type: 'tableNode',
      };
      nodes.push(node);
      xPosition += 300;

      if (collectionSchema.fields) {
        collectionSchema.fields.forEach((field: any) => {
          if (field.ref) {
            const edge: Edge = {
              id: `edge-${collectionName}-${field.ref}`,
              source: nodeId,
              target: `collection-${field.ref}`,
              animated: true,
              label: `${field.name} → ${field.ref}`,
            };
            edges.push(edge);
          }
        });
      }
    }

    return { nodes, edges };
  };

  const onConnect: OnConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ height: 500 }} className="mt-4 border border-gray-300 rounded">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default SchemaVisualizer;
