"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, X, CreditCard, Banknote, ShoppingCart } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  { id: 1, name: "T-Shirt", price: 19.99 },
  { id: 2, name: "Jeans", price: 49.99 },
  { id: 3, name: "Sneakers", price: 79.99 },
  { id: 4, name: "Hat", price: 14.99 },
  { id: 5, name: "Socks", price: 9.99 },
  { id: 6, name: "Jacket", price: 89.99 },
  { id: 7, name: "Dress", price: 59.99 },
  { id: 8, name: "Skirt", price: 39.99 },
]

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [showCart, setShowCart] = useState(false)

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const CartComponent = () => (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Cart</CardTitle>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowCart(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 -mx-4 px-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 px-4">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">${(item.price * item.quantity).toFixed(2)}</div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Input placeholder="Add a note" />
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full" disabled={cart.length === 0}>
              <CreditCard className="mr-2 h-4 w-4" /> Card
            </Button>
            <Button className="w-full" disabled={cart.length === 0}>
              <Banknote className="mr-2 h-4 w-4" /> Cash
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 relative h-[calc(100vh-4rem)]">
        {/* Product Grid */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Products</CardTitle>
              <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setShowCart(true)}>
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <Tabs defaultValue="all" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                <ScrollArea className="flex-1">
                  <TabsContent value="all" className="mt-0 h-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {products.map((product) => (
                        <Button
                          key={product.id}
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center text-center p-2"
                          onClick={() => addToCart(product)}
                        >
                          <div className="font-semibold">{product.name}</div>
                          <div>${product.price.toFixed(2)}</div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="favorites" className="mt-0 h-full">
                    <div className="text-center text-muted-foreground">No favorites added yet.</div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Cart - Desktop and Tablet */}
        <div className="w-full lg:w-96 hidden lg:block overflow-hidden">
          <CartComponent />
        </div>

        {/* Cart - Mobile */}
        <div className={`fixed inset-0 bg-background z-50 lg:hidden ${showCart ? "flex" : "hidden"} flex-col`}>
          <div className="flex-1 overflow-hidden p-4">
            <CartComponent />
          </div>
        </div>
      </div>
    </Layout>
  )
}

