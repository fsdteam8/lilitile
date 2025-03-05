"use client"

import { useState, useEffect, useCallback } from "react"
import { TileSidebar } from "@/components/Tile-Customize/sidebar"
import { TileSelection } from "@/components/Tile-Customize/tile-selection"
import { ColorEditor } from "@/components/Tile-Customize/color-editor"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import EnvironmentSelector from "@/components/Tile-Customize/enviroment-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SvgData } from "@/components/types"
import { tileCategories } from "@/data/tileCategory"

interface Tile {
    id: string
    name: string
    svgData: SvgData
}



export default function TileDesigner() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
    const [pathColors, setPathColors] = useState<Record<string, string>>({})
    const [showBorders, setShowBorders] = useState(false)

    // Get the selected category
    const selectedCategory = selectedCategoryId
        ? tileCategories.find((cat) => cat.id === selectedCategoryId) || null
        : null

    // Initialize pathColors when a tile is selected
    useEffect(() => {
        if (selectedTile) {
            const initialPathColors: Record<string, string> = {}
            selectedTile.svgData.paths.forEach((path) => {
                if (path.fill) {
                    initialPathColors[path.id] = path.fill
                }
            })
            setPathColors(initialPathColors)
        } else {
            setPathColors({})
        }
    }, [selectedTile])

    const handleCategorySelect = useCallback((categoryId: string) => {
        setSelectedCategoryId(categoryId)
    }, [])

    const handleTileSelect = useCallback((tile: Tile) => {
        setSelectedTile(tile)
    }, [])

    const handlePathColorsChange = useCallback(
        (newColors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => {
            setPathColors(newColors)
        },
        [],
    )

    const handleShowBordersChange = useCallback((show: boolean) => {
        setShowBorders(show)
    }, [])

    const handleSaveTileColors = useCallback(
        (updatedSvg: SvgData) => {
            if (!selectedTile || !selectedCategory) return

            // Create updated tile with new SVG data
            const updatedTile: Tile = {
                ...selectedTile,
                svgData: updatedSvg,
            }

            // Update the tile in the category
            const categoryIndex = tileCategories.findIndex((cat) => cat.id === selectedCategory.id)
            if (categoryIndex >= 0) {
                const tileIndex = tileCategories[categoryIndex].tiles.findIndex((t: Tile) => t.id === selectedTile.id)
                if (tileIndex >= 0) {
                    tileCategories[categoryIndex].tiles[tileIndex] = updatedTile
                }
            }

            // Update the selected tile
            setSelectedTile(updatedTile)
        },
        [selectedTile, selectedCategory],
    )

    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <TileSidebar
                    categories={tileCategories}
                    selectedCategoryId={selectedCategoryId}
                    onCategorySelect={handleCategorySelect}
                />

                <SidebarInset className="p-4 overflow-auto">
                    <div className="max-w-full mx-auto">
                        <h1 className="text-3xl font-bold mb-4">Tile Designer</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Left column - Tile Selection */}
                            <div className="lg:col-span-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Tile Selection</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <TileSelection category={selectedCategory} onTileSelect={handleTileSelect} />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Middle column - Color Editor */}
                            <div className="lg:col-span-3">
                                <ColorEditor
                                    svg={selectedTile?.svgData || null}
                                    pathColors={pathColors}
                                    showBorders={showBorders}
                                    onShowBordersChange={handleShowBordersChange}
                                    onPathColorsChange={handlePathColorsChange}
                                    onSave={handleSaveTileColors}
                                />
                            </div>

                            {/* Right column - Environment Preview */}
                            <div className="lg:col-span-5">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Environment Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedTile ? (
                                            <EnvironmentSelector
                                                currentSvg={selectedTile.svgData}
                                                pathColors={pathColors}
                                                showBorders={showBorders}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                                Select a tile to preview in environments
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

