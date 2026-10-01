"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ArrowDown01Icon, ArrowUp01Icon, CheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#849087]", className)}
      {...props}
    />
  );
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "jobly-select-trigger flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-transparent bg-[#f1f3ef] px-3.5 text-left text-[12px] font-medium text-[#343a34] outline-none transition-colors hover:bg-[#eaf0eb] focus-visible:ring-4 focus-visible:ring-[#173d31]/[0.07] data-[placeholder]:text-[#777f76] [&>span]:min-w-0 [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.7} className="shrink-0 text-[#456456] transition-transform duration-200" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={6}
        className={cn(
          "jobly-select-content relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-[#e7eae5] bg-white p-1 text-[#202520] shadow-[0_8px_22px_rgba(28,45,34,0.08)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="jobly-select-scroll-button" aria-label="Scroll options up">
          <HugeiconsIcon icon={ArrowUp01Icon} size={16} strokeWidth={1.7} />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="max-h-[inherit] p-0.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="jobly-select-scroll-button" aria-label="Scroll options down">
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.7} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, count, ...props }: React.ComponentProps<typeof SelectPrimitive.Item> & { count?: number }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-8 w-full cursor-pointer select-none items-center rounded-md py-1 pl-2.5 pr-8 text-[11px] outline-none transition-colors focus:bg-[#edf3ef] focus:text-[#173d31] data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[state=checked]:bg-[#f3f7f4] data-[state=checked]:font-semibold",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {count !== undefined && <span className="jobly-select-count" aria-hidden="true">{count.toLocaleString()}</span>}
      <span className="absolute right-3 inline-flex size-4 items-center justify-center text-[#173d31]">
        <SelectPrimitive.ItemIndicator>
          <HugeiconsIcon icon={CheckIcon} size={14} strokeWidth={2} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel };
