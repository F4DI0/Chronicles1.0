
const Card = ({ children, className }) => {
  return <div className={`rounded-lg border p-4 shadow-md ${className}`}>{children}</div>;
};

const CardHeader = ({ children }) => {
  return <div className="mb-2 text-lg font-bold">{children}</div>;
};

const CardContent = ({ children }) => {
  return <div className="text-gray-700">{children}</div>;
};

const CardTitle = ({ children }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

export { Card, CardHeader, CardContent, CardTitle };
