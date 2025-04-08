import { ChevronRight } from "lucide-react"
import React from 'react'

export interface CategoryLevel {
  name: string
  fullPath: string
  children: Map<string, CategoryLevel>
  count?: number
}

export function buildCategoryTree(categories: string[]): Map<string, CategoryLevel> {
  const tree = new Map<string, CategoryLevel>()
  
  if (!categories || categories.length === 0) {
    return tree
  }

  // Sort categories alphabetically
  const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b))

  // Create a flat structure
  sortedCategories.forEach((category: string) => {
    tree.set(category, {
      name: category,
      fullPath: category,
      children: new Map(),
    })
  })

  return tree
}

export function renderCategoryLevel(
  categories: Map<string, CategoryLevel>,
  selectedCategory: string,
  expandedCategories: Set<string>,
  handleCategoryClick: (path: string) => void,
  toggleCategory: (path: string, e: React.MouseEvent) => void,
  level: number = 0
): JSX.Element | null {
  if (!categories || categories.size === 0) {
    return null
  }

  return (
    <div className="space-y-1">
      {Array.from(categories.entries()).map(([key, category]: [string, CategoryLevel]) => (
        <div 
          key={category.fullPath}
          className="relative"
        >
          <div
            className={`
              flex items-center justify-between
              px-4 py-2
              hover:bg-orange-500/10
              cursor-pointer
              transition-all
              duration-200
              rounded-lg
              ${selectedCategory === category.fullPath ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-white hover:bg-zinc-800/50'} 
              border border-zinc-800/50 hover:border-orange-500/30
            `}
            onClick={() => handleCategoryClick(category.fullPath)}
          >
            <span className="select-none">{category.name}</span>
            {category.count !== undefined && (
              <span className="text-sm text-zinc-500">{category.count}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 