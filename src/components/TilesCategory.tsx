"use client"

import { cn } from "@/lib/utils"

interface Category {
    id: string
    name: string
    description: string
    image: string
}

interface CategorySelectorProps {
    categories: Category[]
    selectedCategory: string | null
    onCategorySelect: (categoryId: string) => void
}

const categories: Category[] = [
    {
        id: "geometric",
        name: "Geometric",
        description: "Modern geometric patterns with clean lines and shapes",
        image: "/categories/geometric.svg",
    },
    {
        id: "floral",
        name: "Floral",
        description: "Elegant floral patterns and natural motifs",
        image: "/categories/floral.svg",
    },
    {
        id: "abstract",
        name: "Abstract",
        description: "Contemporary abstract designs and patterns",
        image: "/categories/abstract.svg",
    },
    {
        id: "traditional",
        name: "Traditional",
        description: "Classic patterns inspired by traditional designs",
        image: "/categories/traditional.svg",
    },
]

export function CategorySelector({ selectedCategory, onCategorySelect }: CategorySelectorProps) {
    return (
        <div className="p-4 space-y-4">
            <h2 className="text-lg font-bold text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                CATEGORIES
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategorySelect(category.id)} 
                        className={cn(
                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all p-4",
                            selectedCategory === category.id
                                ? "border-primary shadow-lg scale-[0.98]"
                                : "border-border hover:border-primary/50",
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/20" />
                        <div className="relative z-10 h-full flex flex-col justify-end">
                            <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export { categories }

