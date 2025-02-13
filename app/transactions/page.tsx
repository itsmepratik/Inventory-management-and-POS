"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react'
import { cn } from "@/lib/utils"

const timeFrameOptions = [
  "Today",
  "Yesterday",
  "This week",
  "Last week",
  "This month",
  "Last month",
  "This year",
  "Last year",
]

export default function TransactionsPage() {
  const [selectedDate, setSelectedDate] = useState("31/12/2024")
  const [showDatePicker, setShowDatePicker] = useState(false)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Mobile Date Selector */}
        <div className="md:hidden">
          <Card className="rounded-none -mx-4">
            <div className="flex items-center justify-between p-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="text-lg font-semibold">
                    {selectedDate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-screen p-0" align="start">
                  <div className="space-y-1 p-1">
                    {timeFrameOptions.map((option) => (
                      <Button
                        key={option}
                        variant="ghost"
                        className="w-full justify-start text-left font-normal"
                        onClick={() => {
                          setSelectedDate(option)
                          setShowDatePicker(false)
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Desktop/Tablet Filters */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select defaultValue={selectedDate}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue>{selectedDate}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timeFrameOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Select defaultValue="all-day">
              <SelectTrigger className="w-[120px]">
                <SelectValue>All day</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-day">All day</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-payment">
              <SelectTrigger className="w-[180px]">
                <SelectValue>All Payment Methods</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-payment">All Payment Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-types">
              <SelectTrigger className="w-[120px]">
                <SelectValue>All Types</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="complete">
              <SelectTrigger className="w-[120px]">
                <SelectValue>Complete</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-sources">
              <SelectTrigger className="w-[140px]">
                <SelectValue>All Sources</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-sources">All Sources</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-fees">
              <SelectTrigger className="w-[120px]">
                <SelectValue>All Fees</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-fees">All Fees</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Select defaultValue="card-number">
                <SelectTrigger className="w-[120px]">
                  <SelectValue>Card #</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card-number">Card #</SelectItem>
                  <SelectItem value="last-4">Last 4</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by card (last 4)"
                  className="pl-8 w-[200px]"
                />
              </div>
            </div>

            <div className="ml-auto">
              <Select defaultValue="export">
                <SelectTrigger className="w-[120px]">
                  <FileText className="mr-2 h-4 w-4" />
                  <SelectValue>Export</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Date Display */}
        <div className="text-2xl font-bold">31 Dec 2024</div>

        {/* Empty State */}
        <Card className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            No Transactions in this Time Frame
          </h2>
          <p className="text-muted-foreground">
            No transactions took place during the time frame you selected.
          </p>
        </Card>
      </div>
    </Layout>
  )
}

