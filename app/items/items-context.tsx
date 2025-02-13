"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

export interface Item {
  id: string
  name: string
  category: string
  stock: number
  price: number
}

interface ItemsContextType {
  items: Item[]
  categories: string[]
  addItem: (item: Omit<Item, "id">) => void
  updateItem: (id: string, item: Partial<Item>) => void
  deleteItem: (id: string) => void
  duplicateItem: (id: string) => void
  addCategory: (category: string) => void
  removeCategory: (category: string) => void
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

export const useItems = () => {
  const context = useContext(ItemsContext)
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider")
  }
  return context
}

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "T-Shirt", category: "Clothing", stock: 100, price: 19.99 },
    { id: "2", name: "Jeans", category: "Clothing", stock: 50, price: 49.99 },
    { id: "3", name: "Sneakers", category: "Footwear", stock: 75, price: 79.99 },
  ])

  const [categories, setCategories] = useState<string[]>(["Clothing", "Footwear", "Accessories", "Electronics"])

  const addItem = useCallback((newItem: Omit<Item, "id">) => {
    setItems((prevItems) => [...prevItems, { ...newItem, id: uuidv4() }])
  }, [])

  const updateItem = useCallback((id: string, updatedItem: Partial<Item>) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)))
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const duplicateItem = useCallback((id: string) => {
    setItems((prevItems) => {
      const itemToDuplicate = prevItems.find((item) => item.id === id)
      if (!itemToDuplicate) return prevItems

      const duplicatedItems = prevItems.filter(
        (item) => item.name.startsWith(`${itemToDuplicate.name} (`) && item.name.endsWith(")"),
      )
      const newName = `${itemToDuplicate.name} (${duplicatedItems.length + 1})`

      return [...prevItems, { ...itemToDuplicate, id: uuidv4(), name: newName }]
    })
  }, [])

  const addCategory = useCallback((category: string) => {
    setCategories((prev) => [...new Set([...prev, category])])
  }, [])

  const removeCategory = useCallback((category: string) => {
    setCategories((prev) => prev.filter((c) => c !== category))
    setItems((prevItems) => prevItems.map((item) => (item.category === category ? { ...item, category: "" } : item)))
  }, [])

  // Use effect to log changes in categories (for debugging)
  useEffect(() => {
    console.log("Categories updated:", categories)
  }, [categories])

  return (
    <ItemsContext.Provider
      value={{
        items,
        categories,
        addItem,
        updateItem,
        deleteItem,
        duplicateItem,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </ItemsContext.Provider>
  )
}

