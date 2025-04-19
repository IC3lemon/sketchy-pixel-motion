
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun } from "lucide-react";

interface StatusBarProps {
  activeFrame: number;
  totalFrames: number;
  fps: number;
}

export const StatusBar = ({ activeFrame, totalFrames, fps }: StatusBarProps) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex justify-between items-center text-xs px-2 py-1 border-t border-editor-border bg-editor-panel/70">
      <div className="flex gap-4">
        <div>frame: {activeFrame + 1}/{totalFrames}</div>
        <div>fps: {fps}</div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setTheme("light")}
          title="Light mode"
        >
          <Sun className="h-3.5 w-3.5" />
          <span className="sr-only">Light</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setTheme("dark")}
          title="Dark mode"
        >
          <Moon className="h-3.5 w-3.5" />
          <span className="sr-only">Dark</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setTheme("system")}
          title="System theme"
        >
          <Monitor className="h-3.5 w-3.5" />
          <span className="sr-only">System</span>
        </Button>
      </div>
      
      <div>sketchy-motion v0.1</div>
    </div>
  );
};
