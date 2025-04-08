import { ChevronRight } from 'lucide-react'
import React from 'react'

export interface CategoryLevel {
  name: string
  fullPath: string
  children: Map<string, CategoryLevel>
}

export function buildCategoryTree(categories: string[]): Map<string, CategoryLevel> {
  const tree = new Map<string, CategoryLevel>()
  
  if (!categories || categories.length === 0) {
    return tree
  }

  // Sort categories first to ensure consistent order
  const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b))

  sortedCategories.forEach((category: string) => {
    const parts = category.split(' > ')
    let currentMap = tree
    let currentPath = ''

    parts.forEach((part: string, index: number) => {
      currentPath = currentPath ? `${currentPath} > ${part}` : part
      if (!currentMap.has(part)) {
        currentMap.set(part, {
          name: part,
          fullPath: currentPath,
          children: new Map()
        })
      }
      if (index < parts.length - 1) {
        currentMap = currentMap.get(part)!.children
      }
    })
  })

  // Sort each level of the tree
  function sortMapInPlace(map: Map<string, CategoryLevel>): Map<string, CategoryLevel> {
    return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])))
  }

  function recursiveSort(map: Map<string, CategoryLevel>): Map<string, CategoryLevel> {
    const sortedMap = sortMapInPlace(map)
    for (const [_, value] of sortedMap) {
      value.children = recursiveSort(value.children)
    }
    return sortedMap
  }

  return recursiveSort(tree)
}

export interface RenderCategoryLevelProps {
  categories: Map<string, CategoryLevel>
  selectedCategory: string
  expandedCategories: Set<string>
  handleCategoryClick: (path: string) => void
  toggleCategory: (path: string, e: React.MouseEvent) => void
  level?: number
  products?: any[] // Add products array to count items in categories
}

export function renderCategoryLevel(props: RenderCategoryLevelProps): JSX.Element | null {
  const {
    categories,
    selectedCategory,
    expandedCategories,
    handleCategoryClick,
    toggleCategory,
    level = 0,
    products = []
  } = props

  if (!categories || categories.size === 0) {
    return null
  }

  // Function to count products in a category (including subcategories)
  const countProductsInCategory = (categoryPath: string): number => {
    return products.filter(product => 
      product.category === categoryPath || 
      product.category.startsWith(categoryPath + ' > ')
    ).length
  }

  return (
    <div className={`
      ${level === 0 ? '' : 'ml-4 border-l border-zinc-800/50 mt-1 pl-2'}
    `}>
      {Array.from(categories.entries()).map(([key, category]) => {
        const productCount = countProductsInCategory(category.fullPath)
        // Skip categories with no products unless they have children with products
        if (productCount === 0 && category.children.size === 0) {
          return null
        }
        
        return (
          <div 
            key={category.fullPath}
            className="relative group"
          >
            <div
              className={`
                flex items-center justify-between
                px-4 py-2
                rounded-lg
                hover:bg-orange-500/10
                cursor-pointer
                transition-all
                duration-200
                ${selectedCategory === category.fullPath ? 'bg-orange-500/20 text-orange-400 font-medium border-orange-500/30' : 'text-white hover:border-orange-500/30'}
                ${level === 0 ? 'border border-zinc-800/50 mb-1' : 'border border-transparent'}
              `}
              onClick={() => handleCategoryClick(category.fullPath)}
            >
              <div className="flex items-center gap-2 flex-1">
                {category.children.size > 0 && (
                  <ChevronRight 
                    className={`
                      h-4 w-4 
                      text-zinc-400 
                      transition-transform 
                      duration-200
                      ${expandedCategories.has(category.fullPath) ? 'rotate-90' : ''}
                      hover:text-orange-400
                    `}
                    onClick={(e) => toggleCategory(category.fullPath, e)}
                  />
                )}
                <span className="select-none truncate">{category.name}</span>
              </div>
              <span className="text-sm text-zinc-500 ml-2">{productCount}</span>
            </div>
            {category.children.size > 0 && expandedCategories.has(category.fullPath) && (
              <div className="overflow-hidden">
                {renderCategoryLevel({
                  categories: category.children,
                  selectedCategory,
                  expandedCategories,
                  handleCategoryClick,
                  toggleCategory,
                  level: level + 1,
                  products
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 