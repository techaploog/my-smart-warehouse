import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface NoItemProps {
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export const NoItem = ({ title, description, className, children }: NoItemProps) => {
  const heading = title ?? "No items found";
  return (
    <div
      className={cn(
        "flex-center w-full flex-col gap-1 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center text-slate-500",
        className,
      )}
    >
      <p className="text-base font-medium text-slate-600">{heading}</p>
      {description ? <p className="text-muted-foreground max-w-md text-sm">{description}</p> : null}
      {children}
    </div>
  );
};
