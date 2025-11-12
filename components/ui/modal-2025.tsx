'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPrimitive,
} from './dialog'

export interface Modal2025Props {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
  preventClose?: boolean
  loading?: boolean
  footer?: React.ReactNode
}

export default function Modal2025({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
  preventClose = false,
  loading = false,
  footer
}: Modal2025Props) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl',
    '4xl': 'max-w-8xl',
    '5xl': 'max-w-9xl'
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !preventClose && onClose()}>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent
        className={cn(
          "bg-white/95 backdrop-blur-xl border-0 shadow-2xl transform transition-all duration-300 ease-out",
          sizeClasses[size],
          className
        )}
      >
        {/* Header with gradient background */}
        {(title || description) && (
          <DialogHeader className="relative">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-t-lg opacity-50" />
            <div className="relative p-6 pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {title && (
                    <DialogTitle className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {title}
                    </DialogTitle>
                  )}
                  {description && (
                    <DialogDescription className="text-gray-600 mt-2 font-medium">
                      {description}
                    </DialogDescription>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 relative group"
                    disabled={loading}
                  >
                    <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </button>
                )}
              </div>
              {/* Decorative line */}
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>
          </DialogHeader>
        )}

        {/* Body */}
        <div className="p-6 pt-0 pb-0">
          <div className="relative">
            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Processing...</span>
                </div>
              </div>
            )}
            {/* Content with subtle background */}
            <div className="bg-gradient-to-br from-gray-50/50 to-white/50 rounded-lg p-1">
              <div className="bg-white rounded-lg">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 pt-0">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-1">
              <div className="bg-white rounded-lg p-4">
                {footer}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Additional utility components
export const ModalAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'primary' | 'secondary' | 'danger'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200',
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg'
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
ModalAction.displayName = 'ModalAction'

export const ModalIcon = ({
  icon,
  label,
  className
}: {
  icon: React.ReactNode
  label: string
  className?: string
}) => (
  <div className={cn("flex items-center gap-3", className)}>
    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-900">{label}</p>
    </div>
  </div>
)