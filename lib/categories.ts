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

  categories.forEach((category: string) => {
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
    <div className={`
      ${level === 0 ? '' : 'ml-4 border-l border-zinc-800/50 mt-1'}
    `}>
      {Array.from(categories.entries()).map(([key, category]) => (
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
              ${selectedCategory === category.fullPath ? 'text-orange-400' : 'text-white'}
              ${level === 0 ? 'border-b border-zinc-800/50 last:border-none' : ''}
            `}
            onClick={() => handleCategoryClick(category.fullPath)}
          >
            <div className="flex items-center gap-2">
              {category.children.size > 0 && (
                <ChevronRight 
                  className={`
                    h-4 w-4 
                    text-zinc-400 
                    transition-transform 
                    duration-200
                    ${expandedCategories.has(category.fullPath) ? 'rotate-90' : ''}
                  `}
                  onClick={(e) => toggleCategory(category.fullPath, e)}
                />
              )}
              <span className="select-none">{category.name}</span>
            </div>
          </div>
          {category.children.size > 0 && expandedCategories.has(category.fullPath) && (
            <div className="overflow-hidden">
              {renderCategoryLevel(
                category.children,
                selectedCategory,
                expandedCategories,
                handleCategoryClick,
                toggleCategory,
                level + 1
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 