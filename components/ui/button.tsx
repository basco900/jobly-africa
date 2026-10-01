import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#173d31]/10 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#173d31] text-white hover:bg-[#214c3d]",
        outline: "border border-[#e4e7e0] bg-white text-[#183d31] hover:border-[#cad8ce] hover:bg-[#f7faf7]",
        subtle: "bg-[#e8f0eb] text-[#173d31] hover:bg-[#deebe3]",
        chip: "rounded-lg border border-transparent bg-[#f0f2ed] text-[#687168] hover:bg-[#e9eee9] hover:text-[#173d31]",
        selected: "rounded-lg border border-transparent bg-[#173d31] text-white hover:bg-[#214c3d]",
        ghost: "bg-transparent text-[#687168] hover:bg-[#f0f3ef] hover:text-[#173d31]",
      },
      size: {
        default: "h-12 px-4 text-[13px]",
        sm: "h-9 rounded-xl px-3 text-[11px]",
        lg: "h-[54px] px-5 text-[13px]",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
