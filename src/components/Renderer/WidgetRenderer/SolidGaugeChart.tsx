import React, { useMemo, useRef, useEffect, useState } from "react";
import { useColorMode } from "@chakra-ui/react";
import { useLatestESSData } from "../../../hooks/ess/useLatestESSData";

interface SolidGaugeChartProps {
  width?: number;
}

const SolidGaugeChart: React.FC<SolidGaugeChartProps> = ({ width = 420 }) => {
  const keys = useMemo(() => ["soc"], []);
  const { data } = useLatestESSData(keys);
  const { colorMode } = useColorMode();

  // ---------- NEEDLE PHYSICS ----------
  const [displayValue, setDisplayValue] = useState(0);
  const targetRef = useRef(0);

  useEffect(() => {
    if (!data?.length) return;

    const avg =
      data.reduce((s: number, r: any) => s + Number(r.soc || 0), 0) /
      data.length;

    targetRef.current = Math.max(0, Math.min(100, avg));
  }, [data]);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      setDisplayValue((prev) => {
        const diff = targetRef.current - prev;
        if (Math.abs(diff) < 0.02) return targetRef.current;
        return prev + diff * 0.2;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pct = displayValue;

  // ---------- THEME ----------
  const isDark = colorMode === "dark";
  const bgArc = isDark ? "#1e1e1e" : "#e6e6e6";
  const rimOuter = isDark ? "#0b0b0b" : "#ffffff";
  const rimInner = isDark ? "#2a2a2a" : "#d0d0d0";
  const textColor = isDark ? "#ffffff" : "#111111";
  const tickColor = isDark ? "#bbb" : "#444";

  // ---------- GEOMETRY ----------
  const size = width;
  const height = size * 0.62;
  const cx = size / 2;
  const cy = size * 0.58;
  const radius = size * 0.42;

  const startAngle = -120;
  const endAngle = 120;
  const totalAngle = endAngle - startAngle;

  const needleAngle = startAngle + (pct / 100) * totalAngle;

  const polar = (r: number, a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const arc = (r: number, s: number, e: number) => {
    const start = polar(r, e);
    const end = polar(r, s);
    const large = e - s <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
  };

  const head = polar(radius * 0.82, needleAngle);
  const tail = polar(radius * 0.18, needleAngle + 180);

  // ---------- SEGMENTS ----------
  const segmentColors = [
    "#12D622", // green
    "#7EE83F", // light green
    "#FFD739", // yellow
    "#FF8C1A", // orange
    "#FF2929", // red
  ];

  const segments = segmentColors.length;
  const gapAngle = 3; // cut between segments
  const segmentAngle = totalAngle / segments;

  // ---------- TICKS (minor only, no numbers) ----------
  const minorTicks = 50;
  const ticks = Array.from({ length: minorTicks + 1 }, (_, i) => {
    const angle = startAngle + (i / minorTicks) * totalAngle;
    const p1 = polar(radius * 0.93, angle);
    const p2 = polar(radius * 0.98, angle);
    return { p1, p2 };
  });

  const uid = useRef(`gauge-${Math.random().toString(36).slice(2)}`).current;

  return (
    <div style={{ width: size, textAlign: "center", userSelect: "none" }}>
      <svg width={size} height={height}>
        <defs>
          <filter id={`${uid}-shadow`}>
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.6" />
          </filter>

          <linearGradient id={`${uid}-glass`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff55" />
            <stop offset="45%" stopColor="#ffffff15" />
            <stop offset="100%" stopColor="#ffffff00" />
          </linearGradient>
        </defs>

        {/* Rim */}
        <circle cx={cx} cy={cy} r={radius * 1.08} fill={rimOuter} />
        <circle cx={cx} cy={cy} r={radius * 1.02} fill={rimInner} />

        {/* Segmented arcs with gap */}
        {segmentColors.map((color, i) => {
          const segStart =
            startAngle + i * segmentAngle + gapAngle / 2;
          const segEnd =
            startAngle +
            (i + 1) * segmentAngle -
            gapAngle / 2;

          return (
            <path
              key={i}
              d={arc(radius, segStart, segEnd)}
              stroke={color}
              strokeWidth={radius * 0.22}
              fill="none"
            />
          );
        })}

        {/* Minor ticks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.p1.x}
            y1={t.p1.y}
            x2={t.p2.x}
            y2={t.p2.y}
            stroke={tickColor}
            strokeWidth={1}
          />
        ))}

        {/* Needle shadow */}
        <line
          x1={tail.x}
          y1={tail.y}
          x2={head.x}
          y2={head.y}
          stroke="#000"
          strokeWidth={7}
          strokeLinecap="round"
          filter={`url(#${uid}-shadow)`}
        />

        {/* Needle */}
        <line
          x1={tail.x}
          y1={tail.y}
          x2={head.x}
          y2={head.y}
          stroke={isDark ? "#fff" : "#111"}
          strokeWidth={3.5}
          strokeLinecap="round"
        />

        {/* Hub */}
        <circle cx={cx} cy={cy} r={12} fill={rimOuter} />
        <circle cx={cx} cy={cy} r={8} fill={rimInner} />
        <circle cx={cx} cy={cy} r={4} fill={isDark ? "#777" : "#999"} />

        {/* Glass */}
        <ellipse
          cx={cx}
          cy={cy - radius * 0.3}
          rx={radius * 0.9}
          ry={radius * 0.45}
          fill={`url(#${uid}-glass)`}
        />
      </svg>

      {/* Center value */}
      <div
        style={{
          marginTop: -10,
          fontSize: 32,
          fontWeight: 700,
          color: textColor,
        }}
      >
        {Math.round(pct)}%
      </div>
    </div>
  );
};

export default SolidGaugeChart;
