"use client";

import { useMemo, useRef, useState } from "react";

type Item = { label: string; color?: string };

export default function SpinWheel({
  items,
  onFinish,
  size = 320,
  spinSeconds = 4,
}: {
  items: Item[];
  onFinish: (index: number) => void;
  size?: number;
  spinSeconds?: number;
}) {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segAngle = 360 / items.length;
  const radius = size / 2;

  const colors = useMemo(
    () =>
      items.map(
        (it, i) =>
          it.color ||
          `hsl(${Math.round((i * 360) / items.length)}, 70%, 55%)`
      ),
    [items]
  );

  function spin() {
    if (spinning) return;
    setSpinning(true);
    // random spins: 5–8 full turns plus random offset
    const full = 360 * (5 + Math.floor(Math.random() * 4));
    const offset = Math.random() * 360;
    const target = angle + full + offset;
    setAngle(target);

    // finish after transition
    setTimeout(() => {
      const normalized = ((target % 360) + 360) % 360; // 0..359
      // pointer is at 0deg (top). Segment index is reversed because rotation direction.
      const idx =
        (items.length -
          Math.floor(normalized / segAngle) -
          1 +
          items.length) %
        items.length;
      onFinish(idx);
      setSpinning(false);
    }, spinSeconds * 1000 + 50);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-3 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "18px solid #111",
          }}
        />
        {/* wheel */}
        <div
          ref={wheelRef}
          className="rounded-full overflow-hidden shadow"
          style={{
            width: size,
            height: size,
            transition: `transform ${spinSeconds}s cubic-bezier(.12,.62,.1,1)`,
            transform: `rotate(${angle}deg)`,
          }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {items.map((it, i) => {
              const start = (i * segAngle * Math.PI) / 180;
              const end = ((i + 1) * segAngle * Math.PI) / 180;
              const x1 = radius + radius * Math.cos(start);
              const y1 = radius + radius * Math.sin(start);
              const x2 = radius + radius * Math.cos(end);
              const y2 = radius + radius * Math.sin(end);
              const largeArc = segAngle > 180 ? 1 : 0;
              const path = `
                M ${radius} ${radius}
                L ${x1} ${y1}
                A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                Z
              `;
              return (
                <g key={i}>
                  <path d={path} fill={colors[i]} />
                  <text
                    x={radius}
                    y={radius}
                    transform={`rotate(${(i + 0.5) * segAngle} ${radius} ${radius}) translate(${radius *
                      0.62} ${4}) rotate(90)`}
                    fontSize="12"
                    textAnchor="middle"
                    fill="#111"
                  >
                    {it.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-4 rounded-xl px-5 py-3 bg-black text-white disabled:opacity-50"
      >
        {spinning ? "Spinning…" : "Spin"}
      </button>
    </div>
  );
}
