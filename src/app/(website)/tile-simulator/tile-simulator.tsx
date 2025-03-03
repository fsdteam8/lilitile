"use client"

import { useState } from "react"
import { TileSelection } from "@/components/tile-selection"
import { ColorEditor } from "@/components/svg-editor/color-editor"
import { parseSvgString } from "@/components/svg-editor/svg-parser"
import type { SvgData } from "@/components/svg-editor/types"
import EnvironmentSelector from "@/components/view-panel"
import Sidebar from "@/components/Sidebar"

interface Tile {
  id: string
  name: string
  collection: string
  svg: string
}

// Static SVG string for initial display in Color Editor
const staticSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect x="10" y="10" width="80" height="00" fill="#ccc" />
</svg>`

// Placeholder SVG for View Panel
const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="400">
  <rect x="10" y="10" width="80" height="40" fill="#f0f0f0" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#999">No Tile Selected</text>
</svg>`

export default function TileSimulator() {
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
  const [currentSvg, setCurrentSvg] = useState<SvgData | null>(parseSvgString(staticSvgString, "static"))
  const [selectedCategory, setSelectedCategory] = useState<string>("geometric")
  const [showBorders, setShowBorders] = useState<boolean>(false)
  const [pathColors, setPathColors] = useState<Record<string, string>>({})

  const handleTileSelect = (tile: Tile) => {
    setSelectedTile(tile)
    if (tile.svg) {
      setCurrentSvg(parseSvgString(tile.svg, tile.id))
    }
  }

  const handleColorSelect = (pathId: string, color: { id: string; color: string; name: string }) => {
    setPathColors((prev) => ({
      ...prev,
      [pathId]: color.color,
    }))
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedTile(null)
    setCurrentSvg(parseSvgString(staticSvgString, "static")) // Reset to static SVG
    setPathColors({})
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex gap-x-10 w-full h-full p-6">
          {/* Category Selector */}
          <div className="border rounded-lg shadow-sm overflow-hidden w-[200px]">
          <Sidebar selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} categories={[]} />
          </div>
          {/* Left Panel - Categories and Tile Selection */}
          <div className="flex flex-col gap-6 w-[300px]">
            {/* Tile Selection */}
            <div className="flex-1 border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  TILE SELECTION
                </h2>
                <p className="text-xs text-center text-gray-500 mt-1">(SCROLL FOR MORE OPTIONS)</p>
              </div>
              <TileSelection onTileSelect={handleTileSelect} selectedTile={selectedTile} category={selectedCategory} />
            </div>
          </div>

          {/* Color Editor Panel */}
          <div className="border rounded-lg shadow-sm overflow-hidden w-[350px]">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-center bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                COLOR EDITOR
              </h2>
            </div>
            {currentSvg ? (
              <ColorEditor
                svg={currentSvg}
                showBorders={showBorders}
                setShowBorders={setShowBorders}
                onColorSelect={handleColorSelect}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">Select a tile to edit its colors</div>
            )}
          </div>

          {/* View Panel */}
          <div className="flex-1 border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-center bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                VIEW
              </h2>
            </div>
            <EnvironmentSelector
              currentSvg={currentSvg || parseSvgString(placeholderSvg, "placeholder")} // Use placeholder if no tile is selected
              pathColors={pathColors}
              showBorders={showBorders}
            />

          </div>
        </div>
      </div>
    </div>
  )
}