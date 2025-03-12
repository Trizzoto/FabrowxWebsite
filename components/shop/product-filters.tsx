"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = [
  { id: "exhaust-systems", name: "Exhaust Systems" },
  { id: "4wd-accessories", name: "4WD Accessories" },
  { id: "performance-parts", name: "Performance Parts" },
  { id: "engine-components", name: "Engine Components" },
  { id: "chassis-components", name: "Chassis Components" },
  { id: "forced-induction", name: "Forced Induction" },
]

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sort, setSort] = useState("featured")

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(","))
    }

    const sortParam = searchParams.get("sort")
    if (sortParam) {
      setSort(sortParam)
    }
  }, [searchParams])

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams()

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }

    if (sort !== "featured") {
      params.set("sort", sort)
    }

    router.push(`/shop?${params.toString()}`)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) => {
      if (checked) {
        return [...prev, category]
      } else {
        return prev.filter((c) => c !== category)
      }
    })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
  }

  const handleApplyFilters = () => {
    updateFilters()
  }

  const handleResetFilters = () => {
    setSelectedCategories([])
    setSort("featured")
    router.push("/shop")
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleResetFilters}>
          Reset
        </Button>
      </div>

      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Sort by: {sort.charAt(0).toUpperCase() + sort.slice(1)}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuRadioGroup value={sort} onValueChange={handleSortChange}>
              <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Accordion type="single" collapsible defaultValue="category">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full mt-4" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  )
}

