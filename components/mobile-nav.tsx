"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import { useUser } from "@/app/user-context"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { currentUser } = useUser()

  const handleSettingsClick = () => {
    setOpen(false)
    router.push("/settings")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("md:hidden", className)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>My Business</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-medium mb-2">Quick access</h2>
            <NavItem href="/" onClick={() => setOpen(false)}>
              Home
            </NavItem>
            <NavItem href="/pos" onClick={() => setOpen(false)}>
              POS
            </NavItem>
            <NavItem href="/items" onClick={() => setOpen(false)}>
              Items
            </NavItem>
            <NavItem href="/orders" onClick={() => setOpen(false)}>
              Orders
            </NavItem>
            <NavItem href="/transactions" onClick={() => setOpen(false)}>
              Transactions
            </NavItem>
            {currentUser?.role === "admin" && (
              <NavItem href="/admins" onClick={() => setOpen(false)}>
                Admins
              </NavItem>
            )}
            <NavItem href="/reports" onClick={() => setOpen(false)}>
              Reports
            </NavItem>
          </div>

          <div className="space-y-1">
            <NavItem href="#" onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </NavItem>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface NavItemProps {
  href: string
  children: ReactNode
  onClick?: () => void
}

function NavItem({ href, children, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </Link>
  )
}

