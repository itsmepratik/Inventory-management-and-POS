"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layout } from "@/components/layout"
import { ShoppingCart, ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

export default function OrdersPage() {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  const toggleFilters = () => setIsFilterExpanded(!isFilterExpanded)

  return (
    <Layout>
      <div className="space-y-4 max-w-[100vw] overflow-hidden">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">All orders</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="w-full sm:w-auto text-sm">
              Export
            </Button>
            <Button className="w-full sm:w-auto text-sm">Create Order</Button>
          </div>
        </div>

        {/* Tabs - scrollable on all screen sizes */}
        <ScrollArea className="w-full whitespace-nowrap">
          <Tabs defaultValue="all" className="w-max">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollArea>

        {/* Filters - responsive layout */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Input placeholder="Search" className="w-full max-w-sm" />
            <Button variant="outline" size="sm" className="ml-2 sm:hidden" onClick={toggleFilters}>
              Filters
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isFilterExpanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
          <div className={`flex flex-wrap gap-2 ${isFilterExpanded ? "" : "hidden sm:flex"}`}>
            <Select>
              <SelectTrigger className="w-[clamp(120px,calc(50%-0.5rem),200px)]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[clamp(120px,calc(50%-0.5rem),200px)]">
                <SelectValue placeholder="Type: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[clamp(120px,calc(50%-0.5rem),200px)]">
                <SelectValue placeholder="Payment status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[clamp(120px,calc(50%-0.5rem),200px)]">
                <SelectValue placeholder="Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[clamp(120px,calc(50%-0.5rem),200px)]">
                <SelectValue placeholder="Order sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="import">Import</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Empty state - center on all screens */}
        <div className="flex flex-col items-center justify-center min-h-[400px] border rounded-lg p-4 md:p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Online Orders</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            This is where you'll manage all orders.
          </p>
        </div>
      </div>
    </Layout>
  )
}

