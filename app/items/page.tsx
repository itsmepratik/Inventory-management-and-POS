"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { ItemsProvider, useItems, type Item } from "./items-context"
import { ItemModal } from "./item-modal"
import { toast } from "@/components/ui/use-toast"
import { CategoryModal } from "./category-modal"
import { useUser } from "../user-context"

function ItemsPageContent() {
  const { currentUser } = useUser()

  if (currentUser?.role === "staff") {
    return <div className="text-center py-8">You don't have permission to access this page.</div>
  }

  const { items, categories, deleteItem, duplicateItem } = useItems()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all-categories")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  // Reset category filter if selected category is removed
  useEffect(() => {
    if (categoryFilter !== "all-categories" && !categories.includes(categoryFilter)) {
      setCategoryFilter("all-categories")
    }
  }, [categories, categoryFilter])

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const toggleAll = () => {
    setSelectedItems((prev) => (prev.length === items.length ? [] : items.map((item) => item.id)))
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteItem(id)
    toast({
      title: "Item deleted",
      description: "The item has been successfully deleted.",
    })
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all-categories" || item.category === categoryFilter),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:flex-1 md:mr-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-10" onClick={() => setIsCategoryModalOpen(true)}>
              Manage Categories
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="h-10" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create item
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="h-12 px-4 text-left align-middle font-medium">
                  <Checkbox checked={selectedItems.length === filteredItems.length} onCheckedChange={toggleAll} />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">Item</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Stock</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Price</th>
                <th className="h-12 w-[40px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">
                    <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => toggleItem(item.id)} />
                  </td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">{item.stock}</td>
                  <td className="p-4">${item.price.toFixed(2)}</td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>Edit item</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            duplicateItem(item.id)
                            toast({
                              title: "Item duplicated",
                              description: "A copy of the item has been created.",
                            })
                          }}
                        >
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
                          Delete item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(undefined)
        }}
        item={editingItem}
      />
      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </div>
  )
}

export default function ItemsPage() {
  return (
    <Layout>
      <ItemsProvider>
        <ItemsPageContent />
      </ItemsProvider>
    </Layout>
  )
}

