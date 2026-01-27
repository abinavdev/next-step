import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary-foreground border border-primary/40 backdrop-blur-md shadow-soft hover:bg-primary/15 hover:border-primary/60 active:scale-[0.98]",
        destructive:
          "bg-destructive/15 text-destructive-foreground border border-destructive/50 backdrop-blur-md shadow-soft hover:bg-destructive/25 active:scale-[0.98]",
        outline:
          "bg-background/40 text-foreground border border-border/70 backdrop-blur-md hover:bg-background/60 hover:border-border",
        secondary:
          "bg-secondary/20 text-secondary-foreground border border-secondary/40 backdrop-blur-md hover:bg-secondary/30",
        ghost:
          "bg-transparent text-accent-foreground border border-transparent hover:bg-accent/10 hover:border-accent/30 backdrop-blur-md",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-background/30 text-primary-foreground border border-primary/40 backdrop-blur-lg shadow-glow hover:bg-background/45 active:scale-[0.98]",
        accent:
          "bg-accent/12 text-accent-foreground border border-accent/40 backdrop-blur-md shadow-soft hover:bg-accent/18 active:scale-[0.98]",
        hero:
          "bg-background/25 text-primary-foreground border border-primary/50 backdrop-blur-lg shadow-glow text-base px-8 py-3 rounded-xl hover:bg-background/40 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-12 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
