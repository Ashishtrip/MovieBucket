import React from 'react';

/**
 * Reusable Button component with consistent theming and variants.
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary'] - Visual style.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size.
 * @param {boolean} [props.fullWidth=false] - Expand to container width.
 * @param {boolean} [props.disabled=false] - Disabled state.
 * @param {string} [props.className] - Additional Tailwind classes.
 * @param {Function} [props.onClick] - Click handler.
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Button type.
 * @param {React.ReactNode} props.children - Button content.
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  children,
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center font-bold rounded-full transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow focus-visible:ring-offset-2 focus-visible:ring-offset-themeBase disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-themeAccent text-themeBase shadow-glow hover:bg-themeGlow hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]',
    secondary:
      'bg-themeBase border border-themeAccent text-themeAccent hover:bg-themeGlow hover:text-themeBase hover:border-themeGlow',
    ghost:
      'bg-transparent text-themeAccent hover:text-themeGlow hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]',
  };

  const sizes = {
    sm: 'py-1.5 px-4 text-sm',
    md: 'py-2 px-6 text-sm',
    lg: 'py-3 px-8 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
