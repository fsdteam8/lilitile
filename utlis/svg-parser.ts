import type { SvgData, PathData } from "@/components/types";

/**
 * Parses an SVG string and converts it to the SvgData format.
 * Ensures DOMParser is only used on the client side.
 */
export function parseSvgString(svgString: string): SvgData {
  if (typeof window === "undefined") {
    // If running on the server, return an empty object or handle differently
    throw new Error("DOMParser is not available on the server.");
  }

  // Client-side parsing using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    throw new Error("Invalid SVG string");
  }

  // Extract viewBox, width, and height
  const viewBox = svgElement.getAttribute("viewBox") || "0 0 100 100";
  const width = svgElement.getAttribute("width")
    ? Number.parseInt(svgElement.getAttribute("width")!.replace("px", ""), 10)
    : undefined;
  const height = svgElement.getAttribute("height")
    ? Number.parseInt(svgElement.getAttribute("height")!.replace("px", ""), 10)
    : undefined;

  // Extract all path elements
  const pathElements = svgElement.querySelectorAll("path");
  const paths: PathData[] = [];

  pathElements.forEach((pathElement, index) => {
    const d = pathElement.getAttribute("d");
    if (!d) return;

    let fill = pathElement.getAttribute("fill");
    if (!fill || fill === "none") {
      fill = "#000000";
    }

    const id = pathElement.getAttribute("id") || `path-${index}`;

    paths.push({
      id,
      d,
      fill,
    });
  });

  return { viewBox, width, height, paths };
}

/**
 * Converts a tile with an SVG string to a tile with SvgData.
 * Ensures it only runs on the client side.
 */
export function convertTileWithSvgString(tile: any): any {
  if (!tile.svg) return tile;

  try {
    if (typeof window === "undefined") {
      console.warn(`Skipping SVG parsing for tile ${tile.id} on server.`);
      return tile;
    }

    const svgData = parseSvgString(tile.svg);
    return { ...tile, svgData };
  } catch (error) {
    console.error(`Error parsing SVG for tile ${tile.id}:`, error);
    return tile;
  }
}

/**
 * Converts all tiles in categories from SVG strings to SvgData.
 * Ensures it only runs on the client side.
 */
export function convertTileCategories(categories: any[]): any[] {
  if (typeof window === "undefined") {
    console.warn("Skipping SVG parsing on the server.");
    return categories;
  }

  return categories.map((category) => ({
    ...category,
    tiles: category.tiles.map(convertTileWithSvgString),
  }));
}
