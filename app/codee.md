import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface SaleItemVariant {
size: string;
quantity: number;
unitPrice: number;
totalSales: number;
}

interface SaleItem {
name: string;
category: "fluid" | "part" | "service";
quantity: number;
unitPrice: number;
totalSales: number;
variants?: SaleItemVariant[];
}

const salesData: SaleItem[] = [
{
name: "Shell Helix Oil",
category: "fluid",
quantity: 5,
unitPrice: 45.00,
totalSales: 225.00,
variants: [
{ size: "5L", quantity: 2, unitPrice: 55.00, totalSales: 110.00 },
{ size: "2L", quantity: 3, unitPrice: 38.50, totalSales: 115.00 }
]
},
{
name: "Castrol Coolant",
category: "fluid",
quantity: 8,
unitPrice: 25.00,
totalSales: 200.00,
variants: [
{ size: "4L", quantity: 3, unitPrice: 32.00, totalSales: 96.00 },
{ size: "1L", quantity: 5, unitPrice: 20.80, totalSales: 104.00 }
]
},
{
name: "Oil Filter",
category: "part",
quantity: 15,
unitPrice: 12.00,
totalSales: 180.00
},
{
name: "Standard Oil Change",
category: "service",
quantity: 20,
unitPrice: 45.00,
totalSales: 900.00
},
{
name: "Brake Fluid",
category: "fluid",
quantity: 6,
unitPrice: 15.00,
totalSales: 90.00,
variants: [
{ size: "500ml", quantity: 4, unitPrice: 12.50, totalSales: 50.00 },
{ size: "1L", quantity: 2, unitPrice: 20.00, totalSales: 40.00 }
]
},
];

export default function SalesReport() {
const [expandedItems, setExpandedItems] = useState<string[]>([]);

const toggleItem = (itemName: string) => {
setExpandedItems(prev =>
prev.includes(itemName)
? prev.filter(name => name !== itemName)
: [...prev, itemName]
);
};

return (
<div className="space-y-6">
<div className="flex items-center gap-4">
<Link to="/" className="text-gray-500 hover:text-gray-700">
<ArrowLeft className="h-5 w-5" />
</Link>
<h1 className="text-2xl font-semibold">Detailed Sales Report</h1>
</div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Items Sold</h2>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Item Name</th>
                <th className="px-6 py-3 text-right">Quantity</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                <th className="px-6 py-3 text-right">Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item) => (
                <>
                  <tr
                    key={item.name}
                    className={`border-b ${item.category === "fluid" ? "cursor-pointer hover:bg-gray-50" : ""}`}
                    onClick={() => item.category === "fluid" && toggleItem(item.name)}
                  >
                    <td className="px-6 py-4 font-medium">
                      <span className={item.category === "fluid" ? `${expandedItems.includes(item.name) ? "text-primary" : "text-gray-900"} hover:text-primary transition-colors` : ""}>
                        {item.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">{item.quantity} units</td>
                    <td className="px-6 py-4 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">${item.totalSales.toFixed(2)}</td>
                  </tr>
                  {item.category === "fluid" && expandedItems.includes(item.name) && item.variants?.map((variant) => (
                    <tr key={`${item.name}-${variant.size}`} className="border-b bg-gray-50">
                      <td className="px-6 py-3 pl-12 text-sm text-gray-600">
                        {variant.size}
                      </td>
                      <td className="px-6 py-3 text-right text-sm text-gray-600">
                        {variant.quantity} units
                      </td>
                      <td className="px-6 py-3 text-right text-sm text-gray-600">
                        ${variant.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right text-sm text-gray-600">
                        ${variant.totalSales.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-lg">
                <td colSpan={3} className="px-6 pt-8">Total Sales</td>
                <td className="px-6 pt-8 text-right">
                  ${salesData.reduce((sum, item) => sum + item.totalSales, 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>

);
}
