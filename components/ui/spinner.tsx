import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-2',
      lg: 'h-12 w-12 border-3',
      xl: 'h-16 w-16 border-4'
    }
    
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn('inline-block', className)}
        {...props}
      >
        <div
          className={cn(
            'animate-spin rounded-full border-solid border-primary-600 border-t-transparent',
            sizes[size]
          )}
        />
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

export default Spinner
