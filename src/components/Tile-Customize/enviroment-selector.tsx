"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { SvgData } from "@/components/types";

const environments = [
    { id: "kitchen", icon: "/icons/kitchen.png", image: "/bedroom_old2.png" },
    { id: "bedroom", icon: "/icons/bedroom.png", image: "/bathroom.png" },
    { id: "office", icon: "/icons/office.png", image: "/commercial_old.png" },
];

interface Props {
    currentSvg: SvgData | null;
    pathColors?: Record<string, string>;
    showBorders?: boolean;
}

export default function EnvironmentSelector({
    currentSvg,
    pathColors = {},
    showBorders = false,
}: Props) {
    const [selectedEnv, setSelectedEnv] = useState(environments[0]);
    const [svgBackground, setSvgBackground] = useState<string>("");

    useEffect(() => {
        if (!currentSvg) return;

        // Create SVG string with current colors and borders
        const svgString = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="${currentSvg.viewBox}"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern 
            id="tilePattern" 
            patternUnits="userSpaceOnUse" 
            width="200" 
            height="200" 
            patternTransform="rotate(0)"
          >
            <svg
              viewBox="${currentSvg.viewBox}"
              width="200"
              height="200"
            >
              ${currentSvg.paths
                .map(
                    (path) => `
                <path
                  id="${path.id}"
                  d="${path.d}"
                  fill="${pathColors[path.id] || path.fill || "#ffffff"}"
                  stroke="${showBorders ? "#000000" : "none"}"
                  strokeWidth="${showBorders ? "1" : "0"}"
                />
              `
                )
                .join("")}
            </svg>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tilePattern)" />
      </svg>
    `;

        // Convert SVG to data URL
        const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
        setSvgBackground(svgDataUrl);
    }, [currentSvg, pathColors, showBorders]);

    return (
        <div className="flex flex-col items-center">
            {/* Environment Image with SVG pattern overlay */}
            <div className={`relative w-full h-96 rounded-lg overflow-hidden`}>
                {/* Base environment image */}

                {currentSvg && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(
                                `<svg viewBox="${currentSvg.viewBox}" width="${currentSvg.width
                                }" height="${currentSvg.height
                                }" xmlns="http://www.w3.org/2000/svg">
${currentSvg.paths
                                    .map(
                                        (path) => `<path
           id="${path.id}"
           d="${path.d}"
           fill="${pathColors[path.id] || path.fill || "#ffffff"}"
           stroke="${showBorders ? "#000000" : "none"}"
           stroke-width="${showBorders ? "1" : "0"}"
           />`
                                    )
                                    .join("")}
</svg>`
                            )}')`,
                            backgroundSize: "50px 50px",
                            backgroundRepeat: "repeat",
                            opacity: 0.85,
                            mixBlendMode: "multiply",
                            transform: "perspective(1000px) rotateX(0deg)",
                            transformOrigin: "center top",
                            // height: "50%", 
                            // top: 0, 
                        }}
                    />
                )}

                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${svgBackground})`,
                        backgroundSize: "cover",
                    }}
                >
                    <Image
                        src={selectedEnv.image || "/placeholder.svg"}
                        alt="Environment"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>
            </div>

            {/* Environment Selector */}
            <div className="mt-6 flex gap-4">
                {environments.map((env) => (
                    <button
                        key={env.id}
                        className={`p-2 border rounded-lg transition-all ${selectedEnv.id === env.id
                                ? "border-blue-500 shadow-md scale-105"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                        onClick={() => setSelectedEnv(env)}
                    >
                        <div className="relative w-16 h-16 overflow-hidden rounded">
                            <Image
                                src={env.image || "/placeholder.svg"}
                                alt={env.id}
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <p className="text-xs mt-1 text-center capitalize">{env.id}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
