"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Minus,
  X,
  CreditCard,
  Banknote,
  ShoppingCart,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ImageIcon,
  Check
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Add cache configuration
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour
export const fetchCache = 'force-cache'

interface OilProduct {
  id: number
  brand: string
  name: string
  basePrice: number
  type: string
  image?: string
  volumes: {
    size: string
    price: number
  }[]
}

interface Product {
  id: number
  name: string
  price: number
  category: 'Filters' | 'Parts' | 'Additives'
  brand?: string
  type?: string
}

interface CartItem extends Omit<Product, 'category'> {
  quantity: number
  details?: string
  uniqueId: string
}

interface SelectedVolume {
  size: string
  quantity: number
  price: number
}

// Updated oil products data structure
const oilProducts: OilProduct[] = [
  {
    id: 101,
    brand: "Toyota",
    name: "0W-20",
    basePrice: 39.99,
    type: "0W-20",
    image: "/oils/toyota-0w20.jpg",
    volumes: [
      { size: "5L", price: 39.99 },
      { size: "4L", price: 34.99 },
      { size: "1L", price: 11.99 },
      { size: "500ml", price: 6.99 },
      { size: "250ml", price: 3.99 },
    ]
  },
  {
    id: 102,
    brand: "Toyota",
    name: "5W-30",
    basePrice: 39.99,
    type: "5W-30",
    image: "/oils/toyota-5w30.jpg",
    volumes: [
      { size: "5L", price: 39.99 },
      { size: "4L", price: 34.99 },
      { size: "1L", price: 11.99 },
      { size: "500ml", price: 6.99 },
      { size: "250ml", price: 3.99 },
    ]
  },
  {
    id: 103,
    brand: "Toyota",
    name: "10W-30",
    basePrice: 39.99,
    type: "10W-30",
    image: "/oils/toyota-10w30.jpg",
    volumes: [
      { size: "5L", price: 39.99 },
      { size: "4L", price: 34.99 },
      { size: "1L", price: 11.99 },
      { size: "500ml", price: 6.99 },
      { size: "250ml", price: 3.99 },
    ]
  },
  {
    id: 201,
    brand: "Shell",
    name: "0W-20",
    basePrice: 45.99,
    type: "0W-20",
    image: "/oils/shell-0w20.jpg",
    volumes: [
      { size: "5L", price: 45.99 },
      { size: "4L", price: 39.99 },
      { size: "1L", price: 13.99 },
      { size: "500ml", price: 7.99 },
      { size: "250ml", price: 4.99 },
    ]
  },
  {
    id: 202,
    brand: "Shell",
    name: "5W-30",
    basePrice: 45.99,
    type: "5W-30",
    image: "/oils/shell-5w30.jpg",
    volumes: [
      { size: "5L", price: 45.99 },
      { size: "4L", price: 39.99 },
      { size: "1L", price: 13.99 },
      { size: "500ml", price: 7.99 },
      { size: "250ml", price: 4.99 },
    ]
  },
  {
    id: 203,
    brand: "Shell",
    name: "10W-40",
    basePrice: 35.99,
    type: "10W-40",
    image: "/oils/shell-10w40.jpg",
    volumes: [
      { size: "5L", price: 35.99 },
      { size: "4L", price: 31.99 },
      { size: "1L", price: 11.99 },
      { size: "500ml", price: 6.99 },
      { size: "250ml", price: 3.99 },
    ]
  },
  {
    id: 301,
    brand: "Lexus",
    name: "0W-20",
    basePrice: 49.99,
    type: "0W-20",
    image: "/oils/lexus-0w20.jpg",
    volumes: [
      { size: "5L", price: 49.99 },
      { size: "4L", price: 43.99 },
      { size: "1L", price: 14.99 },
      { size: "500ml", price: 8.99 },
      { size: "250ml", price: 5.99 },
    ]
  },
  {
    id: 302,
    brand: "Lexus",
    name: "5W-30",
    basePrice: 49.99,
    type: "5W-30",
    image: "/oils/lexus-5w30.jpg",
    volumes: [
      { size: "5L", price: 49.99 },
      { size: "4L", price: 43.99 },
      { size: "1L", price: 14.99 },
      { size: "500ml", price: 8.99 },
      { size: "250ml", price: 5.99 },
    ]
  }
]

