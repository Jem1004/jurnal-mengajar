import { ReactNode } from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SidebarWrapper } from '@/components/layout/sidebar-wrapper'

export default async function GuruLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session || !session.user || session.user.role !== 'GURU') {
    redirect('/login')
  }

  return (
    <SidebarWrapper user={session.user}>
      {children}
    </SidebarWrapper>
  )
}
