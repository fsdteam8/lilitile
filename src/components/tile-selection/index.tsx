"use client"


import { ScrollArea } from "@/components/ui/scroll-area"
import { tiles } from "@/data/TileSelection"
import { cn } from "@/lib/utils"

interface Tile {
	id: string
	name: string
	collection: string
	svg: string
	preview?: string
	
}

interface TileSelectionProps {
	onTileSelect: (tile: Tile) => void
	selectedTile: Tile | null
	category: string
}



export function TileSelection({ onTileSelect, selectedTile, category }: TileSelectionProps) {
	// Filter tiles by selected category
	const filteredTiles = tiles.filter((tile) => tile.collection.toLowerCase() === category.toLowerCase())

	return (
		<ScrollArea className="h-full">
			<div className="p-4 space-y-4">
				{/* Tiles Grid */}
				<div className="grid grid-cols-2 gap-4">
					{filteredTiles.map((tile) => (
						<button
							key={tile.id}
							onClick={() => onTileSelect(tile)}
							className={cn(
								"relative aspect-square rounded-lg overflow-hidden border-2 transition-all p-4 bg-white",
								selectedTile?.id === tile.id
									? "border-primary shadow-lg scale-[0.98]"
									: "border-border hover:border-primary/50",
							)}
						>
							<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: tile.svg }} />
							<div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2">
								<p className="text-sm font-medium text-center truncate">{tile.name}</p>
							</div>
						</button>
					))}
				</div>
			</div>
		</ScrollArea>
	)
}



