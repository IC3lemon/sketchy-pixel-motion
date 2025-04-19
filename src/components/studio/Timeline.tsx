
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, FilePlus, Trash2 } from "lucide-react";

interface TimelineProps {
  frames: Record<number, string>;
  activeFrame: number;
  onSelectFrame: (index: number) => void;
}

export const Timeline = ({
  frames,
  activeFrame,
  onSelectFrame,
}: TimelineProps) => {
  const frameArray = Object.keys(frames).map(Number);
  const totalFrames = Math.max(...frameArray, 0) + 1;
  
  return (
    <div className="bg-editor-panel border border-editor-border rounded-md p-2">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-editor-text/80 font-mono">Timeline</div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="New frame"
          >
            <FilePlus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="Copy frame"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="Delete frame"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1 p-1 min-w-full">
          {Array.from({ length: totalFrames }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "group relative h-20 w-20 rounded border border-editor-border p-1",
                activeFrame === index && "border-editor-text bg-editor-border/20"
              )}
              onClick={() => onSelectFrame(index)}
            >
              <div className="flex justify-between items-start text-[10px] font-mono">
                <span className="text-green-400">f{index + 1}</span>
                <span className="text-yellow-400">{frames[index] ? "{...}" : "{ }"}</span>
              </div>
              <div className={cn(
                "mt-1 flex-1 border border-dashed rounded",
                frames[index] ? "border-editor-text/40" : "border-editor-border/40"
              )} />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-editor-border/20 group-hover:bg-editor-border/40" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
