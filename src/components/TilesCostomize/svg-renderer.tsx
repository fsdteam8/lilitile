"use client"

import { useCallback } from "react"
import type { SvgData } from "./types"

interface SvgRendererProps {
    svg: SvgData
    selectedPathId: string | null
    pathColors: Record<string, string>
    onPathSelect: (pathId: string) => void
}

export function SvgRenderer({ svg, selectedPathId, pathColors, onPathSelect }: SvgRendererProps) {
    const handlePathClick = useCallback(
        (pathId: string) => {
            onPathSelect(pathId)
        },
        [onPathSelect],
    )

    return (
        <svg
            viewBox={svg.viewBox}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            className="max-w-full max-h-full"
        >
            {svg.paths.map((path) => {
                const isSelected = selectedPathId === path.id
                const pathColor = pathColors[path.id] || path.fill || "#000000"

                return (
                    <path
                        key={path.id}
                        id={path.id}
                        d={path.d}
                        fill={pathColor}
                        stroke={isSelected ? "black" : "none"}
                        strokeWidth={isSelected ? 2 : 0}
                        onClick={() => handlePathClick(path.id)}
                        style={{ cursor: "pointer" }}
                    />
                )
            })}
        </svg>
    )
}

