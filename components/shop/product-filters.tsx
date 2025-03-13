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
  { id: "fabrication", name: "Fabrication" },
  { id: "performance", name: "Performance" },
  { id: "protection", name: "Protection" },
  { id: "4wd-accessories", name: "4WD Accessories" },
  { id: "custom-work", name: "Custom Work" },
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

    router.push(`/products?${params.toString()}`)
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
    router.push("/products")
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetFilters}
          className="text-zinc-400 hover:text-white hover:bg-orange-600"
        >
          Reset
        </Button>
      </div>

      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between border-zinc-700 hover:bg-orange-600 hover:text-white"
            >
              Sort by: {sort.charAt(0).toUpperCase() + sort.slice(1)}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] bg-zinc-900 border-zinc-800">
            <DropdownMenuRadioGroup value={sort} onValueChange={handleSortChange}>
              <DropdownMenuRadioItem value="featured" className="hover:bg-orange-600">Featured</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="price-asc" className="hover:bg-orange-600">Price: Low to High</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="price-desc" className="hover:bg-orange-600">Price: High to Low</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name-asc" className="hover:bg-orange-600">Name: A to Z</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium mb-3">Categories</h4>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              className="border-zinc-700 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
            />
            <Label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category.name}
            </Label>
          </div>
        ))}
      </div>

      <Button 
        onClick={handleApplyFilters} 
        className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
      >
        Apply Filters
      </Button>
    </div>
  )
}

