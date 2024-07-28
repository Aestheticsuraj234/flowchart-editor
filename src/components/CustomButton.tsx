// src/components/CustomButton.tsx
import React, { useState, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "./ui/textarea";

interface CustomButtonProps {
  onSchemaSubmit: (schema: string) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onSchemaSubmit }) => {
  const [schema, setSchema] = useState<string>("");

  const handleSchemaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSchema(e.target.value);
  };

  const handleSubmit = () => {
    onSchemaSubmit(schema);
    setSchema(""); // Reset the textarea after submission
  };

  return (
    <Sheet>
      <SheetTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant={"addNew"} size={"sm"}>
                <Plus size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add New Schema Analyzer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Your Mongodb Schema in Json Format🚀</SheetTitle>
        </SheetHeader>
        <div className="grid w-full gap-2 mt-10">
          <Textarea
            value={schema}
            onChange={handleSchemaChange}
            placeholder="Paste Your Mongodb Schema here."
          />
          <Button variant={"addNew"} size={"default"} onClick={handleSubmit}>
            Generate
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomButton;
