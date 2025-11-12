"use client"

import { Sidebar } from './sidebar'

interface SidebarWrapperProps {
  user: {
    nama: string
    role: string
    username?: string
  }
  children: React.ReactNode
}

export function SidebarWrapper({ user, children }: SidebarWrapperProps) {
  return <Sidebar user={user}>{children}</Sidebar>
}