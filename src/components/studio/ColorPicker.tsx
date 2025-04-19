
import { useRef } from "react";

const DEFAULT_COLORS = [
  "#000000", "#FFFFFF", "#F44336", "#E91E63", "#9C27B0", 
  "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", 
  "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", 
  "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E"
];

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
      <div className="text-xs text-editor-text font-mono mb-2">Colors</div>
      <div className="flex flex-wrap gap-2">
        {DEFAULT_COLORS.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-sm ${
              activeColor === color ? "ring-2 ring-offset-2 ring-tool-active" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title={color}
          />
        ))}
        <button
          className="w-6 h-6 rounded-sm bg-gray-200 flex items-center justify-center"
          onClick={() => colorInputRef.current?.click()}
          title="Custom color"
        >
          <span className="text-xs">+</span>
          <input
            ref={colorInputRef}
            type="color"
            value={activeColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="sr-only"
          />
        </button>
      </div>
    </div>
  );
};
