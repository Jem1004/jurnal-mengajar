'use server'

import { auth } from '@/lib/auth'
import { analyticsService } from '@/lib/services/analytics.service'
import { adminService } from '@/lib/services/admin.service'
import { StatusAbsensi } from '@prisma/client'

// ==================== HELPER: GET AUTHENTICATED USER ====================

async function getAuthenticatedUser() {
  const session = await auth()
  
  if (!session || !session.user) {
    throw new Error('Unauthorized: Please login')
  }
  
  return session.user
}

// ==================== HELPER: CHECK ADMIN AUTHORIZATION ====================

async function checkAdminAuthorization() {
  const user = await getAuthenticatedUser()
  
  if (user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can perform this action')
  }
  
  return user
}

// ==================== GURU ANALYTICS ACTIONS ====================

/**
 * Get keterlaksanaan TP for authenticated guru
 */
export async function getKeterlaksanaanTP(semester?: number, tahunAjaran?: string) {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can access this analytics')
    }

    const stats = await analyticsService.getKeterlaksanaanTP(
      user.guruId,
      semester,
      tahunAjaran
    )

    return {
      success: true,
      data: stats
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get keterlaksanaan TP'
    }
  }
}

/**
 * Get absensi analytics for authenticated guru
 */
export async function getAbsensiAnalytics(days: number = 30) {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can access this analytics')
    }

    const analytics = await analyticsService.getAbsensiAnalytics(user.guruId, days)

    return {
      success: true,
      data: analytics
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get absensi analytics'
    }
  }
}

/**
 * Get tindak lanjut stats for authenticated guru
 */
export async function getTindakLanjutStats() {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can access this analytics')
    }

    const stats = await analyticsService.getTindakLanjutStats(user.guruId)

    return {
      success: true,
      data: stats
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get tindak lanjut stats'
    }
  }
}

/**
 * Mark tindak lanjut as done
 */
export async function markTindakLanjutDone(tagSiswaRecordId: string) {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU') {
      throw new Error('Only guru can mark tindak lanjut as done')
    }

    const result = await analyticsService.markTindakLanjutDone(tagSiswaRecordId)

    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark tindak lanjut as done'
    }
  }
}

/**
 * Get siswa analytics with history
 */
export async function getSiswaAnalytics(siswaId: string) {
  try {
    const user = await getAuthenticatedUser()
    
    // Guru can only see their own data, admin can see all
    const guruId = user.role === 'GURU' && user.guruId ? user.guruId : undefined

    const analytics = await analyticsService.getSiswaAnalytics(siswaId, guruId)

    return {
      success: true,
      data: analytics
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get siswa analytics'
    }
  }
}

/**
 * Get complete analytics for guru dashboard
 */
export async function getGuruAnalyticsDashboard() {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can access this analytics')
    }

    // Fetch all analytics in parallel
    const [keterlaksanaanTP, absensiAnalytics, tindakLanjutStats] = await Promise.all([
      analyticsService.getKeterlaksanaanTP(user.guruId),
      analyticsService.getAbsensiAnalytics(user.guruId, 30),
      analyticsService.getTindakLanjutStats(user.guruId)
    ])

    return {
      success: true,
      data: {
        keterlaksanaanTP,
        absensiAnalytics,
        tindakLanjutStats
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get guru analytics dashboard'
    }
  }
}

// ==================== ADMIN ANALYTICS ACTIONS ====================

/**
 * Get keterisian jurnal report for admin
 */
export async function getKeterisisanJurnal(filters?: {
  startDate?: string
  endDate?: string
  periode?: 'today' | 'week' | 'month' | 'semester'
}) {
  try {
    await checkAdminAuthorization()

    const filterDTO = {
      startDate: filters?.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters?.endDate ? new Date(filters.endDate) : undefined,
      periode: filters?.periode
    }

    const report = await adminService.getKeterisisanJurnal(filterDTO)

    return {
      success: true,
      data: report
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get keterisian jurnal'
    }
  }
}

/**
 * Get aggregate absensi report for admin
 */
export async function getAggregateAbsensi(filters?: {
  startDate?: string
  endDate?: string
  kelasId?: string
  periode?: 'today' | 'week' | 'month' | 'semester'
  statusFilter?: StatusAbsensi[]
}) {
  try {
    await checkAdminAuthorization()

    const filterDTO = {
      startDate: filters?.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters?.endDate ? new Date(filters.endDate) : undefined,
      kelasId: filters?.kelasId,
      periode: filters?.periode,
      statusFilter: filters?.statusFilter
    }

    const report = await adminService.getAggregateAbsensi(filterDTO)

    return {
      success: true,
      data: report
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get aggregate absensi'
    }
  }
}

/**
 * Get dashboard overview for admin
 */
export async function getAdminDashboardOverview() {
  try {
    await checkAdminAuthorization()

    const overview = await adminService.getDashboardOverview()

    return {
      success: true,
      data: overview
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get admin dashboard overview'
    }
  }
}

/**
 * Get guru performance report for admin
 */
export async function getGuruPerformance(
  guruId: string,
  periode?: 'week' | 'month' | 'semester'
) {
  try {
    await checkAdminAuthorization()

    const performance = await adminService.getGuruPerformance(guruId, periode)

    return {
      success: true,
      data: performance
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get guru performance'
    }
  }
}

/**
 * Get complete analytics for admin dashboard
 */
export async function getAdminAnalyticsDashboard(periode?: 'today' | 'week' | 'month' | 'semester') {
  try {
    await checkAdminAuthorization()

    // Fetch all analytics in parallel
    const [overview, keterisisanJurnal, aggregateAbsensi] = await Promise.all([
      adminService.getDashboardOverview(),
      adminService.getKeterisisanJurnal({ periode }),
      adminService.getAggregateAbsensi({ periode })
    ])

    return {
      success: true,
      data: {
        overview,
        keterisisanJurnal,
        aggregateAbsensi
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get admin analytics dashboard'
    }
  }
}
