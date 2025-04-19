
import { useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EyeDropper, Palette } from "lucide-react";

interface ColorPickerProps {
  activeColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker = ({
  activeColor,
  onColorChange,
}: ColorPickerProps) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-editor-panel border border-editor-border rounded-md p-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-editor-text font-mono">Colors</span>
        <div className="flex gap-1">
          <button
            onClick={() => colorInputRef.current?.click()}
            className="p-1 hover:bg-editor-border rounded"
            title="Color picker"
          >
            <EyeDropper className="w-3 h-3" />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 hover:bg-editor-border rounded" title="Color wheel">
                <Palette className="w-3 h-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4">
              <div className="flex flex-col gap-4">
                <div 
                  className="w-full aspect-square rounded-full relative"
                  style={{
                    background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)"
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                  title="Lightness"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-1">
        <input
          ref={colorInputRef}
          type="color"
          value={activeColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="sr-only"
        />
        <button
          className={cn(
            "w-8 h-8 rounded-md border border-editor-border",
            activeColor === "#000000" && "ring-1 ring-editor-text"
          )}
          style={{ backgroundColor: activeColor }}
          onClick={() => onColorChange(activeColor)}
        />
        {["#FFFFFF", "#F44336", "#4CAF50", "#2196F3"].map((color) => (
          <button
            key={color}
            className={cn(
              "w-8 h-8 rounded-md border border-editor-border",
              color === activeColor && "ring-1 ring-editor-text"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
    </div>
  );
};
