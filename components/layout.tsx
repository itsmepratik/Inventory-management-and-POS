"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  Package,
  ClipboardList,
  RefreshCcw,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  User,
  BarChart2,
  LogOut,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MobileNav } from "./mobile-nav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type React from "react"
import { useUser } from "@/app/user-context"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { currentUser } = useUser()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar - collapsible */}
      <div
        className={cn(
          "hidden md:flex md:flex-col border-r bg-background transition-all duration-300",
          collapsed ? "md:w-16" : "md:w-64",
        )}
      >
        <div className="h-16 flex items-center px-4 border-b justify-between">
          {!collapsed && <span className="text-lg font-semibold">My Business</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("shrink-0", collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            {!collapsed && <h2 className="text-sm font-medium mb-2">Quick access</h2>}
            <NavItem href="/" icon={<Home className="w-4 h-4" />} collapsed={collapsed}>
              Home
            </NavItem>
            <NavItem href="/pos" icon={<ShoppingCart className="w-4 h-4" />} collapsed={collapsed}>
              POS
            </NavItem>
            <NavItem href="/items" icon={<Package className="w-4 h-4" />} collapsed={collapsed}>
              Items
            </NavItem>
            <NavItem href="/orders" icon={<ClipboardList className="w-4 h-4" />} collapsed={collapsed}>
              Orders
            </NavItem>
            <NavItem href="/transactions" icon={<RefreshCcw className="w-4 h-4" />} collapsed={collapsed}>
              Transactions
            </NavItem>
            {mounted && currentUser?.role === "admin" && (
              <NavItem href="/admins" icon={<Users className="w-4 h-4" />} collapsed={collapsed}>
                Admins
              </NavItem>
            )}
          </div>

          <div className="space-y-1">
            <NavItem href="/reports" icon={<BarChart2 className="w-4 h-4" />} collapsed={collapsed}>
              Reports
            </NavItem>
            <NavItem href="/settings" icon={<Settings className="w-4 h-4" />} collapsed={collapsed}>
              Settings
            </NavItem>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 flex items-center justify-between px-4">
        <div className="flex items-center">
          <MobileNav className="mr-2" />
          <span className="font-semibold">My Business</span>
        </div>
        <ProfileMenu />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col mt-16 md:mt-0">
        {/* Desktop header */}
        <header className="hidden md:flex h-16 border-b items-center justify-end px-4">
          <ProfileMenu />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  collapsed?: boolean
  className?: string
}

function NavItem({ href, icon, children, collapsed, className }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-2",
        className,
      )}
      title={collapsed ? String(children) : undefined}
    >
      {icon}
      {!collapsed && children}
    </Link>
  )
}

function ProfileMenu() {
  const router = useRouter()

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  const handleLogout = () => {
    // Here you would typically handle the logout process
    // For example, clearing the authentication token from storage
    // Then redirect to the auth page
    router.push("/auth")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@username" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

