import { cn } from "../utils/cn";

export const Button = ({ variant="primary", size="md", className, children, ...props }) => {
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-soft",
    secondary: "bg-white border border-border hover:bg-gray-50 text-charcoal",
    ghost: "hover:bg-gray-100 text-charcoal",
    outline: "border border-primary-600 text-primary-600 hover:bg-primary-50",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-5 py-2.5 text-sm font-medium rounded-xl",
    lg: "px-7 py-3.5 text-base font-semibold rounded-2xl",
    icon: "p-2.5 rounded-xl",
  };
  return <button className={cn("inline-flex items-center justify-center gap-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed", variants[variant], sizes[size], className)} {...props}>{children}</button>;
};

export const Card = ({ className, children, ...props }) => (
  <div className={cn("bg-white rounded-2xl border border-border shadow-card", className)} {...props}>{children}</div>
);

export const Badge = ({ children, variant="default", className }) => {
  const v = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary-50 text-primary-700 border border-primary-100",
    amber: "bg-amber-50 text-amber-700 border border-amber-100",
    violet: "bg-violet-50 text-violet-700 border border-violet-100",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", v[variant], className)}>{children}</span>;
};

export const Input = ({ label, error, className, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-charcoal">{label}</label>}
    <input className={cn("w-full px-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition text-sm", error && "border-red-300 focus:border-red-500 focus:ring-red-100", className)} {...props} />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export const Select = ({ label, children, error, className, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-charcoal">{label}</label>}
    <select className={cn("w-full px-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm", className)} {...props}>{children}</select>
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export const Skeleton = ({ className }) => <div className={cn("animate-pulse bg-gray-100 rounded-xl", className)} />;

export const EmptyState = ({ icon, title, desc, action }) => (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">{icon}</div>
    <h3 className="font-semibold text-charcoal">{title}</h3>
    <p className="text-sm text-muted mt-1 max-w-sm mx-auto">{desc}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
