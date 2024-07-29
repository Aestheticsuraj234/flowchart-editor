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
import dagre from 'dagre';
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
        const { nodes: layoutNodes, edges: layoutEdges } = applyLayout(nodes, edges);
        setNodes(layoutNodes);
        setEdges(layoutEdges);
      } catch (error) {
        console.error('Invalid JSON schema:', error);
      }
    }
  }, [schema]);

  const convertSchemaToElements = (schema: any): { nodes: Node[], edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const verticalSpacing = 150;
    let yPosition = 0;

    for (const [collectionName, collectionSchema] of Object.entries(schema)) {
      const nodeId = `collection-${collectionName}`;
      const node: Node = {
        id: nodeId,
        data: { label: collectionName, fields: collectionSchema.fields },
        position: { x: 0, y: yPosition },
        type: 'tableNode',
      };
      nodes.push(node);
      yPosition += verticalSpacing;

      if (collectionSchema.fields) {
        collectionSchema.fields.forEach((field: any) => {
          if (field.ref) {
            const edge: Edge = {
              id: `edge-${collectionName}-${field.ref}`,
              source: nodeId,
              target: `collection-${field.ref}`,
              animated: true,
              label: `${field.name} → ${field.ref}`,
              type: 'smoothstep', // Use smoothstep for better edge paths
              style: { stroke: '#a17cf2', strokeWidth: 2 },
              labelStyle: { fontSize: 14, fill: '#a17cf2' , fontWeight: 'bold',
 fontVariantCaps:"all-petite-caps"

               },
            };
            edges.push(edge);
          }
        });
      }
    }

    return { nodes, edges };
  };

  const onConnect: OnConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));

  // Apply automatic layout
  const applyLayout = (nodes: Node[], edges: Edge[]) => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR' });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      g.setNode(node.id, { width: 150, height: 100 });
    });

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const updatedNodes = nodes.map((node) => {
      const nodeWithPosition = g.node(node.id);
      node.position = {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      };
      return node;
    });

    return { nodes: updatedNodes, edges };
  };

  return (
    <div style={{ height: '100vh', width: '100%' }} className="mt-4 border border-gray-300 rounded">
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
