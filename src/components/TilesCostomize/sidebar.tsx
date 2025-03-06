"use client"

import { cn } from "@/lib/utils"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

interface Category {
    id: string
    name: string
}

interface TileSidebarProps {
    categories: Category[]
    selectedCategoryId: string | null
    onCategorySelect: (categoryId: string) => void
}

export function TileSidebar({ categories, selectedCategoryId, onCategorySelect }: TileSidebarProps) {
    return (
        <Sidebar className="border-r">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-bold text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        TILES LIBRARY
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {categories.map((category) => (
                                <SidebarMenuItem key={category.id}>
                                    <SidebarMenuButton
                                        onClick={() => onCategorySelect(category.id)}
                                        className={cn(
                                            "flex items-center justify-between",
                                            selectedCategoryId === category.id && "bg-primary/10 font-medium",
                                        )}
                                    >
                                        <span className="capitalize">{category.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}

