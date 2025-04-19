
import { useState, useEffect } from "react";
import { Canvas } from "@/components/studio/Canvas";
import { Toolbar } from "@/components/studio/Toolbar";
import { Timeline } from "@/components/studio/Timeline";
import { ColorPicker } from "@/components/studio/ColorPicker";
import { Preview } from "@/components/studio/Preview";
import { StatusBar } from "@/components/studio/StatusBar";
import { DebugPanel } from "@/components/studio/DebugPanel";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Index = () => {
  // State
  const [activeTool, setActiveTool] = useState<"select" | "pencil" | "eraser" | "rectangle" | "circle">("pencil");
  const [activeFrame, setActiveFrame] = useState(0);
  const [activeColor, setActiveColor] = useState("#000000");
  const [frames, setFrames] = useState<Record<number, string>>({});
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(12);
  const [onionSkinEnabled, setOnionSkinEnabled] = useState(false);

  // Initialize first frame
  useEffect(() => {
    if (Object.keys(frames).length === 0) {
      setFrames({ 0: "" });
    }
  }, [frames]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key.toLowerCase()) {
        case "v": setActiveTool("select"); break;
        case "p": setActiveTool("pencil"); break;
        case "e": setActiveTool("eraser"); break;
        case "r": setActiveTool("rectangle"); break;
        case "c": setActiveTool("circle"); break;
        case "n": handleNewFrame(); break;
        case "d": handleDuplicateFrame(); break;
        case " ": setPlaying(!playing); e.preventDefault(); break;
        case "delete": handleDeleteFrame(); break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTool, activeFrame, frames, playing]);

  // Handle frame actions
  const handleFrameUpdate = (frameIndex: number, data: string) => {
    setFrames(prev => ({ ...prev, [frameIndex]: data }));
    
    // Reset to select tool after adding shapes
    if (activeTool === "rectangle" || activeTool === "circle") {
      setTimeout(() => setActiveTool("select"), 100);
    }
  };
  
  const handleNewFrame = () => {
    const newIndex = Math.max(...Object.keys(frames).map(Number), 0) + 1;
    setFrames(prev => ({ ...prev, [newIndex]: "" }));
    setActiveFrame(newIndex);
    toast("New frame created");
  };
  
  const handleDeleteFrame = () => {
    if (Object.keys(frames).length <= 1) {
      toast("Cannot delete the only frame");
      return;
    }
    
    const newFrames = { ...frames };
    delete newFrames[activeFrame];
    
    setFrames(newFrames);
    setActiveFrame(Math.min(...Object.keys(newFrames).map(Number)));
    toast("Frame deleted");
  };
  
  const handleDuplicateFrame = () => {
    const newIndex = Math.max(...Object.keys(frames).map(Number), 0) + 1;
    setFrames(prev => ({ ...prev, [newIndex]: prev[activeFrame] || "" }));
    setActiveFrame(newIndex);
    toast("Frame duplicated");
  };

  // Export/Import
  const handleExport = () => {
    try {
      const data = JSON.stringify({
        frames,
        fps,
        version: "1.0.0",
      });
      
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.download = "animation.json";
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
      toast("Animation exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast("Export failed. Check console for details.");
    }
  };
  
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);
          
          if (data.frames && typeof data.frames === "object") {
            setFrames(data.frames);
            if (data.fps && typeof data.fps === "number") {
              setFps(data.fps);
            }
            setActiveFrame(Math.min(...Object.keys(data.frames).map(Number)));
            toast("Animation imported successfully");
          } else {
            throw new Error("Invalid animation data");
          }
        } catch (error) {
          console.error("Import failed:", error);
          toast("Import failed. Check console for details.");
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <div className="min-h-screen bg-editor-bg text-editor-text font-mono flex flex-col">
      {/* Header */}
      <header className="border-b border-editor-border p-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Sketchy Motion Studio</h1>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1">
              FPS:
              <input
                type="number"
                min="1"
                max="60"
                value={fps}
                onChange={(e) => setFps(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                className="w-12 bg-editor-panel border border-editor-border rounded px-1"
              />
            </label>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container py-4">
        <div className="grid grid-cols-[auto_1fr] gap-4">
          {/* Left sidebar with tools */}
          <div className="flex flex-col gap-4">
            <Toolbar
              activeTool={activeTool}
              onToolChange={setActiveTool}
              onNewFrame={handleNewFrame}
              onDeleteFrame={handleDeleteFrame}
              onDuplicateFrame={handleDuplicateFrame}
              onPlay={() => setPlaying(!playing)}
              onExport={handleExport}
              onImport={handleImport}
            />
          </div>
          
          {/* Right main area */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr_200px] gap-4">
              {/* Canvas */}
              <Canvas
                activeColor={activeColor}
                activeTool={activeTool}
                frameIndex={activeFrame}
                frames={frames}
                onFrameUpdate={handleFrameUpdate}
              />
              
              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                <ColorPicker activeColor={activeColor} onColorChange={setActiveColor} />
                <div className="bg-editor-panel border border-editor-border rounded-md p-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-mono" htmlFor="onion-skin">Onion Skin</Label>
                    <Switch
                      id="onion-skin"
                      checked={onionSkinEnabled}
                      onCheckedChange={setOnionSkinEnabled}
                    />
                  </div>
                </div>
                <Preview 
                  frames={frames}
                  fps={fps}
                  playing={playing}
                  onPlayingChange={setPlaying}
                />
              </div>
            </div>
            
            {/* Timeline */}
            <Timeline
              frames={frames}
              activeFrame={activeFrame}
              onSelectFrame={setActiveFrame}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-editor-border">
        <StatusBar 
          activeFrame={activeFrame} 
          totalFrames={Object.keys(frames).length}
          fps={fps}
        />
      </footer>
      
      {/* Debug panel */}
      <DebugPanel 
        frames={frames}
        activeFrame={activeFrame}
        fps={fps}
      />
    </div>
  );
};

export default Index;
