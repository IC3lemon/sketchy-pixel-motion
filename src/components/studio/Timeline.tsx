
import { Button } from "@/components/ui/button";

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
        <div className="text-xs text-editor-text font-mono">Timeline</div>
        <div className="text-xs text-editor-text/50 font-mono">
          {"// frames.map(renderFrame)"}
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-1 pb-2 relative">
        {/* Code-like line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-editor-bg flex flex-col items-end pr-1 text-[10px] text-editor-text/50 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* Timeline with code-like styling */}
        <div className="ml-6 pl-2 border-l border-l-editor-border flex-1">
          <div className="bg-editor-bg p-2 rounded text-[10px] text-blue-400 mb-1">
            {"const frames = ["}
          </div>
          <div className="flex flex-wrap gap-1 pl-4">
            {Array.from({ length: totalFrames }).map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`h-14 w-14 flex-shrink-0 border ${
                  activeFrame === index 
                    ? "border-tool-active bg-editor-highlight/10" 
                    : "border-editor-border hover:bg-tool-hover/10"
                } flex flex-col items-start justify-between p-1 text-left`}
                onClick={() => onSelectFrame(index)}
              >
                <span className="text-[10px] font-mono text-green-400">f{index + 1}</span>
                <div className={`w-full h-6 border border-dashed ${frames[index] ? "border-tool-active" : "border-editor-border"}`} />
                <span className="text-[10px] font-mono text-yellow-300">{frames[index] ? "{...}" : "{}"}</span>
              </Button>
            ))}
            {/* Add new frame button */}
          </div>
          <div className="bg-editor-bg p-2 rounded text-[10px] text-blue-400 mt-1">
            {"];"}
          </div>
        </div>
      </div>
    </div>
  );
};
