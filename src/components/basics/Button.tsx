
type ButtonProps = {
  children: React.ReactNode
  onClick?:() => void
  className?: string
  center?: boolean
}

export default function Button({ children, onClick, className, center = true }: ButtonProps) {
  return (
    <button onClick={onClick} className={`inline-flex items-center ${center ? 'justify-center' : ''} gap-2 h-10 p-2 w-full cursor-pointer rounded px-4 py-2 text-sm font-medium transition-colors ease-in-out duration-200 ${className || 'bg-primary  text-white hover:bg-primary-700 '}`}>
      {children}
    </button>
  )
}