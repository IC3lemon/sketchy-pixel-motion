
import { useState } from "react";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DebugPanelProps {
  frames: Record<number, string>;
  activeFrame: number;
  fps: number;
}

export const DebugPanel = ({ frames, activeFrame, fps }: DebugPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const frameData = frames[activeFrame];
  const jsonObject = frameData ? JSON.parse(frameData) : {};
  const formattedJson = JSON.stringify(jsonObject, null, 2);
  
  const stats = {
    totalFrames: Object.keys(frames).length,
    currentFrame: activeFrame + 1,
    framesPerSecond: fps,
    animationDuration: `${(Object.keys(frames).length / fps).toFixed(2)}s`,
    memoryUsage: `${Math.round(formattedJson.length / 1024)} KB`,
    timestamp: new Date().toISOString(),
  };
  
  if (!expanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="fixed bottom-12 right-4 bg-editor-panel opacity-70 hover:opacity-100"
        onClick={() => setExpanded(true)}
      >
        <Terminal className="h-4 w-4 mr-1" />
        Debug
      </Button>
    );
  }
  
  return (
    <div className="fixed bottom-12 right-4 w-96 h-64 bg-editor-panel border border-editor-border rounded shadow-lg font-mono text-xs flex flex-col z-50">
      <div className="flex justify-between items-center p-2 border-b border-editor-border">
        <span className="flex items-center">
          <Terminal className="h-3 w-3 mr-1" />
          Debug Console
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1"
          onClick={() => setExpanded(false)}
        >
          x
        </Button>
      </div>
      
      <div className="flex-1 p-2 overflow-auto bg-editor-bg">
        <div className="mb-2">
          <span className="text-green-400">// Animation Stats</span>
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="text-blue-400 w-40">const {key}</span>
              <span className="text-editor-text/70">=</span>
              <span className="text-yellow-300 ml-1">
                {typeof value === "string" ? `"${value}"` : value}
              </span>
              <span className="text-editor-text/70">;</span>
            </div>
          ))}
        </div>
        
        <div>
          <span className="text-green-400">// Frame Data (JSON)</span>
          <pre className="text-[8px] text-editor-text/70 overflow-x-auto">
            {formattedJson}
          </pre>
        </div>
      </div>
    </div>
  );
};
