import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border-[3px] border-navy px-3 py-1 text-[13px] font-semibold tracking-tight transition-all focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "bg-white text-navy",
        outline: "bg-transparent text-navy shadow-none",
        active: "bg-[hsl(var(--paint-2))] text-white shadow-hand-sm",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
