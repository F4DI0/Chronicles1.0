const Button = ({ children, onClick, className = "", variant = "default" }) => {
  const baseStyle = "px-4 py-2 rounded-md font-semibold transition-all";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export { Button };
