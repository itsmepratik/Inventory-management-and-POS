"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function HomePage() {
  const [selectedStore, setSelectedStore] = useState("store1")

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm mb-2">
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="store1">Store 1</SelectItem>
                  <SelectItem value="store2">Store 2</SelectItem>
                  <SelectItem value="store3">Store 3</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">Date: 31 Dec 2024</span>
            </div>
            <h1 className="text-2xl font-semibold">Welcome back.</h1>
          </div>
          <Button variant="ghost" className="self-start">
            Edit
          </Button>
        </div>

        <div className="grid gap-6">
          <section>
            <h2 className="text-lg font-semibold mb-4">Key metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Net Sales" value="$12,345.67" comparison="+15.2% from last week" />
              <MetricCard title="Gross sales" value="$15,678.90" comparison="+12.8% from last week" />
              <MetricCard title="Transactions" value="234" comparison="+5.7% from last week" />
              <MetricCard title="Average net sale" value="$52.76" comparison="+8.9% from last week" />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <PaymentType label="Card" amount="$9,876.54" percentage={80} color="bg-blue-500" />
                  <PaymentType label="Cash" amount="$2,345.67" percentage={19} color="bg-green-500" />
                  <PaymentType label="Other" amount="$123.45" percentage={1} color="bg-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top selling items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Product A", sales: 45, revenue: "$1,234.56" },
                    { name: "Service B", sales: 32, revenue: "$987.65" },
                    { name: "Product C", sales: 28, revenue: "$876.54" },
                    { name: "Service D", sales: 21, revenue: "$765.43" },
                    { name: "Product E", sales: 18, revenue: "$654.32" },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="truncate mr-2">{item.name}</span>
                      <span className="text-muted-foreground whitespace-nowrap">{item.sales} sales</span>
                      <span className="whitespace-nowrap">{item.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  )
}

interface MetricCardProps {
  title: string
  value: string
  comparison: string
}

function MetricCard({ title, value, comparison }: MetricCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="text-2xl font-bold truncate">{value}</div>
        <div className="text-sm text-muted-foreground truncate">{comparison}</div>
      </CardContent>
    </Card>
  )
}

interface PaymentTypeProps {
  label: string
  amount: string
  percentage: number
  color: string
}

function PaymentType({ label, amount, percentage, color }: PaymentTypeProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="truncate mr-2">{label}</span>
        <span className="whitespace-nowrap">{amount}</span>
      </div>
      <Progress value={percentage} className={color} />
      <div className="text-sm text-muted-foreground">{percentage}%</div>
    </div>
  )
}

