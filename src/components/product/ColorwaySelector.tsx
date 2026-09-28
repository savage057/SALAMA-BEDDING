'use client';

interface ColorwaySelectorProps {
  colorways: string[];
  selectedColorway: string;
  onSelect: (colorway: string) => void;
}

// Map colorway names to HEX values for display swatches
const COLORWAY_MAP: Record<string, string> = {
  'Teal / Green Stripe': '#117A65',
  'Charcoal / Gold': '#3A3A3A',
  'Sage Green': '#8B9F82',
  'Dusty Rose': '#C4929B',
  'Coral / Grey Floral': '#E06F6F',
  'Blush Pink': '#F4C2C2',
  'Burgundy Ditsy': '#6E2C3C',
  'Lavender': '#B4A7D6',
  'Cherry Red': '#C41E3A',
  'Sky Blue': '#87CEEB',
  'Daisy Blue': '#2471A3',
  'Sunset Orange': '#ED7D31',
};

export default function ColorwaySelector({
  colorways,
  selectedColorway,
  onSelect,
}: ColorwaySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-sans uppercase tracking-widest text-muted font-bold">
          Select Colorway
        </span>
        <span className="text-xs font-sans font-medium text-charcoal">
          {selectedColorway}
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {colorways.map((colorway) => {
          const hexColor = COLORWAY_MAP[colorway] || '#CCCCCC';
          const isActive = selectedColorway === colorway;

          return (
            <button
              key={colorway}
              onClick={() => onSelect(colorway)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-sans font-medium cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'border-charcoal bg-white text-charcoal shadow-sm'
                  : 'border-border bg-transparent text-charcoal/60 hover:border-charcoal/30'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] shrink-0"
                style={{ backgroundColor: hexColor }}
              />
              {colorway}
            </button>
          );
        })}
      </div>
    </div>
  );
}
