import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-white text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Modern 2025 card variants
export const ModernCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'glass' | 'gradient' | 'elevated'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-white border-gray-200 shadow-sm",
    glass: "bg-white/80 backdrop-blur-md border-white/20 shadow-xl",
    gradient: "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-xl",
    elevated: "bg-white border-gray-200 shadow-2xl hover:shadow-3xl"
  }

  return (
    <Card
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-out hover:scale-[1.02]",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
ModernCard.displayName = "ModernCard"

export const InfoCard = ({
  icon,
  title,
  description,
  variant = 'info'
}: {
  icon: React.ReactNode
  title: string
  description: string
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'secondary'
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600 bg-blue-100',
      title: 'text-blue-900',
      description: 'text-blue-700'
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-600 bg-green-100',
      title: 'text-green-900',
      description: 'text-green-700'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600 bg-yellow-100',
      title: 'text-yellow-900',
      description: 'text-yellow-700'
    },
    danger: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600 bg-red-100',
      title: 'text-red-900',
      description: 'text-red-700'
    },
    secondary: {
      bg: 'bg-gray-50 border-gray-200',
      icon: 'text-gray-600 bg-gray-100',
      title: 'text-gray-900',
      description: 'text-gray-700'
    }
  }

  const colors = variants[variant]

  return (
    <div className={cn("rounded-xl p-6 border transition-all duration-200", colors.bg)}>
      <div className="flex items-start gap-4">
        <div className={cn("flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center", colors.icon)}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={cn("font-semibold mb-1", colors.title)}>
            {title}
          </h3>
          <p className={cn("text-sm", colors.description)}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }