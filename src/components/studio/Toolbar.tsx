
import { Button } from "@/components/ui/button";
import {
  MousePointer,
  Pencil,
  Eraser,
  Square,
  Circle,
  Trash2,
  Copy,
  Layers,
  Play,
  FileDown,
  FileUp,
  Move,
  Type,
  Image,
  Scissors,
  Wand2,
  Hand,
  ZoomIn,
  LineChart,
} from "lucide-react";

interface ToolbarProps {
  activeTool: "select" | "pencil" | "eraser" | "rectangle" | "circle";
  onToolChange: (tool: "select" | "pencil" | "eraser" | "rectangle" | "circle") => void;
  onNewFrame: () => void;
  onDeleteFrame: () => void;
  onDuplicateFrame: () => void;
  onPlay: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const Toolbar = ({
  activeTool,
  onToolChange,
  onNewFrame,
  onDeleteFrame,
  onDuplicateFrame,
  onPlay,
  onExport,
  onImport
}: ToolbarProps) => {
  const tools = [
    { id: "select", icon: MousePointer, tooltip: "Select (V)" },
    { id: "move", icon: Move, tooltip: "Move (M)" },
    { id: "hand", icon: Hand, tooltip: "Pan (H)" },
    { id: "pencil", icon: Pencil, tooltip: "Pencil (P)" },
    { id: "eraser", icon: Eraser, tooltip: "Eraser (E)" },
    { id: "rectangle", icon: Square, tooltip: "Rectangle (R)" },
    { id: "circle", icon: Circle, tooltip: "Circle (C)" },
    { id: "line", icon: LineChart, tooltip: "Line (L)" },
    { id: "type", icon: Type, tooltip: "Text (T)" },
    { id: "image", icon: Image, tooltip: "Image (I)" },
    { id: "magic", icon: Wand2, tooltip: "Magic Wand (W)" },
    { id: "scissors", icon: Scissors, tooltip: "Cut (X)" },
    { id: "zoom", icon: ZoomIn, tooltip: "Zoom (Z)" },
  ] as const;

  return (
    <div className="flex flex-col bg-editor-panel p-2 rounded-md border border-editor-border">
      <div className="grid grid-cols-2 gap-1 mb-4">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            size="icon"
            className={`w-8 h-8 ${
              activeTool === tool.id
                ? "bg-tool-active text-editor-bg"
                : "text-tool-default hover:bg-tool-hover hover:text-editor-bg"
            }`}
            onClick={() => onToolChange(tool.id as any)}
            title={tool.tooltip}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>
      
      <div className="h-px bg-editor-border my-2" />
      
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-tool-default hover:bg-tool-hover hover:text-editor-bg"
          onClick={onNewFrame}
          title="New Frame (N)"
        >
          <Layers className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-tool-default hover:bg-tool-hover hover:text-editor-bg"
          onClick={onDuplicateFrame}
          title="Duplicate Frame (D)"
        >
          <Copy className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-tool-default hover:bg-tool-hover hover:text-editor-bg"
          onClick={onDeleteFrame}
          title="Delete Frame (Del)"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="h-px bg-editor-border my-2" />
      
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-tool-default hover:bg-tool-hover hover:text-editor-bg"
          onClick={onPlay}
          title="Play Animation (Space)"
        >
          <Play className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-tool-default hover:bg-tool-hover hover:text-editor-bg"
          onClick={onExport}
          title="Export Animation"
        >
          <FileDown className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-tool-default hover:bg-tool-hover hover:text-editor-bg"
          onClick={onImport}
          title="Import Animation"
        >
          <FileUp className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
