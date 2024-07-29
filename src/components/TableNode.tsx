// src/components/TableNode.tsx
import React from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Badge } from './ui/badge';

const TableNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-md p-2 min-w-[150px] shadow-md">
      <strong className="block text-center mb-2">{data.label}</strong>
      <table className="w-full text-left">
        <tbody>
          {data.fields.map((field: any, index: number) => (
            <tr key={index} className="border-t">
              <td className="py-1 px-2 font-semibold">{field.name}</td>
              <td className=" px-4 py-2 border rouned-md ">
              <Badge variant="brand">
              {field.type || field.ref}
              </Badge>

               
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-red-500" style={{ top: '50%' }} />
    </div>
  );
};

export default TableNode;