const products: Product[] = [
  // Toyota Filters
  { id: 3, name: "Oil Filter - Standard", price: 12.99, category: "Filters", brand: "Toyota", type: "Oil Filter" },
  { id: 4, name: "Air Filter - Standard", price: 15.99, category: "Filters", brand: "Toyota", type: "Air Filter" },
  { id: 9, name: "Cabin Filter - Standard", price: 11.99, category: "Filters", brand: "Toyota", type: "Cabin Filter" },
  { id: 10, name: "Oil Filter - Premium", price: 19.99, category: "Filters", brand: "Toyota", type: "Oil Filter" },
  { id: 11, name: "Air Filter - Premium", price: 24.99, category: "Filters", brand: "Toyota", type: "Air Filter" },
  { id: 12, name: "Cabin Filter - Premium", price: 21.99, category: "Filters", brand: "Toyota", type: "Cabin Filter" },

  // Honda Filters
  { id: 31, name: "Oil Filter - Basic", price: 11.99, category: "Filters", brand: "Honda", type: "Oil Filter" },
  { id: 32, name: "Air Filter - Basic", price: 14.99, category: "Filters", brand: "Honda", type: "Air Filter" },
  { id: 35, name: "Cabin Filter - Basic", price: 12.99, category: "Filters", brand: "Honda", type: "Cabin Filter" },
  { id: 37, name: "Oil Filter - Premium", price: 18.99, category: "Filters", brand: "Honda", type: "Oil Filter" },
  { id: 38, name: "Air Filter - Premium", price: 22.99, category: "Filters", brand: "Honda", type: "Air Filter" },
  { id: 39, name: "Cabin Filter - Premium", price: 20.99, category: "Filters", brand: "Honda", type: "Cabin Filter" },

  // Nissan Filters
  { id: 33, name: "Oil Filter - Standard", price: 13.99, category: "Filters", brand: "Nissan", type: "Oil Filter" },
  { id: 34, name: "Air Filter - Standard", price: 16.99, category: "Filters", brand: "Nissan", type: "Air Filter" },
  { id: 36, name: "Cabin Filter - Standard", price: 13.99, category: "Filters", brand: "Nissan", type: "Cabin Filter" },
  { id: 40, name: "Oil Filter - Premium", price: 20.99, category: "Filters", brand: "Nissan", type: "Oil Filter" },
  { id: 41, name: "Air Filter - Premium", price: 25.99, category: "Filters", brand: "Nissan", type: "Air Filter" },
  { id: 42, name: "Cabin Filter - Premium", price: 22.99, category: "Filters", brand: "Nissan", type: "Cabin Filter" },

  // Other Products
  { id: 5, name: "Brake Pads", price: 45.99, category: "Parts" },
  { id: 6, name: "Spark Plugs", price: 8.99, category: "Parts" },
  { id: 7, name: "Fuel System Cleaner", price: 14.99, category: "Additives" },
  { id: 8, name: "Oil Treatment", price: 11.99, category: "Additives" },
]

// Memoize the cart item component
const CartItem = memo(({ 
  item, 
  updateQuantity, 
  removeFromCart 
}: { 
  item: CartItem
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void 
}) => (
  <div className="flex items-center justify-between py-3 first:pt-0">
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center text-[clamp(0.875rem,2vw,1rem)]">{item.quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
    <div className="flex-1 px-3">
      <div className="font-medium text-[clamp(0.875rem,2vw,1rem)] line-clamp-1">{item.name}</div>
      <div className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-muted-foreground">${item.price.toFixed(2)} each</div>
    </div>
    <div className="flex items-center gap-2">
      <div className="text-right font-medium text-[clamp(0.875rem,2vw,1rem)] whitespace-nowrap">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
))
CartItem.displayName = 'CartItem'

