
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect } from "fabric";
import { toast } from "sonner";

interface CanvasProps {
  activeColor: string;
  activeTool: "select" | "pencil" | "eraser" | "rectangle" | "circle";
  frameIndex: number;
  frames: Record<number, string>;
  onFrameUpdate: (frameIndex: number, data: string) => void;
}

export const Canvas = ({
  activeColor,
  activeTool,
  frameIndex,
  frames,
  onFrameUpdate,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: false,
    });

    setCanvas(fabricCanvas);
    
    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Load frame data when frameIndex changes
  useEffect(() => {
    if (!canvas) return;
    
    const frameData = frames[frameIndex];
    if (frameData) {
      canvas.clear();
      canvas.loadFromJSON(frameData, () => {
        canvas.renderAll();
      });
    } else {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
    }
  }, [canvas, frameIndex, frames]);

  // Save frame data when canvas changes
  const saveCurrentFrame = () => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    onFrameUpdate(frameIndex, json);
  };
  
  // Handle tool changes
  useEffect(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = activeTool === "pencil" || activeTool === "eraser";
    
    if (canvas.isDrawingMode) {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = activeTool === "eraser" ? "#ffffff" : activeColor;
        canvas.freeDrawingBrush.width = activeTool === "eraser" ? 20 : 2;
      }
    }

    canvas.selection = activeTool === "select";
    
    // Add shapes based on active tool
    if (activeTool === "rectangle") {
      const rect = new Rect({
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 50,
        fill: activeColor,
        width: 100,
        height: 100,
        transparentCorners: false
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
      // Reset to select tool after adding shape
      setTimeout(() => {
        onFrameUpdate(frameIndex, JSON.stringify(canvas.toJSON()));
      }, 50);
    } else if (activeTool === "circle") {
      const circle = new Circle({
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 50,
        radius: 50,
        fill: activeColor,
        transparentCorners: false
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
      // Reset to select tool after adding shape
      setTimeout(() => {
        onFrameUpdate(frameIndex, JSON.stringify(canvas.toJSON()));
      }, 50);
    }
    
    canvas.renderAll();
  }, [canvas, activeTool, activeColor]);

  // Add event listeners to save frame on changes
  useEffect(() => {
    if (!canvas) return;

    const handleModified = () => saveCurrentFrame();
    
    canvas.on("object:added", handleModified);
    canvas.on("object:modified", handleModified);
    canvas.on("object:removed", handleModified);

    return () => {
      canvas.off("object:added", handleModified);
      canvas.off("object:modified", handleModified);
      canvas.off("object:removed", handleModified);
    };
  }, [canvas, frameIndex]);

  return (
    <div className="relative border border-editor-border bg-canvas-bg rounded-md overflow-hidden">
      {/* Grid background for pixel reference */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
      
      <canvas ref={canvasRef} className="max-w-full relative z-10" />
      
      <div className="absolute top-2 left-2 text-xs text-editor-text font-mono bg-editor-panel px-2 py-1 rounded opacity-70 z-20">
        {activeTool === "pencil" && "✏️ draw"}
        {activeTool === "eraser" && "🧽 erase"}
        {activeTool === "select" && "👆 select"}
        {activeTool === "rectangle" && "⬜ rectangle"}
        {activeTool === "circle" && "⭕ circle"}
      </div>
      
      <div className="absolute bottom-2 right-2 text-xs text-editor-text font-mono bg-editor-panel px-2 py-1 rounded opacity-70 z-20">
        Frame {frameIndex + 1}
      </div>
      
      <div
        className="absolute top-2 right-2 h-4 w-4 rounded-full z-20"
        style={{ backgroundColor: activeColor }}
      />
    </div>
  );
};
