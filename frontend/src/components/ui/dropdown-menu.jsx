import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={4}
      className={`z-50 min-w-[8rem] overflow-hidden border border-slate-200 bg-white p-1 text-slate-900 shadow-md ${className}`}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ className = "", ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref} className={`relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none hover:bg-slate-100 ${className}`} {...props} />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef(({ className = "", ...props }, ref) => (
  <DropdownMenuPrimitive.Label ref={ref} className={`px-2 py-1.5 text-sm font-semibold ${className}`} {...props} />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef(({ className = "", ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={`-mx-1 my-1 h-px bg-slate-200 ${className}`} {...props} />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
};
