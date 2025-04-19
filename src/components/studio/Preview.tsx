
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";

interface PreviewProps {
  frames: Record<number, string>;
  fps: number;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
}

export const Preview = ({
  frames,
  fps,
  playing,
  onPlayingChange,
}: PreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const frameIds = Object.keys(frames).map(Number).sort((a, b) => a - b);
  
  // Create canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 200,
      height: 150,
      backgroundColor: "#ffffff",
      selection: false,
      renderOnAddRemove: true,
    });

    setCanvas(fabricCanvas);
    
    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Handle animation logic
  useEffect(() => {
    if (!canvas || !playing || frameIds.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const nextFrame = (prev + 1) % frameIds.length;
        return nextFrame;
      });
    }, 1000 / fps);
    
    return () => {
      clearInterval(interval);
    };
  }, [canvas, playing, fps, frameIds.length]);

  // Render current frame
  useEffect(() => {
    if (!canvas || frameIds.length === 0) return;
    
    const frameIndex = frameIds[currentFrame];
    const frameData = frames[frameIndex];
    
    if (frameData) {
      canvas.clear();
      canvas.loadFromJSON(frameData, () => {
        canvas.renderAll();
      });
    }
  }, [canvas, currentFrame, frames, frameIds]);

  return (
    <div className="bg-editor-panel border border-editor-border rounded-md p-2">
      <div className="text-xs text-editor-text font-mono mb-2">Preview</div>
      <div className="border border-editor-border bg-canvas-bg flex items-center justify-center cursor-pointer"
           onClick={() => onPlayingChange(!playing)}>
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-editor-text font-mono">
          Frame: {currentFrame + 1}/{frameIds.length}
        </div>
        <div className="text-xs text-editor-text font-mono">
          {fps} FPS
        </div>
      </div>
    </div>
  );
};