// Memoize the product button component
const ProductButton = memo(({ product, addToCart }: { product: Product, addToCart: (product: Product) => void }) => (
  <Button
    key={product.id}
    variant="outline"
    className="h-auto py-6 flex flex-col items-center justify-center text-center p-4 hover:shadow-md transition-all"
    onClick={() => addToCart(product)}
  >
    <div className="font-semibold text-base mb-2">{product.name}</div>
    <div className="text-lg font-medium text-primary">${product.price.toFixed(2)}</div>
  </Button>
))
ProductButton.displayName = 'ProductButton'

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("Oil")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [showClearCartDialog, setShowClearCartDialog] = useState(false)
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null)
  const [selectedOil, setSelectedOil] = useState<OilProduct | null>(null)
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false)
  const [selectedVolumes, setSelectedVolumes] = useState<SelectedVolume[]>([])
  const [selectedFilterBrand, setSelectedFilterBrand] = useState<string | null>(null)
  const [selectedFilterType, setSelectedFilterType] = useState<string | null>(null)
  const [isFilterBrandModalOpen, setIsFilterBrandModalOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([])
  const [filterImageError, setFilterImageError] = useState(false)
  const [oilImageError, setOilImageError] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'cash' | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Memoize handlers
  const removeFromCart = useCallback((productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      setCart((prevCart) => prevCart.map((item) => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }, [removeFromCart])

  const addToCart = useCallback((product: { id: number; name: string; price: number }, details?: string, quantity: number = 1) => {
    const uniqueId = `${product.id}-${details || ''}`
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.uniqueId === uniqueId
      )
      if (existingItem) {
        return prevCart.map((item) =>
          item.uniqueId === uniqueId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevCart, { ...product, quantity, details, uniqueId }]
    })
  }, [])

  const handleOilSelect = useCallback((oil: OilProduct) => {
    setSelectedOil(oil)
    setSelectedVolumes([])
    setIsVolumeModalOpen(true)
  }, [])

  const handleVolumeClick = (volume: { size: string; price: number }) => {
    setSelectedVolumes(prev => {
      const existing = prev.find(v => v.size === volume.size)
      if (existing) {
        return prev.map(v =>
          v.size === volume.size
            ? { ...v, quantity: v.quantity + 1 }
            : v
        )
      }
      return [...prev, { ...volume, quantity: 1 }]
    })
  }

  const handleQuantityChange = (size: string, change: number) => {
    setSelectedVolumes(prev => {
      const updated = prev.map(v =>
        v.size === size
          ? { ...v, quantity: Math.max(0, v.quantity + change) }
          : v
      ).filter(v => v.quantity > 0)
      return updated
    })
  }

  const handleAddSelectedToCart = () => {
    selectedVolumes.forEach(volume => {
      if (selectedOil) {
        addToCart(
          {
            id: selectedOil.id,
            name: selectedOil.name,
            price: volume.price,
          },
          `${volume.size}`,
          volume.quantity
        )
      }
    })
    setIsVolumeModalOpen(false)
    setSelectedOil(null)
    setSelectedVolumes([])
  }

  const handleNextItem = () => {
    // Add current selection to cart
    handleAddSelectedToCart()

    // Navigate to Filters section and close modal
    setActiveCategory("Filters")
    setIsVolumeModalOpen(false)
    setSelectedOil(null)
    setSelectedVolumes([])
    setSearchQuery("") // Clear search when changing categories
  }

  const oilBrands = Array.from(new Set(oilProducts.map(oil => oil.brand)))

  const filterBrands = Array.from(
    new Set(products.filter(p => p.category === "Filters").map(p => p.brand!))
  )

  const filterTypes = Array.from(
    new Set(products.filter(p => p.category === "Filters").map(p => p.type!))
  )

  const getFiltersByType = (type: string) =>
    products.filter(product =>
      product.category === "Filters" &&
      product.type === type
    )

  // Memoize filtered data
  const filteredOilBrands = useMemo(() => 
    oilBrands.filter(brand => 
      brand.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery, oilBrands]
  )

  const filteredProducts = useMemo(() => 
    activeCategory === "Oil"
      ? []
      : products.filter((product) => {
          const matchesCategory = product.category === activeCategory
          const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
          return matchesCategory && matchesSearch
        }), [activeCategory, searchQuery]
  )

  const total = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  )

  const handleFilterClick = (filter: Product) => {
    setSelectedFilters(prev => {
      const existing = prev.find(f => f.id === filter.id)
      if (existing) {
        return prev.map(f =>
          f.id === filter.id
            ? { ...f, quantity: f.quantity + 1 }
            : f
        )
      }
      return [...prev, { ...filter, quantity: 1 }]
    })
  }

  const handleFilterQuantityChange = (filterId: number, change: number) => {
    setSelectedFilters(prev => {
      const updated = prev.map(f =>
        f.id === filterId
          ? { ...f, quantity: Math.max(0, f.quantity + change) }
          : f
      ).filter(f => f.quantity > 0)
      return updated
    })
  }

  const handleAddSelectedFiltersToCart = () => {
    selectedFilters.forEach(filter => {
      addToCart(
        {
          id: filter.id,
          name: filter.name,
          price: filter.price,
        },
        undefined,
        filter.quantity
      )
    })
    setIsFilterBrandModalOpen(false)
    setSelectedFilters([])
    setSelectedFilterType(null)
  }

  const handleNextFilterItem = () => {
    handleAddSelectedFiltersToCart()
    setActiveCategory("Parts")
    setSearchQuery("")
  }

  const clearCart = () => {
    setCart([])
    setShowClearCartDialog(false)
  }

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true)
  }

  const handlePaymentComplete = () => {
    setShowSuccess(true)
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-5rem)] flex flex-col pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Point of Sale</h1>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* Product Grid */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <Card className="flex-1 overflow-hidden flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 flex-shrink-0">
                <CardTitle className="text-xl sm:text-2xl">Products</CardTitle>
                <Button variant="outline" size="icon" className="lg:hidden h-10 w-10 relative" onClick={() => setShowCart(true)}>
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col p-6 min-h-0">
                <Tabs value={activeCategory} className="flex-1 flex flex-col min-h-0" onValueChange={setActiveCategory}>
                  <div className="space-y-6 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={`Search in ${activeCategory}...`}
                        className="pl-9 h-10 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 gap-1">
                      <TabsTrigger value="Oil">Oil</TabsTrigger>
                      <TabsTrigger value="Filters">Filters</TabsTrigger>
                      <TabsTrigger value="Parts">Parts</TabsTrigger>
                      <TabsTrigger value="Additives">Additives</TabsTrigger>
                    </TabsList>
                  </div>
                  <ScrollArea className="flex-1 mt-6 -mx-2 px-2">
                    <div className="grid grid-cols-1 gap-4">
                      {activeCategory === "Oil" ? (
                        // Show oil brands with dropdown
                        filteredOilBrands.map((brand) => (
                          <div key={brand} className="border rounded-lg overflow-hidden">
                            <Button
                              variant="ghost"
                              className="w-full p-4 flex items-center justify-between hover:bg-accent"
                              onClick={() => setExpandedBrand(expandedBrand === brand ? null : brand)}
                            >
                              <span className="font-semibold text-lg">{brand}</span>
                              {expandedBrand === brand ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </Button>
                            {expandedBrand === brand && (
                              <div className="p-4 bg-muted/50 space-y-2">
                                {oilProducts.filter(oil => oil.brand === brand).map((oil) => (
                                  <Button
                                    key={oil.id}
                                    variant="outline"
                                    className="w-full justify-between py-3 px-4"
                                    onClick={() => handleOilSelect(oil)}
                                  >
                                    <span>{oil.type}</span>
                                    <span className="text-primary">${oil.basePrice.toFixed(2)}</span>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : activeCategory === "Filters" ? (
                        // Show filter types with dropdown
                        <div className="grid grid-cols-1 gap-4">
                          {filterTypes
                            .filter(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((type) => (
                              <div key={type} className="border rounded-lg overflow-hidden">
                                <Button
                                  variant="ghost"
                                  className="w-full p-4 flex items-center justify-between hover:bg-accent"
                                  onClick={() => setSelectedFilterType(selectedFilterType === type ? null : type)}
                                >
                                  <span className="font-semibold text-lg">{type}</span>
                                  {selectedFilterType === type ? (
                                    <ChevronUp className="h-5 w-5" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5" />
                                  )}
                                </Button>
                                {selectedFilterType === type && (
                                  <div className="p-4 bg-muted/50 space-y-2">
                                    {filterBrands.map((brand) => (
                                      <Button
                                        key={brand}
                                        variant="outline"
                                        className="w-full justify-between py-3 px-4"
                                        onClick={() => {
                                          setSelectedFilterBrand(brand)
                                          setSelectedFilters([])
                                          setIsFilterBrandModalOpen(true)
                                        }}
                                      >
                                        <span>{brand}</span>
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        // Show other category products
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                          {filteredProducts.map((product) => (
                            <ProductButton
                              key={product.id}
                              product={product}
                              addToCart={addToCart}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Cart - Desktop and Tablet */}
          <div className="w-full lg:w-[400px] hidden lg:flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 flex-shrink-0">
                <CardTitle className="text-xl">Cart</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[clamp(0.875rem,2vw,1rem)] text-muted-foreground hover:text-destructive"
                  onClick={() => setShowClearCartDialog(true)}
                  disabled={cart.length === 0}
                >
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-6 min-h-0">
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  <ScrollArea className="flex-1 -mx-4 px-4 h-[calc(100%-8rem)]">
                    <div className="space-y-3 pb-2">
                      {cart.map((item) => (
                        <CartItem
                          key={item.uniqueId}
                          item={item}
                          updateQuantity={updateQuantity}
                          removeFromCart={removeFromCart}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="pt-6 mt-auto border-t">
                    <div className="flex justify-between text-[clamp(1rem,2.5vw,1.125rem)] font-semibold mb-4">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <Button 
                      className="w-full h-[clamp(2.5rem,6vw,2.75rem)] text-[clamp(0.875rem,2vw,1rem)]" 
                      disabled={cart.length === 0}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart - Mobile */}
          <div
            className={cn(
              "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden transition-all duration-300",
              showCart ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div
              className={cn(
                "fixed right-0 top-0 h-full w-full sm:w-[400px] bg-background shadow-lg transition-transform duration-300 ease-out",
                showCart ? "translate-x-0" : "translate-x-full"
              )}
            >
              <Card className="h-full flex flex-col border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4">
                  <CardTitle className="text-[clamp(1.125rem,3vw,1.25rem)]">Cart</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[clamp(0.875rem,2vw,1rem)] text-muted-foreground hover:text-destructive"
                      onClick={() => setShowClearCartDialog(true)}
                      disabled={cart.length === 0}
                    >
                      Clear Cart
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowCart(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4">
                  <ScrollArea className="flex-1 -mx-4 px-4">
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <CartItem
                          key={item.uniqueId}
                          item={item}
                          updateQuantity={updateQuantity}
                          removeFromCart={removeFromCart}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <div className="flex justify-between text-[clamp(1rem,2.5vw,1.125rem)] font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <Button 
                      className="w-full h-[clamp(2.5rem,6vw,2.75rem)] text-[clamp(0.875rem,2vw,1rem)]" 
                      disabled={cart.length === 0}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Volume Selection Modal */}
          <Dialog open={isVolumeModalOpen} onOpenChange={setIsVolumeModalOpen}>
            <DialogContent className="w-[90%] max-w-[500px] p-4 sm:p-6 rounded-lg">
              <DialogHeader className="pb-3 sm:pb-4">
                <DialogTitle className="text-base sm:text-xl font-semibold">
                  {selectedOil?.brand} - {selectedOil?.type}
                </DialogTitle>
              </DialogHeader>

              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] border-2 border-border rounded-lg overflow-hidden bg-muted">
                  {!oilImageError && selectedOil?.image ? (
                    <Image
                      src={selectedOil.image}
                      alt={`${selectedOil.brand} ${selectedOil.type}`}
                      className="object-contain p-2"
                      fill
                      sizes="(max-width: 768px) 120px, 160px"
                      onError={() => setOilImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Volume buttons grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {selectedOil?.volumes.map((volume) => (
                    <Button
                      key={volume.size}
                      variant="outline"
                      className="h-auto py-2 sm:py-3 px-2 sm:px-4 flex flex-col items-center gap-1"
                      onClick={() => handleVolumeClick(volume)}
                    >
                      <div className="text-sm sm:text-base font-medium">{volume.size}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">${volume.price.toFixed(2)}</div>
                    </Button>
                  ))}
                </div>

                {/* Selected volumes list */}
                {selectedVolumes.length > 0 && (
                  <div className="border rounded-lg">
                    <div className="h-[120px] sm:h-[160px] overflow-y-auto scrollbar-none">
                      <div className="px-2 sm:px-3 py-2">
                        {selectedVolumes.map((volume, index) => (
                          <div
                            key={volume.size}
                            className={cn(
                              "flex items-center justify-between py-1.5",
                              index === selectedVolumes.length - 1 && "mb-2 sm:mb-4"
                            )}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 sm:h-9 sm:w-9 shrink-0"
                                onClick={() => handleQuantityChange(volume.size, -1)}
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <span className="w-5 sm:w-6 text-center text-sm sm:text-base">{volume.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 sm:h-9 sm:w-9 shrink-0"
                                onClick={() => handleQuantityChange(volume.size, 1)}
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 px-2 sm:px-3">
                              <span className="font-medium text-sm sm:text-base">{volume.size}</span>
                              <span className="font-medium text-sm sm:text-base whitespace-nowrap">${(volume.price * volume.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between gap-2 sm:gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="px-2 sm:px-6 text-sm sm:text-base"
                    onClick={() => {
                      setIsVolumeModalOpen(false)
                      setSelectedVolumes([])
                    }}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      className="px-2 sm:px-6 text-sm sm:text-base"
                      onClick={handleAddSelectedToCart}
                      disabled={selectedVolumes.length === 0}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10"
                      onClick={handleNextItem}
                      disabled={selectedVolumes.length === 0}
                    >
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Filter Selection Modal */}
          <Dialog
            open={isFilterBrandModalOpen}
            onOpenChange={(open) => {
              setIsFilterBrandModalOpen(open)
              if (!open) {
                setSelectedFilters([])
                setSelectedFilterType(null)
                setFilterImageError(false)
              }
            }}
          >
            <DialogContent className="w-[90%] max-w-[500px] p-4 sm:p-6 rounded-lg">
              <DialogHeader className="pb-3 sm:pb-4">
                <DialogTitle className="text-base sm:text-xl font-semibold">
                  {selectedFilterBrand} - {selectedFilterType}
                </DialogTitle>
              </DialogHeader>

              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] border-2 border-border rounded-lg overflow-hidden bg-muted">
                  {!filterImageError ? (
                    <Image
                      src={`/filters/${selectedFilterBrand?.toLowerCase()}-${selectedFilterType?.toLowerCase().replace(' ', '-')}.jpg`}
                      alt={`${selectedFilterBrand} ${selectedFilterType}`}
                      className="object-contain p-2"
                      fill
                      sizes="(max-width: 768px) 120px, 160px"
                      onError={() => setFilterImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Filter options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {getFiltersByType(selectedFilterType || "")
                    .filter(filter => filter.brand === selectedFilterBrand)
                    .map((filter) => (
                      <Button
                        key={filter.id}
                        variant="outline"
                        className="h-auto py-2 sm:py-3 px-2 sm:px-4 flex flex-col items-center gap-1"
                        onClick={() => handleFilterClick(filter)}
                      >
                        <div className="text-sm sm:text-base font-medium text-center line-clamp-2">{filter.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">${filter.price.toFixed(2)}</div>
                      </Button>
                    ))}
                </div>

                {/* Selected filters list */}
                {selectedFilters.length > 0 && (
                  <div className="border rounded-lg">
                    <div className="h-[120px] sm:h-[160px] overflow-y-auto scrollbar-none">
                      <div className="px-2 sm:px-3 py-2">
                        {selectedFilters.map((filter, index) => (
                          <div
                            key={filter.id}
                            className={cn(
                              "flex items-center justify-between py-1.5",
                              index === selectedFilters.length - 1 && "mb-2 sm:mb-4"
                            )}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 sm:h-9 sm:w-9 shrink-0"
                                onClick={() => handleFilterQuantityChange(filter.id, -1)}
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <span className="w-5 sm:w-6 text-center text-sm sm:text-base">{filter.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 sm:h-9 sm:w-9 shrink-0"
                                onClick={() => handleFilterQuantityChange(filter.id, 1)}
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 px-2 sm:px-3">
                              <span className="font-medium text-sm sm:text-base line-clamp-1">{filter.name}</span>
                              <span className="font-medium text-sm sm:text-base whitespace-nowrap">${(filter.price * filter.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between gap-2 sm:gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="px-2 sm:px-6 text-sm sm:text-base"
                    onClick={() => {
                      setIsFilterBrandModalOpen(false)
                      setSelectedFilters([])
                      setSelectedFilterType(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      className="px-2 sm:px-6 text-sm sm:text-base"
                      onClick={handleAddSelectedFiltersToCart}
                      disabled={selectedFilters.length === 0}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10"
                      onClick={handleNextFilterItem}
                      disabled={selectedFilters.length === 0}
                    >
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Clear Cart Confirmation Dialog */}
          <AlertDialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear your cart? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearCart}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Checkout Modal */}
          <Dialog 
            open={isCheckoutModalOpen} 
            onOpenChange={(open) => {
              // Only allow closing via X button when not in success state
              if (!showSuccess) {
                setIsCheckoutModalOpen(open)
              }
            }}
          >
            <DialogContent 
              className={cn(
                "w-[90%] max-w-[500px] p-6 rounded-lg",
                showSuccess && "[&_button[aria-label='Close']]:hidden"
              )}
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
            >
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-semibold text-center">
                  {showSuccess ? "Payment Complete" : "Select Payment Method"}
                </DialogTitle>
              </DialogHeader>

              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="rounded-full bg-green-100 p-3 mb-4"
                    >
                      <Check className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg font-medium text-green-600 mb-6"
                    >
                      Payment Successful!
                    </motion.p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowSuccess(false)
                        setIsCheckoutModalOpen(false)
                        setShowCart(false)
                        setCart([])
                        setSelectedPaymentMethod(null)
                      }}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
                        className={cn(
                          "h-24 flex flex-col items-center justify-center gap-2",
                          selectedPaymentMethod === 'card' && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedPaymentMethod('card')}
                      >
                        <CreditCard className="w-6 h-6" />
                        <span>Card</span>
                      </Button>
                      <Button
                        variant={selectedPaymentMethod === 'cash' ? 'default' : 'outline'}
                        className={cn(
                          "h-24 flex flex-col items-center justify-center gap-2",
                          selectedPaymentMethod === 'cash' && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedPaymentMethod('cash')}
                      >
                        <Banknote className="w-6 h-6" />
                        <span>Cash</span>
                      </Button>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex justify-between text-lg font-semibold mb-6">
                        <span>Total Amount</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <Button 
                        className="w-full h-12 text-base"
                        disabled={!selectedPaymentMethod}
                        onClick={handlePaymentComplete}
                      >
                        Complete Payment
                      </Button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  )
}

