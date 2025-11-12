'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
  preventClose?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
  preventClose = false
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !preventClose) {
        e.preventDefault()
        onClose()
      }
    }

    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement

      // Add event listener
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      // Focus trap within modal
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>

          if (focusableElements.length > 0) {
            focusableElements[0].focus()
          }
        }
      }, 100)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'

      // Restore focus
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose, preventClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && !preventClose && e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCloseClick = () => {
    if (!preventClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Portal container to avoid stacking context issues */}
      <div className="fixed inset-0 z-[9999]">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal container with improved positioning */}
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            ref={modalRef}
            className={cn(
              'relative z-50 w-full rounded-2xl bg-white shadow-2xl border border-gray-100',
              'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300',
              'max-h-[90vh] flex flex-col my-auto',
              sizes[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-describedby={description ? 'modal-description' : undefined}
          >
        {/* Enhanced Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 id="modal-title" className="text-xl font-bold text-gray-900 truncate">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-gray-500 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && !preventClose && (
              <button
                onClick={handleCloseClick}
                className="ml-4 flex-shrink-0 rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Enhanced Content with scroll */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-end gap-3 border-t border-gray-200 pt-6', className)}
      {...props}
    />
  )
}
