import type { PathData, SvgData } from "@/components/TilesCostomize/types";

/**
 * Parses an SVG string and converts it to the SvgData format
 */
export function parseSvgString(svgString: string): SvgData | null {
  // Ensure this runs only in the browser
  if (typeof window === "undefined") {
    console.warn("Skipping SVG parsing on the server.");
    return null; // Return null on the server to prevent errors
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (!svgElement) {
      throw new Error("Invalid SVG string");
    }

    // Extract viewBox, width, and height
    const viewBox = svgElement.getAttribute("viewBox") || "0 0 100 100";
    const width = svgElement.getAttribute("width")
      ? parseInt(svgElement.getAttribute("width")!.replace("px", ""), 10)
      : undefined;
    const height = svgElement.getAttribute("height")
      ? parseInt(svgElement.getAttribute("height")!.replace("px", ""), 10)
      : undefined;

    // Extract all path elements
    const paths: PathData[] = Array.from(svgElement.querySelectorAll("path"))
      .map((pathElement, index) => {
        const d = pathElement.getAttribute("d");
        if (!d) return null;

        let fill = pathElement.getAttribute("fill") || "#000000";
        if (fill === "none") fill = "#000000";

        const id = pathElement.getAttribute("id") || `path-${index}`;

        return { id, d, fill };
      })
      .filter(Boolean) as PathData[]; // Remove null values

    return { viewBox, width, height, paths };
  } catch (error) {
    console.error("Error parsing SVG:", error);
    return null;
  }
}

/**
 * Converts a tile with an SVG string to a tile with SvgData
 */
interface Tile {
  id: string;
  name: string;
  svg?: string;
  svgData: SvgData | null;
}

interface Category {
  id: string;
  name: string;
  tiles: Tile[];
}

export function convertTileWithSvgString(tile: Tile): Tile {
  if (!tile.svg) return tile;
  console.log(tile);

  const svgData =
    typeof window !== "undefined" ? parseSvgString(tile.svg) : null;
  return { ...tile, svgData };
}

/**
 * Converts all tiles in categories from SVG strings to SvgData
 */
interface TileWithSvg {
  id: string;
  name: string;
  svg: string;
}

interface CategoryWithSvg {
  id: string;
  name: string;
  tiles: TileWithSvg[];
}

export function convertTileCategories(
  categories: CategoryWithSvg[]
): Category[] {
  return categories.map((category) => ({
    ...category,
    tiles: category.tiles.map((tile) => ({
      ...tile,
      svgData: typeof window !== "undefined" ? parseSvgString(tile.svg) : null,
    })),
  }));
}
