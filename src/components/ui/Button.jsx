import React from 'react'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium transition-all duration-300 outline-none rounded-sm'

  const variants = {
    primary: 'bg-ink text-cream hover:bg-ink/90 active:scale-[0.98]',
    secondary: 'border border-stone text-ink hover:border-muted/40 hover:bg-stone/30',
    ghost: 'text-ink hover:bg-stone/40',
    outline: 'border border-stone text-ink hover:border-muted/50 hover:bg-cream',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
