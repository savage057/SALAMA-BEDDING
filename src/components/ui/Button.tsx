import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-medium tracking-wide uppercase transition-all duration-400 cursor-pointer';

  const variants = {
    primary:
      'bg-charcoal text-white border-1.5 border-charcoal hover:bg-accent-glow hover:border-transparent hover:shadow-[0_4px_20px_rgba(43,43,43,0.15)] hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-transparent text-charcoal btn-glow',
    ghost:
      'bg-transparent text-charcoal border-transparent hover:bg-surface hover:text-accent-glow',
    gold:
      'bg-gold text-white border-1.5 border-gold hover:bg-gold-light hover:border-gold-light hover:shadow-[0_4px_20px_rgba(196,163,90,0.25)] hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'text-xs px-5 py-2.5 tracking-[0.12em]',
    md: 'text-sm px-7 py-3.5 tracking-[0.1em]',
    lg: 'text-sm px-10 py-4.5 tracking-[0.12em]',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
