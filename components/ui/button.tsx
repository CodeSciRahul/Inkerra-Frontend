import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "./buttonVariant";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// ForwardRef with a single component type (either Slot or button) to avoid hydration mismatch.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Ensuring consistent component between SSR and CSR
    const Component = asChild ? Slot : "button";
    
    return (
      <Component
        className={cn(buttonVariants({ variant, size }), className)} // Ensure className merging is correct
        ref={ref}
        {...(Component === "button" ? props : {})} // Only pass props compatible with button
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
