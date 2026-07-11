import type React from "react";
import type { ReactNode } from "react";

// ─── SHADCN CARD COMPONENTS ───
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-black/5 bg-white text-charcoal shadow-sm transition-all duration-300 hover:shadow-md ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 border-b border-black/5 ${className ?? ""}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h3 className={`font-display text-lg font-bold leading-none tracking-tight text-charcoal ${className ?? ""}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return (
    <p className={`text-xs text-charcoal-soft/80 ${className ?? ""}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={`p-6 pt-4 ${className ?? ""}`} {...props}>
      {children}
    </div>
  );
}


// ─── SHADCN TABLE COMPONENTS ───
export function Table({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto rounded-xl border border-black/5 bg-white shadow-sm">
      <table className={`w-full caption-bottom text-sm ${className ?? ""}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-cream-soft/50 border-b border-black/5 ${className ?? ""}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className ?? ""}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b border-black/5 transition-colors hover:bg-cream-soft/40 data-[state=selected]:bg-cream-soft lg:table-row flex flex-col p-4 lg:p-0 lg:flex-row ${className ?? ""}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle text-xs font-bold uppercase tracking-wider text-charcoal-soft/80 [&:has([role=checkbox])]:pr-0 lg:table-cell hidden ${className ?? ""}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 text-charcoal-soft font-medium lg:table-cell block ${className ?? ""}`}
      {...props}
    >
      {children}
    </td>
  );
}


// ─── SHADCN BADGE COMPONENT ───
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
  children: ReactNode;
}

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  const baseStyle = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "bg-caramel text-white hover:bg-caramel-deep",
    secondary: "bg-cream-soft text-charcoal hover:bg-cream-soft/80 border border-black/5",
    destructive: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 border border-rose-500/10",
    success: "bg-jade/12 text-jade-deep hover:bg-jade/20 border border-jade/10",
    outline: "text-charcoal border border-black/10 hover:bg-cream-soft/20",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className ?? ""}`} {...props}>
      {children}
    </span>
  );
}


// ─── SHADCN TABS COMPONENTS ───
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-xl bg-cream-soft/70 border border-black/5 p-1 text-charcoal-soft ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  children: ReactNode;
}

export function TabsTrigger({ isActive, children, className, ...props }: TabsTriggerProps) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold tracking-wide transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-white text-charcoal shadow-sm border border-black/5"
          : "text-charcoal-soft/80 hover:bg-white/40 hover:text-charcoal"
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
