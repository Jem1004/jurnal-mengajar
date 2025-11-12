export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-50/30 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
