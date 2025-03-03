"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import type { SvgData } from "../svg-editor/types"
import { Label } from "../ui/label"
import { Select } from "../ui/select"

interface ViewPanelProps {
  selectedTile: string | null
  currentSvg: SvgData | null
  selectedEnvironment: string
  setSelectedEnvironment: (environment: string) => void
  pathColors: Record<string, string>
  showBorders: boolean
}

const environments = [
  {
    id: "kitchen",
    name: "Kitchen",
    image: "/environments/kitchen.jpg",
    className: "bg-[url('/environments/kitchen.jpg')]",
  },
  {
    id: "bathroom",
    name: "Bathroom",
    image: "/environments/bathroom.jpg",
    className: "bg-[url('/environments/bathroom.jpg')]",
  },
  {
    id: "living-room",
    name: "Living Room",
    image: "/environments/living-room.jpg",
    className: "bg-[url('/environments/living-room.jpg')]",
  },
  // Add more environments as needed
]

export function ViewPanel({
  currentSvg,
  selectedEnvironment,
  setSelectedEnvironment,
  pathColors,
}: ViewPanelProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  // Update preview when SVG or colors change
  useEffect(() => {
    if (!currentSvg || !previewRef.current) return

    const previewSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    previewSvg.setAttribute("viewBox", currentSvg.viewBox)
    previewSvg.setAttribute("width", "100%")
    previewSvg.setAttribute("height", "100%")

    currentSvg.paths.forEach((path) => {
      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
      pathElement.setAttribute("d", path.d)
      pathElement.setAttribute("fill", pathColors[path.id] || path.fill || "#FFFFFF")
      previewSvg.appendChild(pathElement)
    })

    previewRef.current.innerHTML = ""
    previewRef.current.appendChild(previewSvg)
  }, [currentSvg, pathColors])

  return (
    <div className="p-4 space-y-6">
      {/* Environment Selection */}
      <div className="space-y-2">
        <Label>Environment</Label>
        <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
          {environments.map((env) => (
            <option key={env.id} value={env.id}>
              {env.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Preview Area */}
      <div className="relative aspect-video rounded-lg overflow-hidden">
        {/* Environment Background */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            environments.find((env) => env.id === selectedEnvironment)?.className,
          )}
        />

        {/* SVG Preview */}
        {currentSvg && <div ref={previewRef} className="absolute inset-0 flex items-center justify-center p-12" />}

        {/* Empty State */}
        {!currentSvg && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Select a tile to preview</p>
          </div>
        )}
      </div>

      {/* Environment Preview Grid */}
      <div className="grid grid-cols-3 gap-4">
        {environments.map((env) => (
          <button
            key={env.id}
            onClick={() => setSelectedEnvironment(env.id)}
            className={cn(
              "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
              selectedEnvironment === env.id
                ? "border-primary shadow-lg scale-[0.98]"
                : "border-border hover:border-primary/50",
            )}
          >
            <div className={cn("absolute inset-0 bg-cover bg-center", env.className)} />
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1">
              <p className="text-xs font-medium text-center">{env.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

