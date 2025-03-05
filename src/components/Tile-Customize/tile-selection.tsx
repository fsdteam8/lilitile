"use client"
import { useCallback } from "react"
import type { SvgData } from "./types"

interface Tile {
    id: string
    name: string
    svgData: SvgData
}

interface Category {
    id: string
    name: string
    tiles: Tile[]
}

interface TileSelectionProps {
    category: Category | null
    onTileSelect: (tile: Tile) => void
}

export function TileSelection({ category, onTileSelect }: TileSelectionProps) {
    const handleTileSelect = useCallback(
        (tile: Tile) => {
            onTileSelect(tile)
        },
        [onTileSelect],
    )

    if (!category) {
        return (
            <div className="text-center py-8 text-muted-foreground">Select a category from the sidebar to view tiles</div>
        )
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {category.name.toUpperCase()} TILES
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {category.tiles.map((tile) => (
                    <div key={tile.id} className="cursor-pointer group" onClick={() => handleTileSelect(tile)}>
                        <div className="aspect-square border rounded-lg p-3 flex items-center justify-center bg-background hover:bg-muted/50 transition-colors group-hover:border-primary">
                            <svg viewBox={tile.svgData.viewBox} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                {tile.svgData.paths.map((path) => (
                                    <path key={path.id} d={path.d} fill={path.fill || "red"} />
                                ))}
                            </svg>
                        </div>

                        <p className="mt-2 text-xs text-center truncate">{tile.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

