"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X } from "lucide-react"
import { SvgRenderer } from "./svg-renderer"
import type { SvgData, ColorData, PathData } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ColorEditorProps {
    svg: SvgData | null
    pathColors: Record<string, string>
    showBorders: boolean
    onShowBordersChange: (show: boolean) => void
    onPathColorsChange: (
        colors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
    ) => void
    onSave: (updatedSvg: SvgData) => void
}

export function ColorEditor({
    svg,
    pathColors,
    showBorders,
    onShowBordersChange,
    onPathColorsChange,
    onSave,
}: ColorEditorProps) {
    const [selectedColors, setSelectedColors] = useState<ColorData[]>([])
    const [selectedPathId, setSelectedPathId] = useState<string | null>(null)

    // Reset selected path when svg changes
    useEffect(() => {
        setSelectedPathId(null)
    }, [])

    const handlePathSelect = useCallback(
        (pathId: string) => {
            if (!svg) return

            const selectedPath = svg.paths.find((p) => p.id === pathId)
            if (!selectedPath) return

            const selectedFillColor = selectedPath.fill || "red" // Default to "red" if no fill color

            // Find all paths with the same color
            const matchingPaths = svg.paths.filter((p) => p.fill === selectedFillColor).map((p) => p.id)

            setSelectedPathId((prevSelected) => (prevSelected === pathId ? null : pathId))

            onPathColorsChange((prev: Record<string, string>) => {
                const updatedColors = { ...prev }
                matchingPaths.forEach((id) => {
                    updatedColors[id] = updatedColors[id] || selectedFillColor
                })
                return updatedColors
            })
        },
        [svg, onPathColorsChange],
    )

    const handleSave = useCallback(() => {
        if (!svg) return

        // Create updated SVG with new colors
        const updatedSvg: SvgData = {
            ...svg,
            paths: svg.paths.map((path) => ({
                ...path,
                fill: pathColors[path.id] || path.fill,
            })),
        }

        onSave(updatedSvg)
    }, [svg, pathColors, onSave])

    const handleColorSelect = useCallback(
        (color: string) => {
            if (!selectedPathId) return

            const newColor: ColorData = {
                id: `${selectedPathId}-${color}`,
                color,
                name: `Color ${color}`,
            }

            onPathColorsChange((prev: Record<string, string>) => ({
                ...prev,
                [selectedPathId]: color,
            }))

            if (!selectedColors.some((c) => c.color === color)) {
                setSelectedColors((prev) => [...prev, newColor])
            }
        },
        [selectedPathId, selectedColors, onPathColorsChange],
    )

    const handleRemoveColor = useCallback(
        (colorToRemove: string) => {
            const updatedPathColors = { ...pathColors }

            Object.keys(updatedPathColors).forEach((pathId) => {
                if (updatedPathColors[pathId] === colorToRemove) {
                    delete updatedPathColors[pathId]
                }
            })

            onPathColorsChange(updatedPathColors)
            setSelectedColors((prev) => prev.filter((c) => c.color !== colorToRemove))
        },
        [pathColors, onPathColorsChange],
    )

    if (!svg) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Color Editor</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                        Select a tile to edit colors
                    </div>
                </CardContent>
            </Card>
        )
    }

    const selectedPath: PathData | undefined = selectedPathId ? svg.paths.find((p) => p.id === selectedPathId) : undefined

    const selectedPathColor: string | undefined = selectedPathId ? pathColors[selectedPathId] : undefined

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Color Editor</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                    <div className="space-y-4">
                        {/* SVG Preview (Click to select a path) */}
                        <div className="border border-border rounded-md overflow-hidden flex justify-center items-center p-4 h-48">
                            <SvgRenderer
                                svg={svg}
                                selectedPathId={selectedPathId}
                                pathColors={pathColors}
                                onPathSelect={handlePathSelect}
                            />
                        </div>

                        {/* Show all SVG colors (Click to apply to selected path) */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">ALL SVG COLORS:</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(
                                    new Set([
                                        ...Object.values(pathColors),
                                        ...svg.paths.map((p) => p.fill).filter((color): color is string => Boolean(color)),
                                    ]),
                                ).map((color, index) => (
                                    <div
                                        key={index}
                                        className={`w-8 h-8 rounded border border-border cursor-pointer transition-transform 
                    hover:scale-110 ${selectedPathColor === color ? "ring-2 ring-primary" : ""}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            if (selectedPathId && color !== undefined) {
                                                handleColorSelect(color)
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Selected Path Info */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">SELECTED PATH:</h3>
                            <div className="p-2 bg-muted/50 rounded">
                                {selectedPath ? (
                                    <div className="flex items-center justify-between">
                                        <span>{selectedPath.id}</span>
                                        <div
                                            className="w-6 h-6 rounded-sm border border-border"
                                            style={{ backgroundColor: pathColors[selectedPath.id] || selectedPath.fill || "red" }}
                                        />
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">Click on a path to select it</span>
                                )}
                            </div>
                        </div>

                        {/* Border Controls */}
                        <div className="space-y-2">
                            <Button
                                variant={showBorders ? "default" : "outline"}
                                className="w-full"
                                onClick={() => onShowBordersChange(!showBorders)}
                            >
                                {showBorders ? (
                                    <>
                                        <X className="mr-2 h-4 w-4" />
                                        Remove Borders
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Borders
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Selected Colors */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">COLORS USED:</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(pathColors).map((color, index) => (
                                    <div
                                        key={index}
                                        className="w-8 h-8 rounded border border-border cursor-pointer relative group"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleRemoveColor(color)}
                                        title="Click to remove"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20">
                                            <X className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Color Palette */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Select Color:</h3>
                            <div className="grid grid-cols-8 gap-1">
                                {colorPalette.map((color, index) => (
                                    <button
                                        key={index}
                                        className={`w-6 h-6 rounded-sm border transition-transform hover:scale-110 ${selectedPathColor === color ? "border-primary ring-2 ring-primary/20" : "border-border"
                                            }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorSelect(color)}
                                        disabled={!selectedPathId}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button className="w-full mt-4" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

const colorPalette = [
    "#f5f5f0",
    "#e6e6d8",
    "#d8d8c0",
    "#ccccb3",
    "#bfbfa8",
    "#b3b39e",
    "#a6a693",
    "#999989",
    "#8c8c7f",
    "#000000",
    "#595959",
    "#404040",
    "#262626",
    "#666666",
    "#808080",
    "#999999",
    "#d9e6f2",
    "#c6d9e6",
    "#b3ccd9",
    "#a0bfcc",
    "#8cb3bf",
    "#79a6b3",
    "#6699a6",
    "#538099",
    "#d9e6d9",
    "#c6d9c6",
    "#b3ccb3",
    "#a0bfa0",
    "#8cb38c",
    "#79a679",
    "#669966",
    "#538053",
    "#f2d9d9",
    "#e6c6c6",
    "#d9b3b3",
    "#cca0a0",
    "#bf8c8c",
    "#b37979",
    "#a66666",
    "#995353",
    "#f2e6d9",
    "#e6d9c6",
    "#d9ccb3",
    "#ccbfa0",
    "#bfb38c",
    "#b3a679",
    "#a69966",
    "#998c53",
    "#ff5733",
    "#33ff57",
    "#3357ff",
    "#ff33a1",
    "#a133ff",
    "#33ffa1",
    "#ffeb33",
    "#ff3362",
]

