"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useItems, type Item, type Volume } from "./items-context"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Minus, Trash2, ImageIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ItemModalProps {
  isOpen: boolean
  onClose: () => void
  item?: Item
}

export function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  const { addItem, updateItem, categories } = useItems()
  const [imageError, setImageError] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Item, "id">>({
    name: "",
    category: "",
    stock: 0,
    price: 0,
    brand: "",
    type: "",
    image: "",
    description: "",
    sku: "",
    isOil: false,
    volumes: []
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        stock: item.stock,
        price: item.price,
        brand: item.brand || "",
        type: item.type || "",
        image: item.image || "",
        description: item.description || "",
        sku: item.sku || "",
        isOil: item.isOil || false,
        volumes: item.volumes || [],
        basePrice: item.basePrice
      })
    } else {
      setFormData({
        name: "",
        category: "",
        stock: 0,
        price: 0,
        brand: "",
        type: "",
        image: "",
        description: "",
        sku: "",
        isOil: false,
        volumes: []
      })
    }
  }, [item])

  useEffect(() => {
    if (formData.image && (formData.image.startsWith('http') || formData.image.startsWith('/'))) {
      setImageUrl(formData.image)
      setImageError(false)
    } else {
      setImageUrl(null)
    }
  }, [formData.image])

  useEffect(() => {
    if (!isOpen) {
      setImageError(false)
      setImageUrl(null)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (item) {
      updateItem(item.id, formData)
    } else {
      addItem(formData)
    }
    onClose()
  }

  const addVolume = () => {
    setFormData(prev => ({
      ...prev,
      volumes: [...(prev.volumes || []), { size: "", price: 0 }]
    }))
  }

  const updateVolume = (index: number, field: keyof Volume, value: string | number) => {
    setFormData(prev => {
      const volumes = [...(prev.volumes || [])]
      volumes[index] = { ...volumes[index], [field]: value }
      return { ...prev, volumes }
    })
  }

  const removeVolume = (index: number) => {
    setFormData(prev => ({
      ...prev,
      volumes: (prev.volumes || []).filter((_, i) => i !== index)
    }))
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] h-[95vh] max-h-[95vh] md:h-auto md:max-w-2xl rounded-lg overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6 px-1">
            <div className="flex justify-center">
              <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] border-2 border-border rounded-lg overflow-hidden bg-muted">
                {!imageError && formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.name || "Product image"}
                    className="object-contain w-full h-full p-2"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/product.jpg"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-20"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOil"
                checked={formData.isOil}
                onCheckedChange={(checked) => setFormData({ ...formData, isOil: !!checked })}
              />
              <Label htmlFor="isOil">This is an oil product</Label>
            </div>

            {formData.isOil && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Volume Options</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVolume}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Volume
                  </Button>
                </div>
                <ScrollArea className="h-[200px] border rounded-md p-4">
                  <div className="space-y-4">
                    {formData.volumes?.map((volume, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <Input
                          placeholder="Size (e.g., 5L)"
                          value={volume.size}
                          onChange={(e) => updateVolume(index, "size", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={volume.price}
                          onChange={(e) => updateVolume(index, "price", Number(e.target.value))}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVolume(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button type="submit">{item ? "Update" : "Add"} Item</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

