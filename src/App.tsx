// src/App.tsx
import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import SchemaVisualizer from "./components/SchemaVisualizer";
import CustomButton from "./components/CustomButton";

const App: React.FC = () => {
  const [schema, setSchema] = useState<string>("");

  const handleSchemaSubmit = (submittedSchema: string) => {
    setSchema(submittedSchema);
  };

  return (
    <>
      <Navbar />
      <main className="px-4 py-2 flex flex-col h-screen relative">
        <SchemaVisualizer schema={schema} />
        <div
          className="
      absolute
      bottom-40
      left-6
      mx-2
      "
        >
          <CustomButton onSchemaSubmit={handleSchemaSubmit} />
        </div>
      </main>
    </>
  );
};

export default App;
