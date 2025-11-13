"use client"

import { useState, useEffect } from "react"
import { Button, Badge } from "@/components/ui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  User,
  ChevronDown,
  Home,
  FileText,
  Database,
  X,
  School
} from "lucide-react"
import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user: {
    nama: string
    role: string
    username?: string
  }
  children: React.ReactNode
}

export function Sidebar({ user, children }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Initialize expanded items based on current path
  const getInitialExpandedItems = () => {
    if (pathname.startsWith('/admin/master/')) {
      return ['Data Master']
    }
    return []
  }

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpandedItems())

  const currentUser = user
  const isAdmin = currentUser.role === "ADMIN"
  const isGuru = currentUser.role === "GURU"

  // Navigation items based on role
  const navItems = isAdmin
    ? [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/jurnal", label: "Monitor Jurnal", icon: BookOpen },
        {
          href: "#",
          label: "Laporan",
          icon: FileText,
          isDropdown: true,
          dropdownItems: [
            { href: "/admin/laporan/keterisian", label: "Keterisian Jurnal", icon: FileText },
            { href: "/admin/laporan/absensi", label: "Agregat Absensi", icon: BarChart3 },
            { href: "/admin/laporan/tujuan-pembelajaran", label: "Tujuan Pembelajaran", icon: School },
          ]
        },
        {
          href: "#",
          label: "Data Master",
          icon: Database,
          isDropdown: true,
          dropdownItems: [
            { href: "/admin/master/guru", label: "Guru", icon: Users },
            { href: "/admin/master/kelas", label: "Kelas", icon: Home },
            { href: "/admin/master/mata-pelajaran", label: "Mata Pelajaran", icon: BookOpen },
            { href: "/admin/master/siswa", label: "Siswa", icon: User },
            { href: "/admin/master/jadwal", label: "Jadwal", icon: Calendar },
          ]
        },
      ]
    : [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/jurnal", label: "Jurnal", icon: BookOpen },
        { href: "/refleksi", label: "Refleksi", icon: School },
        { href: "/riwayat-tp", label: "Riwayat TP", icon: FileText },
        { href: "/analitik", label: "Analitik", icon: BarChart3 },
      ]

  const isActive = (href: string) => {
    if (href === "#") return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login" })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const toggleExpandedItem = (itemLabel: string) => {
    setExpandedItems(prev =>
      prev.includes(itemLabel)
        ? prev.filter(item => item !== itemLabel)
        : [...prev, itemLabel]
    )
  }

  const isExpanded = (itemLabel: string) => {
    return expandedItems.includes(itemLabel)
  }

  // Auto-expand Data Master when navigating to its sub-pages
  useEffect(() => {
    if (pathname.startsWith('/admin/master/') && !expandedItems.includes('Data Master')) {
      setExpandedItems(prev => [...prev, 'Data Master'])
    }
  }, [pathname, expandedItems])

  const NavItem = ({ item, isSubItem = false }: { item: any, isSubItem?: boolean }) => {
    const Icon = item.icon
    const active = isActive(item.href)
    const expanded = isExpanded(item.label)

    if (item.isDropdown && !isSubItem) {
      const hasActiveSubItem = item.dropdownItems?.some((subItem: any) => isActive(subItem.href))

      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleExpandedItem(item.label)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              hasActiveSubItem
                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="truncate">{item.label}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 ml-auto transition-transform duration-200",
                    expanded && "rotate-180"
                  )}
                />
              </>
            )}
          </button>

          {!isCollapsed && expanded && (
            <div className="ml-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {item.dropdownItems?.map((dropdownItem: any) => {
                const DropdownIcon = dropdownItem.icon
                const subActive = isActive(dropdownItem.href)

                return (
                  <Link
                    key={dropdownItem.href}
                    href={dropdownItem.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                      subActive
                        ? "bg-green-50 text-green-700 border-l-2 border-green-400"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <DropdownIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{dropdownItem.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          active
            ? "bg-green-50 text-green-700 border-l-4 border-green-500"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
          isCollapsed && "justify-center px-2",
          isSubItem && "ml-2"
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </Link>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <School className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Jurnal Mengajar
                </h1>
                <p className="text-xs text-gray-500">
                  {isAdmin ? "Admin Panel" : "Teacher Dashboard"}
                </p>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <Link
              href={isAdmin ? "/admin/dashboard" : "/dashboard"}
              className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto"
            >
              <School className="w-5 h-5 text-white" />
            </Link>
          )}

          <div className="flex items-center gap-1">
            {/* Collapse Toggle (Desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Close Button (Mobile) */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-gray-50"
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm font-medium">
                      {currentUser.nama?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {currentUser.nama}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={isAdmin ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {isAdmin ? "Admin" : "Guru"}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.nama}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      @{(currentUser as any)?.username || currentUser.nama?.toLowerCase().replace(/\s+/g, '.')}
                    </p>
                    <Badge variant={isAdmin ? "default" : "secondary"} className="w-fit mt-1">
                      {isAdmin ? "Administrator" : "Guru"}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isGuru && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center space-x-2 w-full">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/jurnal" className="flex items-center space-x-2 w-full">
                        <BookOpen className="w-4 h-4" />
                        <span>Jurnal Saya</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/analitik" className="flex items-center space-x-2 w-full">
                        <BarChart3 className="w-4 h-4" />
                        <span>Analitik</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="flex items-center space-x-2 w-full">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/laporan/keterisian" className="flex items-center space-x-2 w-full">
                        <FileText className="w-4 h-4" />
                        <span>Laporan</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Collapsed User Profile */}
        {isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 w-8 rounded-full mx-auto"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm font-medium">
                      {currentUser.nama?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" side="right">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.nama}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      @{(currentUser as any)?.username || currentUser.nama?.toLowerCase().replace(/\s+/g, '.')}
                    </p>
                    <Badge variant={isAdmin ? "default" : "secondary"} className="w-fit mt-1">
                      {isAdmin ? "Administrator" : "Guru"}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <School className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Jurnal Mengajar</span>
            </div>

            <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
              {isAdmin ? "Admin" : "Guru"}
            </Badge>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-custom-lg border border-gray-100 p-6 md:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}