"use client";

import { EXPRESSION_COLORS } from "@/entities/expression";
import { cn } from "@/lib/utils";

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
      {EXPRESSION_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "h-5 w-5 rounded-full border-2 transition-transform hover:scale-110",
            value === color
              ? "border-foreground scale-110"
              : "border-transparent",
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={`Set color ${color}`}
          aria-pressed={value === color}
        />
      ))}
      <label className="relative h-5 w-5 cursor-pointer overflow-hidden rounded-full border border-border">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Custom color"
        />
        <span
          className="block h-full w-full rounded-full"
          style={{
            background: `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)`,
          }}
        />
      </label>
    </div>
  );
}
