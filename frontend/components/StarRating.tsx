"use client";

import { useState } from "react";

export function StarRating({ value = 0, onChange, readOnly = false }: { value?: number; onChange?: (v: number) => void; readOnly?: boolean; }) {
  const [hover, setHover] = useState<number | null>(null);
  const stars = [1, 2, 3, 4, 5];
  const current = hover ?? Math.round(value || 0);
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(s)}
          onMouseLeave={() => !readOnly && setHover(null)}
          onClick={() => !readOnly && onChange && onChange(s)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${s} star`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={s <= current ? "#f59e0b" : "#e5e7eb"}
            className="w-5 h-5"
          >
            <path d="M11.48 3.499a.75.75 0 011.04 0l2.348 2.348a.75.75 0 00.564.22l3.322-.221a.75.75 0 01.421 1.373l-2.63 1.903a.75.75 0 00-.283.838l.916 3.2a.75.75 0 01-1.14.832l-2.77-1.682a.75.75 0 00-.78 0l-2.77 1.682a.75.75 0 01-1.14-.832l.917-3.2a.75.75 0 00-.283-.838L4.825 7.219a.75.75 0 01.421-1.373l3.322.22a.75.75 0 00.564-.22l2.348-2.347z" />
          </svg>
        </button>
      ))}
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-600">{current}/5</span>
      )}
    </div>
  );
}
