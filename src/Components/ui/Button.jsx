export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = ''
}) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    ghost: 'hover:bg-gray-100 text-gray-700'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}
